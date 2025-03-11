<?php
/**
 * CookieX REST API
 *
 * This file contains functions for integrating the CookieX banner
 * into a WordPress website. It includes functionality for adding
 * the banner script, initializing it with the correct settings,
 * and registering the necessary WordPress settings.
 *
 * @package CookieX
 * @version 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Register the REST API routes for the plugin
 *
 * @return void
 */
function cookiex_cmp_register_api_routes(): void {
	register_rest_route(
		'cookiex/v1',
		'/save-settings',
		array(
			array(
				'methods'             => 'POST',
				'callback'            => 'cookiex_cmp_save_settings',
				'permission_callback' => 'cookiex_cmp_permission_callback',
			),
		)
	);

	register_rest_route(
		'cookiex/v1',
		'/settings',
		array(
			array(
				'methods'             => 'GET',
				'callback'            => 'cookiex_cmp_fetch_settings',
				'permission_callback' => 'cookiex_cmp_permission_callback',
			),
		)
	);

	register_rest_route(
		'cookiex/v1',
		'/welcome-status',
		array(
			'methods'             => 'GET',
			'callback'            => 'cookiex_cmp_get_welcome_status',
			'permission_callback' => 'cookiex_cmp_permission_callback',
		)
	);

	register_rest_route(
		'cookiex/v1',
		'/clear-welcome',
		array(
			'methods'             => 'GET',
			'callback'            => 'cookiex_cmp_clear_welcome_status',
			'permission_callback' => 'cookiex_cmp_permission_callback',
		)
	);

	register_rest_route(
		'cookiex/v1',
		'/authenticate',
		array(
			'methods'             => 'GET',
			'callback'            => 'cookiex_cmp_authenticate',
			'permission_callback' => '__return_true',
		)
	);

	register_rest_route(
		'cookiex/v1',
		'/register',
		array(
			'methods'             => 'POST',
			'callback'            => 'cookiex_cmp_register',
			'permission_callback' => 'cookiex_cmp_permission_callback',
		)
	);

	register_rest_route(
		'cookiex/v1',
		'/quickscan',
		array(
			'methods'             => 'POST',
			'callback'            => 'cookiex_cmp_quickscan',
			'permission_callback' => 'cookiex_cmp_permission_callback',
		)
	);

	register_rest_route(
		'cookiex/v1',
		'/enable-consent-management',
		array(
			'methods'             => 'POST',
			'callback'            => 'cookiex_cmp_enable_consent_management',
			'permission_callback' => 'cookiex_cmp_permission_callback',
		)
	);
	register_rest_route(
		'cookiex/v1',
		'/analytics',
		array(
			'methods'             => 'GET',
			'callback'            => 'cookiex_cmp_fetch_consent_analytics',
			'permission_callback' => 'cookiex_cmp_permission_callback',
		)
	);
	register_rest_route(
		'cookiex/v1',
		'/cookie-scan',
		array(
			'methods'             => 'GET',
			'callback'            => 'cookiex_cmp_fetch_cookie_result',
			'permission_callback' => 'cookiex_cmp_permission_callback',
		)
	);	
	//for now using regiter Api for Refresh the temp Token this should be new Api on BE for refresh the temp token
	register_rest_route(
		'cookiex/v1',
		'/validate-temp-token',
		array(
			'methods'             => 'GET',
			'callback'            => 'cookiex_cmp_validate_temp_token',
			'permission_callback' => 'cookiex_cmp_permission_callback',
		)
	);
    register_rest_route(
        'cookiex/v1',
        '/confirm-connection',
        array(
            'methods'             => 'POST',
            'callback'            => 'cookiex_cmp_confirm_connection',
            'permission_callback' => 'cookiex_cmp_permission_callback',
        )
    );
    register_rest_route(
        'cookiex/v1',
        '/connection-status',
        array(
            'methods'             => 'GET',
            'callback'            => 'cookiex_cmp_get_connection_status',
            'permission_callback' => 'cookiex_cmp_permission_callback',
        )
    );
    register_rest_route(
        'cookiex/v1',
        '/disconnect',
        array(
            'methods'             => 'POST',
            'callback'            => 'cookiex_cmp_disconnect',
            'permission_callback' => 'cookiex_cmp_permission_callback',
        )
    );
    
}

