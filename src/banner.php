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

/**
 * Add the CookieX banner to the website
 */
function add_cookiex_banner(): void {
	$domain_id          = get_option( 'cookiex_domain_id' );
	$language           = get_option( 'cookiex_language' ); // Assuming this is stored
	$auto_block_cookies = get_option( 'cookiex_auto_block_cookies' ); // Assuming this is stored
	$gtm_enabled        = get_option( 'cookiex_gtm_enabled' ); // Assuming this is stored
	$gtm_id             = get_option( 'cookiex_gtm_id' ); // Assuming this is stored
	$cookie_preferences = get_option( 'cookiex_cookie_preferences' ); // Assuming this is stored as an array
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
function icc_register_settings(): void {
	register_setting( 'cookiex', 'cookiex_domain_id' );
	register_setting( 'cookiex', 'cookiex_language' );
	register_setting( 'cookiex', 'cookiex_auto_block_cookies' );
	register_setting( 'cookiex', 'cookiex_gtm_enabled' );
	register_setting( 'cookiex', 'cookiex_gtm_id' );
	register_setting( 'cookiex', 'cookiex_cookie_preferences' );
}

add_action( 'admin_init', 'icc_register_settings' );
