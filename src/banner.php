<?php
/**
 * CookieX Banner Integration
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
 * Add the CookieX banner to the website
 */
function cookiex_cmp_add_banner(): void {
	$domain_id          = get_option( 'cookiex_cmp_domain_id' );
	$language           = get_option( 'cookiex_cmp_language' ); // Assuming this is stored
	$auto_block_cookies = get_option( 'cookiex_cmp_auto_block_cookies' ); // Assuming this is stored
	$gtm_enabled        = get_option( 'cookiex_cmp_gtm_enabled' ); // Assuming this is stored
	$gtm_id             = get_option( 'cookiex_cmp_gtm_id' ); // Assuming this is stored
	$cookie_preferences = get_option( 'cookiex_cmp_cookie_preferences' ); // Assuming this is stored as an array
	$domain_name        = '';

	if ( isset( $_SERVER['HTTP_HOST'] ) ) {
		$domain_name = sanitize_text_field( wp_unslash( $_SERVER['HTTP_HOST'] ) );
	}

	if ( $domain_id ) {
		// Convert cookie preferences array to a JSON string
		$cookie_preferences_json = wp_json_encode( $cookie_preferences );

		echo '<script id="cookiex" data-ckid="' . esc_attr( $domain_id ) . '" src="https://cdn.cookiex.io/banner/cookiex.min.js" type="text/javascript"></script> 
		<script type="text/javascript"> 
			document.addEventListener( "DOMContentLoaded", function() { 
				const theme = { 
					domainId: "' . esc_js( $domain_id ) . '", 
					domainName: "' . esc_js( $domain_name ) . '",
					language: "' . esc_js( $language ) . '",
					autoBlockCookies: ' . wp_json_encode( $auto_block_cookies ) . ',
					gtmEnabled: ' . wp_json_encode( $gtm_enabled ) . ',
					gtmId: "' . esc_js( $gtm_id ) . '",
					cookiePreferences: ' . esc_js( $cookie_preferences_json ) . '
				}; 
				const cookiex = new Cookiex(); 
				cookiex.init(theme); 
			} ); 
		</script>';
	}
}

/**
 * Register settings for the plugin
 */
function cookiex_cmp_register_settings(): void {
	register_setting(
		'cookiex',
		'cookiex_cmp_domain_id',
		array(
			'sanitize_callback' => 'sanitize_text_field',
			'type'              => 'string',
		)
	);
	register_setting(
		'cookiex',
		'cookiex_cmp_language',
		array(
			'sanitize_callback' => 'sanitize_text_field',
			'type'              => 'string',
		)
	);
	register_setting(
		'cookiex',
		'cookiex_cmp_auto_block_cookies',
		array(
			'sanitize_callback' => 'rest_sanitize_boolean',
			'type'              => 'boolean',
		)
	);
	register_setting(
		'cookiex',
		'cookiex_cmp_gtm_enabled',
		array(
			'sanitize_callback' => 'rest_sanitize_boolean',
			'type'              => 'boolean',
		)
	);
	register_setting(
		'cookiex',
		'cookiex_cmp_gtm_id',
		array(
			'sanitize_callback' => 'sanitize_text_field',
			'type'              => 'string',
		)
	);
	register_setting(
		'cookiex',
		'cookiex_cmp_cookie_preferences',
		array(
			'sanitize_callback' => 'cookiex_cmp_sanitize_cookie_preferences',
			'type'              => 'array',
		)
	);
}

/**
 * Sanitization function for cookie preferences
 *
 * @param mixed $preferences The preferences to sanitize.
 * @return array<string> The sanitized preferences array
 */
function cookiex_cmp_sanitize_cookie_preferences( mixed $preferences ): array {
	if ( ! is_array( $preferences ) ) {
		return array();
	}

	return array_map( 'sanitize_text_field', $preferences );
}

add_action( 'admin_init', 'cookiex_cmp_register_settings' );