add_action( 'rest_api_init', 'cookiex_cmp_register_api_routes' );

/**
 * Check if the user has the necessary permissions to access the API
 *
 * @return bool True if the user has admin capabilities, false otherwise
 */
function cookiex_cmp_permission_callback(): bool {
	return current_user_can( 'manage_options' );
}

/**
 * Save settings details
 *
 * @param WP_REST_Request $request The request object.
 * @return WP_REST_Response|WP_Error Success response when saved, else error
 *
 * @phpstan-param WP_REST_Request<array{domainId?: string, language?: string, autoBlockCookies?: bool, gtmEnabled?: bool, gtmId?: string, cookiePreference?: array<string, mixed>}> $request
 */
function cookiex_cmp_save_settings( WP_REST_Request $request ): WP_REST_Response|WP_Error {
    // ✅ Use existing values if request parameters are empty
    $domain_id = ! empty( $request->get_param( 'domainId' ) ) 
        ? sanitize_text_field( $request->get_param( 'domainId' ) ) 
        : get_option( 'cookiex_cmp_domain_id', '' );

    $language = ! empty( $request->get_param( 'language' ) ) 
        ? sanitize_text_field( $request->get_param( 'language' ) ) 
        : get_option( 'cookiex_cmp_language', 'en' );

    $auto_block_cookies = filter_var( $request->get_param( 'autoBlockCookies' ), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE );
    $gtm_enabled        = filter_var( $request->get_param( 'gtmEnabled' ), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE );
    $gtm_id             = sanitize_text_field( $request->get_param( 'gtmId' ) );
    $cookie_preferences = $request->get_param( 'cookiePreference' ); // Array
    $theme              = $request->get_param( 'theme' );

    if ( ! empty( $theme ) ) {
        if ( is_array( $theme ) ) {
            $theme = wp_json_encode( $theme ); // Convert array to JSON
        }
        update_option( 'cookiex_cmp_theme', $theme ); // Store as JSON string
    } elseif ( empty( $theme ) ) {
        $theme = get_option( 'cookiex_cmp_theme', '{}' ); // Use stored value if missing
    }

    // ✅ Save settings
    update_option( 'cookiex_cmp_domain_id', $domain_id );
    update_option( 'cookiex_cmp_language', $language );
    update_option( 'cookiex_cmp_auto_block_cookies', $auto_block_cookies );
    update_option( 'cookiex_cmp_gtm_enabled', $gtm_enabled );
    update_option( 'cookiex_cmp_theme', $theme );
	update_option( 'cookiex_cmp_show_welcome', false );

    if ( $gtm_enabled && ! empty( $gtm_id ) ) {
        update_option( 'cookiex_cmp_gtm_id', $gtm_id );
    }

    if ( $gtm_enabled && ! empty( $cookie_preferences ) ) {
        update_option( 'cookiex_cmp_cookie_preferences', $cookie_preferences );
    }

	require_once plugin_dir_path( __FILE__ ) . 'Service.php';

	cookiex_cmp_update_consent_config();

    return new WP_REST_Response(
        array(
            'status'  => 'success',
            'message' => 'Settings saved successfully',
            'data'    => array(
                'domainId'         => $domain_id,
                'language'         => $language,
                'autoBlockCookies' => $auto_block_cookies,
                'gtmEnabled'       => $gtm_enabled,
                'gtmId'            => $gtm_id,
                'theme'            => get_option( 'cookiex_cmp_theme', '{}' ),
            ),
        ),
        200
    );
}

/**
 * Fetch settings details
 *
 * @return WP_REST_Response The settings details
 */
