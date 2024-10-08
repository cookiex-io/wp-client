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

/**
 * Register the REST API routes for the plugin
 *
 * @return void
 */
function cookiex_register_api_routes(): void {
	register_rest_route(
		'cookiex/v1',
		'/save-settings',
		array(
			array(
				'methods'             => 'POST',
				'callback'            => 'save_settings_details',
				'permission_callback' => 'cookiex_permission_callback',
			),
		)
	);

	register_rest_route(
		'cookiex/v1',
		'/settings',
		array(
			array(
				'methods'             => 'GET',
				'callback'            => 'fetch_settings_details',
				'permission_callback' => 'cookiex_permission_callback',
			),
		)
	);
}

add_action( 'rest_api_init', 'cookiex_register_api_routes' );

/**
 * Check if the user has the necessary permissions to access the API
 *
 * @return bool True if the user is logged in, false otherwise
 */
function cookiex_permission_callback(): bool {
	return is_user_logged_in();
}

/**
 * Save settings details
 *
 * @param WP_REST_Request $request The request object.
 * @return WP_REST_Response|WP_Error Success response when saved, else error
 *
 * @phpstan-param WP_REST_Request<array{domainId?: string, language?: string, autoBlockCookies?: bool, gtmEnabled?: bool, gtmId?: string, cookiePreference?: array<string, mixed>}> $request
 */
function save_settings_details( WP_REST_Request $request ): WP_REST_Response|WP_Error {
	$domain_id          = sanitize_text_field( $request->get_param( 'domainId' ) );
	$language           = sanitize_text_field( $request->get_param( 'language' ) );
	$auto_block_cookies = $request->get_param( 'autoBlockCookies' ) ? true : false;
	$gtm_enabled        = $request->get_param( 'gtmEnabled' ) ? true : false;
	$gtm_id             = sanitize_text_field( $request->get_param( 'gtmId' ) );
	$cookie_preferences = $request->get_param( 'cookiePreference' ); // This will be an array

	if ( ! empty( $domain_id ) && ! empty( $language ) ) {
		update_option( 'cookiex_domain_id', $domain_id );
		update_option( 'cookiex_language', $language );
		update_option( 'cookiex_auto_block_cookies', $auto_block_cookies );
		update_option( 'cookiex_gtm_enabled', $gtm_enabled );

		if ( $gtm_enabled && ! empty( $gtm_id ) ) {
			update_option( 'cookiex_gtm_id', $gtm_id );
		}

		if ( $gtm_enabled ) {
			update_option( 'cookiex_cookie_preferences', $cookie_preferences );
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
function fetch_settings_details(): WP_REST_Response {
	$domain_id          = get_option( 'cookiex_domain_id', '' );
	$language           = get_option( 'cookiex_language', 'en' ); // Default to English
	$auto_block_cookies = get_option( 'cookiex_auto_block_cookies', false );
	$gtm_enabled        = get_option( 'cookiex_gtm_enabled', false );
	$gtm_id             = get_option( 'cookiex_gtm_id', '' );
	$cookie_preferences = get_option( 'cookiex_cookie_preferences', array() );

	return new WP_REST_Response(
		array(
			'domainId'         => $domain_id,
			'language'         => $language,
			'autoBlockCookies' => $auto_block_cookies,
			'gtmEnabled'       => $gtm_enabled,
			'gtmId'            => $gtm_id,
			'cookiePreference' => $cookie_preferences,
		),
		200
	);
}
