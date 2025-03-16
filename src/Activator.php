<?php
/**
 * Fired during plugin activation
 *
 * @package    Cookiex_CMP
 */

namespace Cookiex_CMP;

/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @link https://developer.wordpress.org/plugins/plugin-basics/uninstall-methods/
 * @package    Cookiex_CMP
 */
class Activator {

	/**
	 * This is the general callback run during the 'register_activation_hook' hook.
	 *
	 * @return void
	 */
	public static function activate(): void {
		update_option( 'cookiex_cmp_show_welcome', true );

		add_option( 'cookiex_cmp_do_activation_redirect', true );
	}
}
