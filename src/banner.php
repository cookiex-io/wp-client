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
	// Get all the options
	$domain_id          = get_option( 'cookiex_cmp_domain_id' );
	$language           = get_option( 'cookiex_cmp_language' );
	$auto_block_cookies = get_option( 'cookiex_cmp_auto_block_cookies' );
	$gtm_enabled        = get_option( 'cookiex_cmp_gtm_enabled' );
	$gtm_id             = get_option( 'cookiex_cmp_gtm_id' );
	$cookie_preferences = get_option( 'cookiex_cmp_cookie_preferences' );
	$domain_name        = isset( $_SERVER['HTTP_HOST'] ) ? sanitize_text_field( wp_unslash( $_SERVER['HTTP_HOST'] ) ) : '';

	if ( $domain_id ) {
		// Register and enqueue the CookieX script
		wp_register_script(
			'cookiex-cmp-banner',
			'https://cdn.cookiex.io/banner/cookiex.min.js',
			array(),
			'1.0.0',
			true
		);
		wp_enqueue_script( 'cookiex-cmp-banner' );
		// Prepare the initialization script
		$init_script = sprintf(
			'document.addEventListener("DOMContentLoaded", function() { 
				const theme = { 
					domainId: %s,
					domainName: %s,
					language: %s,
					autoBlockCookies: %s,
					gtmEnabled: %s,
					gtmId: %s,
					cookiePreferences: %s
				}; 
				const cookiex = new Cookiex(); 
				cookiex.init(theme); 
			});',
			wp_json_encode( $domain_id ),
			wp_json_encode( $domain_name ),
			wp_json_encode( $language ),
			wp_json_encode( $auto_block_cookies ),
			wp_json_encode( $gtm_enabled ),
			wp_json_encode( $gtm_id ),
			wp_json_encode( $cookie_preferences )
		);

		// Add the initialization code as inline script
		wp_add_inline_script( 'cookiex-cmp-banner', $init_script );
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
