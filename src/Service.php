<?php
/**
 * CookieX Onboarding
 *
 * This file contains functions for integrating the CookieX onboarding
 * into a WordPress Admin. It includes functionality for regitering the
 * domain, scanning for cookies, creating a banner, and activating the
 * consent management.
 *
 * @package CookieX
 * @version 1.0.5
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Fetch and store the API server URL from CookieX CDN
 *
 * @return string|bool API server URL if successful, false on failure
 */
function cookiex_cmp_fetch_api_server(): string|bool {
	$api_server = get_option( 'cookiex_cmp_api_server' );
	if ( $api_server ) {
		return $api_server;
	}

	$request_url = COOKIEX_CMP_CDN_URL . '/region.json';
	
	$response = wp_remote_get( $request_url );

	if ( is_wp_error( $response ) ) {
		return false;
	}

	$body = wp_remote_retrieve_body( $response );
	$data = json_decode( $body, true );

	if ( ! is_array( $data ) || ! isset( $data['api_server'] ) ) {
		return false;
	}

	update_option( 'cookiex_cmp_api_server', $data['api_server'] );
	update_option( 'cookiex_cmp_server_country', $data['country'] );
	update_option( 'cookiex_cmp_languages_available', $data['languages'] );
	return $data['api_server'];
}

/**
 * Register the domain with CookieX API server
 *
 * @return bool True if registration successful, false otherwise
 */
function cookiex_cmp_register_domain(): array {
    // Check if domain is already registered
    $domain_id  = get_option('cookiex_cmp_domain_id');
    $auth_token = get_option('cookiex_cmp_auth_token');
    if ($domain_id && $auth_token) {
        return array('status' => true, 'message' => 'Domain already registered.');
    }

    $api_server = cookiex_cmp_fetch_api_server();
    if (!$api_server) {
        return array('status' => false, 'message' => 'Failed to fetch API server.');
    }

    // Generate and store passkey if not exists
    $passkey = get_option('cookiex_cmp_passkey');
    if (!$passkey) {
        $passkey = wp_create_nonce('cookiex-auth');
        update_option('cookiex_cmp_passkey', $passkey);
    }

    $domain = wp_parse_url(get_site_url(), PHP_URL_HOST);

    $request_body = array(
        'platform'        => 'wordpress',
        'verificationUrl' => rest_url('cookiex/v1/authenticate'),
    );

    $request_args = array(
        'headers' => array(
            'X-Domain-Name' => $domain,
            'X-CKX-Passkey' => $passkey,
            'Content-Type'  => 'application/json',
        ),
        'body'    => wp_json_encode($request_body),
    );

    $response = wp_remote_post($api_server . '/auth/domain/connect', $request_args);

    if (is_wp_error($response)) {
        return array('status' => false, 'message' => 'API request failed.', 'error' => $response->get_error_message());
    }

    $response_body = wp_remote_retrieve_body($response);
    $data = json_decode($response_body, true);

    if (!is_array($data)) {
        return array('status' => false, 'message' => 'Invalid API response.');
    }

    if (!isset($data['domainId'], $data['token'], $data['tempToken'])) {
        return array('status' => false, 'message' => 'Missing required data in API response.', 'response' => $data);
    }

    // Store retrieved values
    update_option('cookiex_cmp_domain_id', $data['domainId']);
    update_option('cookiex_cmp_auth_token', $data['token']);
    update_option('cookiex_cmp_temp_token', $data['tempToken']);

    return array('status' => true, 'message' => 'Domain registered successfully.');
}

/**
 * Scan the domain for cookies
 *
 * @return array<string, mixed> Array containing scan status
 */
