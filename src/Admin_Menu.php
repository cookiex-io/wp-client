<?php
/**
 * The file that defines the admin menu
 *
 * This file defines the Admin_Menu class, which handles the creation and rendering
 * of the CookieX plugin's admin menu pages in the WordPress Admin dashboard.
 *
 * @link       http://example.com
 * @since      1.0.0
 *
 * @package    Cookiex_CMP
 */

namespace Cookiex_CMP;

/**
 * Admin_Menu class.
 */
class Admin_Menu {
	/**
	 * Add menu pages to the admin menu.
	 */
	public static function add_menu_pages(): void {
		add_menu_page(
			'Dashboard',
			'CookieX',
			'manage_options',
			'cookiex',
			array( self::class, 'render_dashboard_page' ),
			plugins_url( 'assets/icon-in-menu.png', __DIR__ ),
			2
		);
	}

	/**
	 * Render the dashboard page.
	 */
	public static function render_dashboard_page(): void {
		$nonce = wp_create_nonce( 'cookiex_cmp_nonce' );
		echo '<div id="cookiex-root" data-nonce="' . esc_attr( $nonce ) . '"></div>';
	}
}
