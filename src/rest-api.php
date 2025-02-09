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
	$domain_id          = sanitize_text_field( $request->get_param( 'domainId' ) );
	$language           = sanitize_text_field( $request->get_param( 'language' ) );
	$auto_block_cookies = $request->get_param( 'autoBlockCookies' ) ? true : false;
	$gtm_enabled        = $request->get_param( 'gtmEnabled' ) ? true : false;
	$gtm_id             = sanitize_text_field( $request->get_param( 'gtmId' ) );
	$cookie_preferences = $request->get_param( 'cookiePreference' ); // This will be an array

	if ( ! empty( $domain_id ) && ! empty( $language ) ) {
		update_option( 'cookiex_cmp_domain_id', $domain_id );
		update_option( 'cookiex_cmp_language', $language );
		update_option( 'cookiex_cmp_auto_block_cookies', $auto_block_cookies );
		update_option( 'cookiex_cmp_gtm_enabled', $gtm_enabled );

		if ( $gtm_enabled && ! empty( $gtm_id ) ) {
			update_option( 'cookiex_cmp_gtm_id', $gtm_id );
		}

		if ( $gtm_enabled ) {
			update_option( 'cookiex_cmp_cookie_preferences', $cookie_preferences );
		}

		return new WP_REST_Response( 'Settings saved successfully', 200 );
	}

	return new WP_Error( 'invalid_data', 'Invalid settings data', array( 'status' => 400 ) );
}

/**
 * Fetch settings details
 *
 * @return WP_REST_Response The settings details
 */
function cookiex_cmp_fetch_settings(): WP_REST_Response {
	$domain_id           = get_option( 'cookiex_cmp_domain_id', '' );
	$language            = get_option( 'cookiex_cmp_language', 'en' ); // Default to English
	$auto_block_cookies  = get_option( 'cookiex_cmp_auto_block_cookies', false );
	$gtm_enabled         = get_option( 'cookiex_cmp_gtm_enabled', false );
	$gtm_id              = get_option( 'cookiex_cmp_gtm_id', '' );
	$cookie_preferences  = get_option( 'cookiex_cmp_cookie_preferences', array() );
	$server_country      = get_option( 'cookiex_cmp_server_country', '' );
	$languages_available = get_option( 'cookiex_cmp_languages_available', array() );

	return new WP_REST_Response(
		array(
			'domainId'           => $domain_id,
			'language'           => $language,
			'autoBlockCookies'   => $auto_block_cookies,
			'gtmEnabled'         => $gtm_enabled,
			'gtmId'              => $gtm_id,
			'cookiePreference'   => $cookie_preferences,
			'serverCountry'      => $server_country,
			'languagesAvailable' => $languages_available,
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

	if ( $request_passkey !== $stored_passkey ) {
		return new WP_REST_Response(
			array(
				'status' => 'invalid',
			),
			403
		);
	}

	return new WP_REST_Response(
		array(
			'status' => 'verified',
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
	require_once plugin_dir_path( __FILE__ ) . 'Service.php';

	$result = cookiex_cmp_register_domain();

	if ( ! $result ) {
		return new WP_Error(
			'registration_failed',
			'Domain registration failed',
			array(
				'status' => 400,
			)
		);
	}

	return new WP_REST_Response(
		array(
			'status'    => true,
			'domainId'  => get_option( 'cookiex_cmp_domain_id' ),
			'token'     => get_option( 'cookiex_cmp_auth_token' ),
			'apiServer' => get_option( 'cookiex_cmp_api_server' ),
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