function cookiex_cmp_quickscan_if_needed(): array {
	$api_server = cookiex_cmp_fetch_api_server();
	if ( ! $api_server ) {
		return array( 'status' => false );
	}

	$domain_id = get_option( 'cookiex_cmp_domain_id' );
	if ( ! $domain_id ) {
		return array( 'status' => false );
	}

	$auth_token = get_option( 'cookiex_cmp_auth_token' );
	if ( ! $auth_token ) {
		return array( 'status' => false );
	}

	$check_response = wp_remote_get(
		$api_server . '/domains/' . $domain_id . '/scans',
		array(
			'headers' => array(
				'Authorization' => 'Bearer ' . $auth_token,
			),
		)
	);

	if ( ! is_wp_error( $check_response ) ) {
		$status_code = wp_remote_retrieve_response_code( $check_response );

		if ( 200 === $status_code ) {
			$body      = wp_remote_retrieve_body( $check_response );
			$scan_data = json_decode( $body, true );

			if ( isset( $scan_data['latestScanResult'] ) ) {
				return array(
					'status'        => true,
					'type'          => 'existing',
					'last_scan'     => $scan_data['latestScanResult']['scannedOn'],
					'pages'         => $scan_data['latestScanResult']['pages'],
					'cookies_count' => $scan_data['latestScanResult']['cookiesCount'],
				);
			}

			return array( 'status' => true );
		}

		if ( 404 !== $status_code ) {
			return array( 'status' => false );
		}
	}

	// If we get here, either there was a 404 or an error, so proceed with quick scan
	$response = wp_remote_post(
		$api_server . '/domains/' . $domain_id . '/quick/scan',
		array(
			'headers' => array(
				'Authorization' => 'Bearer ' . $auth_token,
			),
		)
	);

	if ( is_wp_error( $response ) ) {
		return array( 'status' => false );
	}

	$body = wp_remote_retrieve_body( $response );
	$data = json_decode( $body, true );

	if ( ! is_array( $data ) || ! isset( $data['status'] ) ) {
		return array( 'status' => false );
	}

	// Store theme color if available
	if ( isset( $data['themeColor'] ) ) {
		update_option( 'cookiex_cmp_theme_color', $data['themeColor'] );
	}

	$cookies_count = isset( $data['cookies'] ) ? count( $data['cookies'] ) : 0;

	return array(
		'status'        => true,
		'type'          => 'quick',
		'cookies_count' => $cookies_count,
	);
}

/**
 * Update CookieX Consent Configuration
 *
 * @return array<string, mixed> Response from the API
 */
function cookiex_cmp_update_consent_config(): array {
    $api_server  = cookiex_cmp_fetch_api_server();
    $domain_id   = get_option( 'cookiex_cmp_domain_id' );
    $auth_token  = get_option( 'cookiex_cmp_auth_token' );
    $theme       = get_option( 'cookiex_cmp_theme', '{}' ); // Stored as JSON string

    if ( ! $api_server || ! $domain_id || ! $auth_token ) {
        return array( 'status' => false, 'message' => 'Missing API server, domain ID, or auth token.' );
    }

    $update_url = $api_server . '/consent/config/' . $domain_id;
	$parsed_object = json_decode($theme);

    $request_body = array(
        'consentExpire'             => '365d', // Example: 1-year consent expiry
        'consentLog'                => true,
        'domainUrl'                 => get_option( 'siteurl' ), // Use site URL
        'geoLocations'              => array('US', 'EU'), // Example geolocations
        'language'                  => get_option( 'cookiex_cmp_language', 'en' ),
        'styles'                    => $parsed_object, // Theme stored as JSON string
        'subdomainConsentSharing'   => true,
    );

    $request_args = array(
        'method'    => 'PUT',
        'headers'   => array(
            'Authorization' => 'Bearer ' . $auth_token,
            'Content-Type'  => 'application/json',
            'Accept'        => 'application/json',
        ),
        'body'      => wp_json_encode( $request_body ),
    );

    $response = wp_remote_request( $update_url, $request_args );

    if ( is_wp_error( $response ) ) {
        return array( 'status' => false, 'message' => 'API request failed.', 'error' => $response->get_error_message() );
    }

    $response_body = wp_remote_retrieve_body( $response );
    $data = json_decode( $response_body, true );

    if ( wp_remote_retrieve_response_code( $response ) === 200 ) {
        return array( 'status' => true, 'message' => 'Consent settings updated successfully.', 'response' => $data );
    } else {
        return array( 'status' => false, 'message' => 'Failed to update consent settings.', 'response' => $data );
    }
}

/**
 * Fetch CookieX Analytics Data
 *
 * @param WP_REST_Request $request The request object.
 * @return WP_REST_Response The analytics data or an error response
 */
/**
 * Fetch CookieX Analytics Data
 *
 * @param WP_REST_Request $request The request object.
 * @return WP_REST_Response The analytics data or an error response
 */
/**
 * Fetch CookieX Analytics Data
 *
 * @param WP_REST_Request $request The request object.
 * @return WP_REST_Response The analytics data or an error response
 */