function cookiex_cmp_fetch_settings(): WP_REST_Response {
    // ✅ Fetch stored values (fallback to default if missing)
    $domain_id           = get_option( 'cookiex_cmp_domain_id', '' );
    $language            = get_option( 'cookiex_cmp_language', 'en' );
    $auto_block_cookies  = filter_var( get_option( 'cookiex_cmp_auto_block_cookies', false ), FILTER_VALIDATE_BOOLEAN );
    $gtm_enabled         = filter_var( get_option( 'cookiex_cmp_gtm_enabled', false ), FILTER_VALIDATE_BOOLEAN );
    $gtm_id              = get_option( 'cookiex_cmp_gtm_id', '' );
    $cookie_preferences  = get_option( 'cookiex_cmp_cookie_preferences', array() );
    $server_country      = get_option( 'cookiex_cmp_server_country', '' );
    $languages_available = get_option( 'cookiex_cmp_languages_available', array() );

	$theme = get_option( 'cookiex_cmp_theme', '{}' );

    if ( is_array( $theme ) ) {
        $theme = wp_json_encode( $theme );
    }

    return new WP_REST_Response( array(
        'status'             => 'success',
        'message'            => 'Settings retrieved successfully',
        'data'               => array(
            'domainId'           => $domain_id,
            'language'           => $language,
            'autoBlockCookies'   => $auto_block_cookies,
            'gtmEnabled'         => $gtm_enabled,
            'gtmId'              => $gtm_id,
            'cookiePreference'   => $cookie_preferences,
            'serverCountry'      => $server_country,
            'languagesAvailable' => $languages_available,
            'theme'              => $theme,
        ),
    ), 200 );
}

/**
 * Get the welcome message display status
 *
 * @return WP_REST_Response The welcome status
 */
function cookiex_cmp_get_welcome_status(): WP_REST_Response {
	return new WP_REST_Response(
		array(
			'show_welcome' => get_option( 'cookiex_cmp_show_welcome', false ),
		),
		200
	);
}

/**
 * Clear the welcome message display status
 *
 * @return WP_REST_Response Success response
 */
function cookiex_cmp_clear_welcome_status(): WP_REST_Response {
	delete_option( 'cookiex_cmp_show_welcome' );
	return new WP_REST_Response(
		array(
			'success' => true,
		),
		200
	);
}

/**
 * Authenticate domain using passkey
 *
 * @return WP_REST_Response The authentication status
 */
function cookiex_cmp_authenticate(): WP_REST_Response {

    $request_passkey = sanitize_text_field( wp_unslash( $_SERVER['HTTP_X_CKX_PASSKEY'] ?? '' ) );
    $stored_passkey  = get_option( 'cookiex_cmp_passkey' );

    if ( empty($request_passkey) ) {
        return new WP_REST_Response(
            array(
                'status'  => 'error',
                'message' => 'No passkey provided',
            ),
            400
        );
    }

    if ( empty($stored_passkey) ) {
        return new WP_REST_Response(
            array(
                'status'  => 'error',
                'message' => 'No stored passkey found',
            ),
            500
        );
    }

    if ( $request_passkey !== $stored_passkey ) {
        return new WP_REST_Response(
            array(
                'status'  => 'invalid',
                'message' => 'Invalid passkey',
            ),
            403
        );
    }

    return new WP_REST_Response(
        array(
            'status'  => 'verified',
            'message' => 'Passkey verified successfully',
        ),
        200
    );
}

/**
 * Handle registration request
 *
 * @return WP_REST_Response|WP_Error The registration status
 */
function cookiex_cmp_register(): WP_REST_Response|WP_Error {
    require_once plugin_dir_path(__FILE__) . 'Service.php';

    $result = cookiex_cmp_register_domain();

    if (!$result['status']) {
        return new WP_Error(
            'registration_failed',
            $result['message'],
            array(
                'status'  => 400,
                'error'   => isset($result['error']) ? $result['error'] : null,
                'details' => isset($result['response']) ? $result['response'] : null,
            )
        );
    }

    return new WP_REST_Response(
        array(
            'status'    => true,
            'message'   => $result['message'],
            'domainId'  => get_option('cookiex_cmp_domain_id'),
            'token'     => get_option('cookiex_cmp_auth_token'),
            'temp_token' => get_option('cookiex_cmp_temp_token'),
            'apiServer' => get_option('cookiex_cmp_api_server'),
        ),
        200
    );
}


/**
 * Handle quickscan request
 *
 * @return WP_REST_Response The quickscan status
 */
function cookiex_cmp_quickscan(): WP_REST_Response {
	require_once plugin_dir_path( __FILE__ ) . 'Service.php';

	$result = cookiex_cmp_quickscan_if_needed();

	return new WP_REST_Response(
		$result,
		200
	);
}

/**
 * Handle analytics request
 *
 * @return WP_REST_Response The analytics data
 */
