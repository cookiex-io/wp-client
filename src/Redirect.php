<?php
/**
 * The redirect functionality of the plugin
 *
 * @since      1.0.5
 * @package    Cookiex_CMP
 */

namespace Cookiex_CMP;

/**
 * Handles plugin activation redirect functionality.
 *
 * This class manages the redirection to the plugin settings page
 * after initial plugin activation.
 *
 * @since      1.0.5
 * @package    Cookiex_CMP
 * @author     Manoj Kumar <manoj@cookiex.io>
 */
class Redirect {

	/**
	 * Initialize the redirect functionality
	 *
	 * @since    1.0.5
	 * @access   public
	 */
	public function init(): void {
		add_action( 'admin_init', array( $this, 'activation_redirect' ) );
	}

	/**
	 * Handle activation redirect
	 *
	 * Checks for the redirect flag and redirects to the plugin settings page
	 * if necessary, then removes the flag.
	 *
	 * @since    1.0.5
	 * @access   public
	 */
	public function activation_redirect(): void {
		// Check if we should redirect
		if ( get_option( 'cookiex_cmp_do_activation_redirect', false ) ) {
			// Delete the redirect option
			delete_option( 'cookiex_cmp_do_activation_redirect' );

			// Redirect to the plugin settings page
			wp_safe_redirect( admin_url( 'admin.php?page=cookiex' ) );
			exit;
		}
	}
}