function cookiex_cmp_fetch_analytics( WP_REST_Request $request ): WP_REST_Response {
    $api_server = cookiex_cmp_fetch_api_server();
    $domain_id  = get_option( 'cookiex_cmp_domain_id' );
    $auth_token = get_option( 'cookiex_cmp_auth_token' );

    // ✅ Validate required values
    if ( ! $api_server || ! $domain_id || ! $auth_token ) {
        return new WP_REST_Response(
            array(
                'status'  => 'error',
                'message' => 'Missing API server, domain ID, or authentication token.',
            ),
            400
        );
    }

    // ✅ Get Start & End Date from request, ensure defaults are set
    $start_date = $request->get_param('startDate') ?? date('Y-m-d', strtotime('-30 days')); // Default: 30 days ago
    $end_date   = $request->get_param('endDate') ?? date('Y-m-d'); // Default: today

    // ✅ Construct API URL with query parameters
    $query_params = array(
        'startDate' => $start_date,
        'endDate'   => $end_date,
    );

    $analytics_url = "$api_server/domains/$domain_id/analytics?" . http_build_query($query_params);

    // ✅ Prepare request headers
    $request_args = array(
        'method'  => 'GET',
        'headers' => array(
            'Authorization' => 'Bearer ' . $auth_token,
            'Accept'        => 'application/json',
            'Content-Type'  => 'application/json',
        ),
    );

    // ✅ Make the API request
    $response = wp_remote_get($analytics_url, $request_args);

    // ✅ Handle response errors
    if ( is_wp_error($response) ) {
        return new WP_REST_Response(
            array(
                'status'  => 'error',
                'message' => 'API request failed.',
                'error'   => $response->get_error_message(),
            ),
            500
        );
    }

    $status_code   = wp_remote_retrieve_response_code($response);
    $response_body = wp_remote_retrieve_body($response);
    $data          = json_decode($response_body, true);

    // ✅ Validate JSON response
    if ($status_code === 200 && is_array($data)) {
        return new WP_REST_Response(
            array(
                'status'   => 'success',
                'message'  => 'Analytics data retrieved successfully.',
                'data'     => $data,
            ),
            200
        );
    } else {
        return new WP_REST_Response(
            array(
                'status'  => 'error',
                'message' => 'Failed to retrieve analytics data.',
                'response' => $data,
            ),
            400
        );
    }
}

/**
 * Fetch CookieX Cookie Scan Data
 *
 * @return WP_REST_Response The cookie scan data or an error response
 */
/**
 * Fetch CookieX Cookie Scan Data
 *
 * @return WP_REST_Response The cookie scan data or an error response
 */
function cookiex_cmp_fetch_cookie_data(): WP_REST_Response {
    $api_server = cookiex_cmp_fetch_api_server();
    $domain_id  = get_option( 'cookiex_cmp_domain_id' );
    $auth_token = get_option( 'cookiex_cmp_auth_token' );

    // ✅ Validate required values
    if ( ! $api_server || ! $domain_id || ! $auth_token ) {
        return new WP_REST_Response(
            array(
                'status'  => 'error',
                'message' => 'Missing API server, domain ID, or authentication token.',
            ),
            400
        );
    }

    // ✅ Construct API URL for fetching cookie data
    $cookie_data_url = "$api_server/domains/$domain_id/scans";

    // ✅ Prepare request headers
    $request_args = array(
        'method'  => 'GET',
        'headers' => array(
            'Authorization' => 'Bearer ' . $auth_token,
            'Accept'        => 'application/json',
            'Content-Type'  => 'application/json',
        ),
    );

    // ✅ Make the API request
    $response = wp_remote_get( $cookie_data_url, $request_args );

    // ✅ Handle response errors
    if ( is_wp_error( $response ) ) {
        return new WP_REST_Response(
            array(
                'status'  => 'error',
                'message' => 'API request failed.',
                'error'   => $response->get_error_message(),
            ),
            500
        );
    }

    $response_body = wp_remote_retrieve_body( $response );
    $data = json_decode( $response_body, true );

    // ✅ Check API response
    if ( wp_remote_retrieve_response_code( $response ) === 200) {
        return new WP_REST_Response(
            array(
                'status'   => 'success',
                'message'  => 'Cookie scan data retrieved successfully.',
                'data'     => $data,
            ),
            200
        );
    } else {
        return new WP_REST_Response(
            array(
                'status'  => 'error',
                'message' => 'Failed to retrieve cookie scan data.',
                'response' => $data,
            ),
            400
        );
    }
}

