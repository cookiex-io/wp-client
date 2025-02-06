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
	// Check if service url already exists
	$api_server = get_option( 'cookiex_cmp_api_server' );
	if ( $api_server ) {
		return $api_server;
	}

	$response = wp_remote_get( COOKIEX_CMP_CDN_URL . '/region.json' );

	if ( is_wp_error( $response ) ) {
		return false;
	}

	$body = wp_remote_retrieve_body( $response );
	$data = json_decode( $body, true );

	if ( ! is_array( $data ) || ! isset( $data['api_server'] ) ) {
		return false;
	}

	update_option( 'cookiex_cmp_api_server', $data['api_server'] );
	return $data['api_server'];
}

/**
 * Register the domain with CookieX API server
 *
 * @return bool True if registration successful, false otherwise
 */
function cookiex_cmp_register_domain(): bool {
	// Check if domain is already registered
	$domain_id  = get_option( 'cookiex_cmp_domain_id' );
	$auth_token = get_option( 'cookiex_cmp_auth_token' );
	if ( $domain_id && $auth_token ) {
		return true;
	}

	$api_server = cookiex_cmp_fetch_api_server();
	if ( ! $api_server ) {
		return false;
	}

	// Generate and store passkey if not exists
	$passkey = get_option( 'cookiex_cmp_passkey' );
	if ( ! $passkey ) {
		$passkey = wp_create_nonce( 'cookiex-auth' );
		update_option( 'cookiex_cmp_passkey', $passkey );
	}

	$domain = wp_parse_url( get_site_url(), PHP_URL_HOST );

	$response = wp_remote_post(
		$api_server . '/auth/domain/register',
		array(
			'headers' => array(
				'X-Domain-Name' => $domain,
				'X-CKX-Passkey' => $passkey,
				'Content-Type'  => 'application/json',
			),
			'body'    => wp_json_encode(
				array(
					'platform'        => 'wordpress',
					'verificationUrl' => rest_url( 'cookiex/v1/authenticate' ),
				)
			),
		)
	);

	if ( is_wp_error( $response ) ) {
		return false;
	}

	$body = wp_remote_retrieve_body( $response );
	$data = json_decode( $body, true );

	if ( ! is_array( $data ) || ! isset( $data['domainId'] ) || ! isset( $data['token'] ) ) {
		return false;
	}

	update_option( 'cookiex_cmp_domain_id', $data['domainId'] );
	update_option( 'cookiex_cmp_auth_token', $data['token'] );

	return true;
}
