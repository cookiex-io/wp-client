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
