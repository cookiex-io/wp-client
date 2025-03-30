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
 * Registers the domain with the CookieX API server.
 *
 * @return array{status: bool, message: string, domainId?: string, token?: string, tempToken?: string, connected?: bool, error?: string}
 */
function cookiex_cmp_register_domain(): array {
	$api_server = cookiex_cmp_fetch_api_server();
	if ( ! $api_server ) {
		return array(
			'status'  => false,
			'message' => 'Failed to fetch API server URL.',
		);
	}

	$passkey = get_option( 'cookiex_cmp_passkey' ) ? get_option( 'cookiex_cmp_passkey' ) : wp_create_nonce( 'cookiex-auth' );
	update_option( 'cookiex_cmp_passkey', $passkey );

	$parsed_domain = wp_parse_url( get_site_url(), PHP_URL_HOST );
	$domain        = ! empty( $parsed_domain ) ? $parsed_domain : 'unknown-site.com';

	$request_body = array(
		'platform'        => 'wordpress',
		'verificationUrl' => rest_url( 'cookiex/v1/authenticate' ),
	);

	$body_json = wp_json_encode( $request_body );
	if ( false === $body_json ) {
		return array(
			'status'  => false,
			'message' => 'Failed to encode request body.',
		);
	}

	$request_args = array(
		'headers' => array(
			'X-Domain-Name' => $domain,
			'X-CKX-Passkey' => $passkey,
			'Content-Type'  => 'application/json',
		),
		'body'    => $body_json,
	);

	$response = wp_remote_post( $api_server . '/auth/domain/connect', $request_args );

	if ( is_wp_error( $response ) ) {
		return array(
			'status'  => false,
			'message' => 'API request failed.',
			'error'   => $response->get_error_message(),
		);
	}

	$response_body = wp_remote_retrieve_body( $response );
	$data          = json_decode( $response_body, true );

	if ( ! is_array( $data ) || ! isset( $data['domainId'], $data['token'] ) ) {
		return array(
			'status'   => false,
			'message'  => 'Invalid API response received.',
			'response' => $data,
		);
	}

	update_option( 'cookiex_cmp_domain_id', $data['domainId'] );
	update_option( 'cookiex_cmp_auth_token', $data['token'] );

	if ( isset( $data['tempToken'] ) ) {
		update_option( 'cookiex_cmp_temp_token', $data['tempToken'] );
	}

	if ( isset( $data['connected'] ) ) {
		update_option( 'cookiex_cmp_connection_status', $data['connected'] );
	}

	return array(
		'status'    => true,
		'message'   => 'Domain registered successfully.',
		'domainId'  => $data['domainId'],
		'token'     => $data['token'],
		'tempToken' => $data['tempToken'] ?? null,
		'connected' => $data['connected'] ?? false,
	);
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

	// If we get here, either there was a 404 or an error, so proceed with quick scan.
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

	// Store theme color if available.
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
 * Update CookieX Consent Configuration.
 *
 * @return array{status: bool, message: string, response?: array<string, mixed>, error?: string}
 */
function cookiex_cmp_update_consent_config(): array {
	$api_server = cookiex_cmp_fetch_api_server();
	$domain_id  = get_option( 'cookiex_cmp_domain_id' );
	$auth_token = get_option( 'cookiex_cmp_auth_token' );
	$theme      = get_option( 'cookiex_cmp_theme', '{}' ); // Stored as JSON string.

	if ( ! $api_server || ! $domain_id || ! $auth_token ) {
		return array(
			'status'  => false,
			'message' => 'Missing API server, domain ID, or auth token.',
		);
	}

	// Ensure theme JSON decoding does not fail.
	$parsed_object = json_decode( $theme, true );
	if ( ! is_array( $parsed_object ) ) {
		return array(
			'status'  => false,
			'message' => 'Invalid theme JSON data.',
		);
	}

	$update_url = "$api_server/consent/config/$domain_id";

	$request_body = array(
		'consentExpire'           => '365d',
		'consentLog'              => true,
		'domainUrl'               => get_option( 'siteurl' ),
		'geoLocations'            => array( 'US', 'EU' ),
		'language'                => get_option( 'cookiex_cmp_language', 'en' ),
		'styles'                  => $parsed_object,
		'subdomainConsentSharing' => true,
	);

	// Ensure JSON encoding does not return false.
	$body_json = wp_json_encode( $request_body );
	if ( false === $body_json ) {
		return array(
			'status'  => false,
			'message' => 'Failed to encode consent config request body.',
		);
	}

	$request_args = array(
		'method'  => 'PUT',
		'headers' => array(
			'Authorization' => 'Bearer ' . $auth_token,
			'Content-Type'  => 'application/json',
			'Accept'        => 'application/json',
		),
		'body'    => $body_json,
	);

	$response = wp_remote_request( $update_url, $request_args );

	if ( is_wp_error( $response ) ) {
		return array(
			'status'  => false,
			'message' => 'API request failed.',
			'error'   => $response->get_error_message(),
		);
	}

	$response_body = wp_remote_retrieve_body( $response );
	$data          = json_decode( $response_body, true );

	if ( ! is_array( $data ) ) {
		return array(
			'status'  => false,
			'message' => 'Invalid API response received.',
		);
	}

	if ( wp_remote_retrieve_response_code( $response ) === 200 ) {
		return array(
			'status'   => true,
			'message'  => 'Consent settings updated successfully.',
			'response' => $data,
		);
	} else {
		return array(
			'status'   => false,
			'message'  => 'Failed to update consent settings.',
			'response' => $data,
		);
	}
}

/**
 * Fetch analytics data
 *
 * @phpstan-param WP_REST_Request<array<string, mixed>> $request
 * @param WP_REST_Request $request The request object.
 * @return WP_REST_Response Response object.
 */
function cookiex_cmp_fetch_analytics( WP_REST_Request $request ): WP_REST_Response {
	$api_server = cookiex_cmp_fetch_api_server();
	$domain_id  = get_option( 'cookiex_cmp_domain_id' );
	$auth_token = get_option( 'cookiex_cmp_auth_token' );

	if ( ! $api_server || ! $domain_id || ! $auth_token ) {
		return new WP_REST_Response(
			array(
				'status'  => 'error',
				'message' => 'Missing API server, domain ID, or authentication token.',
			),
			400
		);
	}

	$start_date = $request->get_param( 'startDate' ) ?? gmdate( 'Y-m-d', strtotime( '-30 days' ) );
	$end_date   = $request->get_param( 'endDate' ) ?? gmdate( 'Y-m-d' );

	$query_params = array(
		'startDate' => $start_date,
		'endDate'   => $end_date,
	);

	$analytics_url = "$api_server/domains/$domain_id/analytics?" . http_build_query( $query_params );

	$request_args = array(
		'method'  => 'GET',
		'headers' => array(
			'Authorization' => 'Bearer ' . $auth_token,
			'Accept'        => 'application/json',
			'Content-Type'  => 'application/json',
		),
	);

	$response = wp_remote_get( $analytics_url, $request_args );

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

	$status_code   = wp_remote_retrieve_response_code( $response );
	$response_body = wp_remote_retrieve_body( $response );
	$data          = json_decode( $response_body, true );

	if ( 200 === $status_code && is_array( $data ) ) {
		return new WP_REST_Response(
			array(
				'status'  => 'success',
				'message' => 'Analytics data retrieved successfully.',
				'data'    => $data,
			),
			200
		);
	} else {
		return new WP_REST_Response(
			array(
				'status'   => 'error',
				'message'  => 'Failed to retrieve analytics data.',
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

	if ( ! $api_server || ! $domain_id || ! $auth_token ) {
		return new WP_REST_Response(
			array(
				'status'   => 'error',
				'message'  => 'Missing API server, domain ID, or authentication token.',
				'domainId' => 'error',
			),
			400
		);
	}

	$cookie_data_url = "$api_server/domains/$domain_id/scans";

	$request_args = array(
		'method'  => 'GET',
		'headers' => array(
			'Authorization' => 'Bearer ' . $auth_token,
			'Accept'        => 'application/json',
			'Content-Type'  => 'application/json',
		),
	);

	$response = wp_remote_get( $cookie_data_url, $request_args );

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
	$data          = json_decode( $response_body, true );

	if ( wp_remote_retrieve_response_code( $response ) === 200 ) {
		return new WP_REST_Response(
			array(
				'status'  => 'success',
				'message' => 'Cookie scan data retrieved successfully.',
				'data'    => $data,
			),
			200
		);
	} else {
		return new WP_REST_Response(
			array(
				'status'   => 'error',
				'message'  => 'Failed to retrieve cookie scan data.',
				'response' => $data,
			),
			400
		);
	}
}


/**
 * Disconnect the domain from CookieX Web App
 *
 * @return WP_REST_Response The disconnection status.
 */
function cookiex_cmp_disconnect(): WP_REST_Response {
	$api_server = cookiex_cmp_fetch_api_server();
	$domain_id  = get_option( 'cookiex_cmp_domain_id' );
	$auth_token = get_option( 'cookiex_cmp_auth_token' );

	if ( ! $api_server || ! $domain_id || ! $auth_token ) {
		return new WP_REST_Response(
			array(
				'status'     => 'error',
				'message'    => 'Missing API server or domain ID or token',
				'domainId'   => $domain_id,
				'api_server' => $api_server,
				'auth_token' => $auth_token,
			),
			400
		);
	}

	$disconnect_url = "$api_server/auth/user/domains/$domain_id/disconnect";

	$request_args = array(
		'method'  => 'PUT',
		'headers' => array(
			'Authorization' => 'Bearer ' . $auth_token,
			'accept'        => '*/*',
		),
		'body'    => '',
	);

	$response = wp_remote_request( $disconnect_url, $request_args );

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

	$status_code   = wp_remote_retrieve_response_code( $response );
	$response_body = wp_remote_retrieve_body( $response );
	$data          = json_decode( $response_body, true );

	if ( 200 === $status_code ) {
		delete_option( 'cookiex_cmp_connection_status' );

		return new WP_REST_Response(
			array(
				'status'  => 'success',
				'message' => 'Plugin disconnected successfully.',
			),
			200
		);
	} else {
		return new WP_REST_Response(
			array(
				'status'      => 'error',
				'message'     => 'Failed to disconnect the plugin.',
				'response'    => $response_body,
				'status_code' => $status_code,
			),
			400
		);
	}
}

/**
 * Fetch user details from CookieX API.
 *
 * @return array{status: bool, message: string, data?: array<string, mixed>, error?: string}
 *         Returns an associative array with:
 *         - `status` (bool): Indicates success or failure.
 *         - `message` (string): Descriptive message.
 *         - `data` (array<string, mixed>, optional): User details if successful.
 *         - `error` (string, optional): Error message if the request fails.
 */
function cookiex_cmp_fetch_user_data(): array {
	$api_server = cookiex_cmp_fetch_api_server();
	$auth_token = get_option( 'cookiex_cmp_auth_token' );

	if ( ! $api_server || ! $auth_token ) {
		return array(
			'status'  => false,
			'message' => 'Missing API server or authentication token.',
		);
	}

	$user_details_url = "$api_server/auth/user/details";

	$request_args = array(
		'method'  => 'GET',
		'headers' => array(
			'Authorization' => 'Bearer ' . $auth_token,
			'Accept'        => 'application/json',
		),
	);

	$response = wp_remote_get( $user_details_url, $request_args );

	if ( is_wp_error( $response ) ) {
		return array(
			'status'  => false,
			'message' => 'API request failed.',
			'error'   => $response->get_error_message(),
		);
	}

	$status_code   = wp_remote_retrieve_response_code( $response );
	$response_body = wp_remote_retrieve_body( $response );
	$data          = json_decode( $response_body, true );

	if ( 200 !== $status_code || ! is_array( $data ) ) {
		return array(
			'status'   => false,
			'message'  => 'Failed to retrieve user details.',
			'response' => $data,
		);
	}

	return array(
		'status'  => true,
		'message' => 'User details retrieved successfully.',
		'data'    => $data,
	);
}
