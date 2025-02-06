<?php
/**
 * Fired during plugin uninstallation
 *
 * @package    Cookiex_CMP
 */

namespace Cookiex_CMP;

/**
 * Fired during plugin uninstallation.
 *
 * This class defines all code that should be run during the uninstallation of the plugin
 *
 * @package    Cookiex_CMP
 */
class Uninstaller {

	/**
	 * This is the general callback run during the 'cookiex_cmp_uninstall' register_uninstall_hook.
	 *
	 * @return void
	 */
	public static function uninstall() {
		delete_option( 'cookiex_cmp_domain_id' );
		delete_option( 'cookiex_cmp_auth_token' );
		delete_option( 'cookiex_cmp_passkey' );
		delete_option( 'cookiex_cmp_show_welcome' );
		delete_option( 'cookiex_cmp_do_activation_redirect' );
		delete_option( 'cookiex_cmp_cookie_preferences' );
		delete_option( 'cookiex_cmp_gtm_id' );
		delete_option( 'cookiex_cmp_gtm_enabled' );
		delete_option( 'cookiex_cmp_auto_block_cookies' );
		delete_option( 'cookiex_cmp_language' );
	}
}