/**
 * Handle analytics request
 *
 * @param WP_REST_Request $request The request object.
 * @return WP_REST_Response The analytics data
 */
function cookiex_cmp_fetch_consent_analytics( WP_REST_Request $request ): WP_REST_Response {
	require_once plugin_dir_path( __FILE__ ) . 'Service.php';

	$result = cookiex_cmp_fetch_analytics($request);

	return new WP_REST_Response(
		$result,
		200
	);
}

/**
 * Handle cookies request
 *
 * @return WP_REST_Response The cookies data
 */
function cookiex_cmp_fetch_cookie_result(): WP_REST_Response {
	require_once plugin_dir_path( __FILE__ ) . 'Service.php';

	$result = cookiex_cmp_fetch_cookie_data();

	return new WP_REST_Response(
		$result,
		200
	);
}

/**
 * Enable consent management
 *
 * @return WP_REST_Response The consent management status
 */
function cookiex_cmp_enable_consent_management(): WP_REST_Response {
	update_option( 'cookiex_cmp_auto_block_cookies', true );

	return new WP_REST_Response(
		array(
			'status' => true,
		),
		200
	);
}

/**
 * Validate and refresh the temp token if needed.
 *
 * @return string|WP_Error The valid temp token or an error response
 */
function cookiex_cmp_validate_temp_token() {
    $temp_token = get_option( 'cookiex_cmp_temp_token' );
    $token_last_updated = get_option( 'cookiex_cmp_temp_token_last_updated', 0 );

    // If token doesn't exist, refresh it
    if ( empty( $temp_token ) || empty( $token_last_updated ) ) {
        return cookiex_cmp_refresh_temp_token();
    }

    // Calculate token age
    $token_age = time() - $token_last_updated;
    $token_expiry_time = 900; // 15 minutes (900 seconds)

    // If token is expired, refresh it
    if ( $token_age >= $token_expiry_time ) {
        return cookiex_cmp_refresh_temp_token();
    }

    // Return valid token
    return $temp_token;
}

/**
 * Refresh the temp token.
 *
 * @return string|WP_Error The new temp token or an error response
 */
function cookiex_cmp_refresh_temp_token() {
    // Call existing `cookiex_cmp_register` to refresh the temp token
    $register_result = cookiex_cmp_register();

    if ( is_wp_error( $register_result ) ) {
        return $register_result;
    }

    $response_data = $register_result->get_data();

    if ( ! isset( $response_data['temp_token'] ) ) {
        return new WP_Error( 'token_refresh_failed', 'Failed to refresh temp token', array( 'status' => 500 ) );
    }

    // Update token and timestamp
    update_option( 'cookiex_cmp_temp_token', $response_data['temp_token'] );
    update_option( 'cookiex_cmp_temp_token_last_updated', time() );

    return $response_data['temp_token'];
}

/**
 * Handle connection success from admin site
 *
 * @param WP_REST_Request $request The request object.
 * @return WP_REST_Response
 */
function cookiex_cmp_confirm_connection( WP_REST_Request $request ): WP_REST_Response {
    
    update_option( 'cookiex_cmp_connection_status', true );

    return new WP_REST_Response(
        array(
            'status'  => 'success',
            'message' => 'Plugin successfully connected.',
        ),
        200
    );
}

/**
 * Get the connection status of the plugin
 *
 * @return WP_REST_Response The connection status
 */
function cookiex_cmp_get_connection_status(): WP_REST_Response {
    $is_connected = get_option( 'cookiex_cmp_connection_status', false );

    return new WP_REST_Response(
        array(
            'status'  => 'success',
            'message' => $is_connected ? 'Plugin is connected.' : 'Plugin is not connected.',
            'connected' => (bool) $is_connected,
        ),
        200
    );
}

/**
 * Disconnect the CookieX Web App connection
 *
 * @param WP_REST_Request $request The request object.
 * @return WP_REST_Response The disconnection status
 */
function cookiex_cmp_disconnect( WP_REST_Request $request ): WP_REST_Response {
    delete_option( 'cookiex_cmp_connection_status' );

    return new WP_REST_Response(
        array(
            'status'  => 'success',
            'message' => 'Plugin successfully disconnected.',
        ),
        200
    );
}
