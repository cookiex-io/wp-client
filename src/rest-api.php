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
	exit; // Exit if accessed directly.
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
			'callback'            => 'cookiex_cmp_disconnect_api',
			'permission_callback' => 'cookiex_cmp_permission_callback',
		)
	);
	register_rest_route(
		'cookiex/v1',
		'/save-banner-preview',
		array(
			'methods'             => 'POST',
			'callback'            => 'cookiex_cmp_save_banner_preview',
			'permission_callback' => 'cookiex_cmp_permission_callback',
		)
	);

	register_rest_route(
		'cookiex/v1',
		'/fetch-banner-preview',
		array(
			'methods'             => 'GET',
			'callback'            => 'cookiex_cmp_fetch_banner_preview',
			'permission_callback' => '__return_true',
		)
	);
	register_rest_route(
		'cookiex/v1',
		'/user-details',
		array(
			'methods'             => 'GET',
			'callback'            => 'cookiex_cmp_fetch_user_details',
			'permission_callback' => '__return_true',
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
 * Save settings details.
 *
 * @param WP_REST_Request $request The request object containing:
 *     - domainId (string|null): The domain ID.
 *     - language (string|null): The selected language.
 *     - autoBlockCookies (bool|null): Auto-block cookies setting.
 *     - gtmEnabled (bool|null): Google Tag Manager enabled.
 *     - gtmId (string|null): Google Tag Manager ID.
 *     - cookiePreference (array|null): The user's cookie preferences.
 *     - theme (string|array|null): The selected theme.
 * @return WP_REST_Response Success response when saved.
 */
function cookiex_cmp_save_settings( WP_REST_Request $request ): WP_REST_Response {
	// Ensure all values are properly sanitized and have defaults.
	$domain_id = sanitize_text_field( $request->get_param( 'domainId' ) ?? get_option( 'cookiex_cmp_domain_id', '' ) );
	$language  = sanitize_text_field( $request->get_param( 'language' ) ?? get_option( 'cookiex_cmp_language', 'en' ) );

	$auto_block_cookies = filter_var( $request->get_param( 'autoBlockCookies' ), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE ) ?? false;
	$gtm_enabled        = filter_var( $request->get_param( 'gtmEnabled' ), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE ) ?? false;
	$gtm_id             = sanitize_text_field( $request->get_param( 'gtmId' ) ?? get_option( 'cookiex_cmp_gtm_id', '' ) );
	$cookie_preferences = $request->get_param( 'cookiePreference' ) ?? get_option( 'cookiex_cmp_cookie_preferences', array() );

	// Ensure the theme is properly handled.
	$theme = $request->get_param( 'theme' );
	if ( ! empty( $theme ) ) {
		if ( is_array( $theme ) ) {
			$theme = wp_json_encode( $theme );
		}
		update_option( 'cookiex_cmp_theme', $theme );
	} else {
		$theme = get_option( 'cookiex_cmp_theme', '{}' );
	}

	// Save settings.
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

	require_once plugin_dir_path( __FILE__ ) . 'class-service.php';
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
				'theme'            => $theme,
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

	return new WP_REST_Response(
		array(
			'status'  => 'success',
			'message' => 'Settings retrieved successfully',
			'data'    => array(
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
		),
		200
	);
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

	if ( empty( $request_passkey ) ) {
		return new WP_REST_Response(
			array(
				'status'  => 'error',
				'message' => 'No passkey provided',
			),
			400
		);
	}

	if ( empty( $stored_passkey ) ) {
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
 * @return WP_REST_Response The registration status
 */
function cookiex_cmp_register(): WP_REST_Response {
	require_once plugin_dir_path( __FILE__ ) . 'class-service.php';

	$result = cookiex_cmp_register_domain();

	if ( ! $result['status'] ) {
		return new WP_REST_Response(
			array(
				'status'  => 'error',
				'message' => $result['message'],
				'error'   => $result['error'] ?? 'Unknown error',
				'result'  => $result,
			),
			400
		);
	}

	return new WP_REST_Response(
		array(
			'status'     => true,
			'message'    => $result['message'],
			'domainId'   => get_option( 'cookiex_cmp_domain_id' ),
			'token'      => get_option( 'cookiex_cmp_auth_token' ),
			'temp_token' => get_option( 'cookiex_cmp_temp_token' ),
			'apiServer'  => get_option( 'cookiex_cmp_api_server' ),
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
	require_once plugin_dir_path( __FILE__ ) . 'class-service.php';

	$result = cookiex_cmp_quickscan_if_needed();

	return new WP_REST_Response(
		$result,
		200
	);
}

/**
 * Fetch consent analytics data.
 *
 * @param WP_REST_Request $request The request object containing:
 *     - startDate (string|null): The start date for the analytics query.
 *     - endDate (string|null): The end date for the analytics query.
 * @return WP_REST_Response The analytics data response.
 */
function cookiex_cmp_fetch_consent_analytics( WP_REST_Request $request ): WP_REST_Response {
	require_once plugin_dir_path( __FILE__ ) . 'class-service.php';

	$result = cookiex_cmp_fetch_analytics( $request );

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
	require_once plugin_dir_path( __FILE__ ) . 'class-service.php';

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

	// If token doesn't exist, generate a new one.
	if ( empty( $temp_token ) ) {
		return cookiex_cmp_refresh_temp_token();
	}

	// Decode JWT token and check expiry.
	$token_parts = explode( '.', $temp_token );
	if ( count( $token_parts ) !== 3 ) {
		return cookiex_cmp_refresh_temp_token();
	}

    // phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_decode -- Used for decoding JWT payloads safely.
	$payload = json_decode( base64_decode( str_replace( array( '-', '_' ), array( '+', '/' ), $token_parts[1] ) ), true );

	if ( ! isset( $payload['exp'] ) ) {
		return cookiex_cmp_refresh_temp_token();
	}

	// Get current time and compare with `exp` field.
	$current_time = time();
	if ( $current_time >= $payload['exp'] ) {
		// Token expired → Refresh and return a new one.
		return cookiex_cmp_refresh_temp_token();
	}

	// Token is valid, return it.
	return $temp_token;
}

/**
 * Refresh the temp token.
 *
 * @return string|WP_Error The new temp token or an error response
 */
function cookiex_cmp_refresh_temp_token() {
	require_once plugin_dir_path( __FILE__ ) . 'class-service.php';
	// Call existing `cookiex_cmp_register` to refresh the temp token.
	$register_result = cookiex_cmp_register();

	$response_data = $register_result->get_data();

	if ( ! isset( $response_data['temp_token'] ) ) {
		return new WP_Error( 'token_refresh_failed', 'Failed to refresh temp token', array( 'status' => 500 ) );
	}

	// Update token.
	update_option( 'cookiex_cmp_temp_token', $response_data['temp_token'] );

	return $response_data['temp_token'];
}

/**
 * Get the connection status of the plugin
 *
 * @return WP_REST_Response The connection status
 */
function cookiex_cmp_get_connection_status(): WP_REST_Response {
	require_once plugin_dir_path( __FILE__ ) . 'class-service.php';
	$register_result = cookiex_cmp_register();

	$is_connected = get_option( 'cookiex_cmp_connection_status', false );

	return new WP_REST_Response(
		array(
			'status'    => 'success',
			'message'   => $is_connected ? 'Plugin is connected.' : 'Plugin is not connected.',
			'connected' => (bool) $is_connected,
		),
		200
	);
}

/**
 * Disconnect the CookieX Web App connection.
 *
 * @return WP_REST_Response The disconnection status.
 */
function cookiex_cmp_disconnect_api(): WP_REST_Response {
	require_once plugin_dir_path( __FILE__ ) . 'class-service.php';

	$disconnect_result = cookiex_cmp_disconnect();

	if ( ! isset( $disconnect_result['status'] ) ) {
		return new WP_REST_Response(
			array(
				'status'  => 'error',
				'message' => 'Failed to disconnect. Unexpected response format.',
			),
			400
		);
	}

	return new WP_REST_Response(
		array(
			'status'  => $disconnect_result['status'] ? 'success' : 'error',
			'message' => $disconnect_result['message'] ?? 'Unknown error occurred',
		),
		$disconnect_result['status'] ? 200 : 400
	);
}

/**
 * Save Banner Preview Settings.
 *
 * @param WP_REST_Request $request The request object containing:
 *     - bannerPreview (bool|null): Whether the banner preview is enabled.
 * @return WP_REST_Response Success response when saved, else error.
 */
function cookiex_cmp_save_banner_preview( WP_REST_Request $request ): WP_REST_Response {
	$banner_preview = $request->get_param( 'bannerPreview' );

	if ( ! is_bool( $banner_preview ) ) {
		return new WP_REST_Response(
			array(
				'status'  => 'error',
				'message' => 'Invalid input. Banner preview must be true or false.',
			),
			400
		);
	}

	update_option( 'cookiex_cmp_banner_preview', $banner_preview );

	return new WP_REST_Response(
		array(
			'status'  => 'success',
			'message' => 'Banner preview setting saved successfully.',
		),
		200
	);
}

/**
 * Fetch Banner Preview Settings
 *
 * @return WP_REST_Response The banner preview setting
 */
function cookiex_cmp_fetch_banner_preview(): WP_REST_Response {
	$banner_preview = get_option( 'cookiex_cmp_banner_preview', false );

	return new WP_REST_Response(
		array(
			'status'        => 'success',
			'bannerPreview' => (bool) $banner_preview,
		),
		200
	);
}

/**
 * Fetch user details from CookieX API.
 *
 * @return WP_REST_Response The user details
 */
function cookiex_cmp_fetch_user_details(): WP_REST_Response {
	require_once plugin_dir_path( __FILE__ ) . 'class-service.php';

	$result = cookiex_cmp_fetch_user_data();

	return new WP_REST_Response(
		array(
			'status' => $result['status'] ? 'success' : 'error',
			'data'   => $result['data'] ?? array(),
		),
		$result['status'] ? 200 : 400
	);
}
