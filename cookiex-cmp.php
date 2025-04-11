<?php
/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              https://cookiex.io
 * @since             1.0.0
 * @package           Cookiex_CMP
 *
 * @wordpress-plugin
 * Plugin Name:       CookieX Consent Management Platform
 * Description:       Automatically manages cookie consent
 * Version:           1.1.0
 * Requires PHP:      8.0
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       cookiex-consent-management-platform
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
use Cookiex_CMP\Activator;
use Cookiex_CMP\Deactivator;
use Cookiex_CMP\Cookiex_CMP;
use Cookiex_CMP\Uninstaller;

if ( ! defined( 'WPINC' ) ) {
	die;
}

require_once plugin_dir_path( __FILE__ ) . 'src/rest-api.php';

/**
 * Plugin absolute path
 */
require plugin_dir_path( __FILE__ ) . 'constants.php';

/**
 * Use Composer PSR-4 Autoloading
 */
require plugin_dir_path( __FILE__ ) . 'vendor/autoload.php';
require plugin_dir_path( __FILE__ ) . 'vendor/vendor-prefixed/autoload.php';

/**
 * The code that runs during plugin activation.
 */
function cookiex_cmp_activate(): void {
	Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 */
function cookiex_cmp_deactivate(): void {
	Deactivator::deactivate();
}

/**
 * The code that runs during plugin uninstallation.
 */
function cookiex_cmp_uninstall(): void {
	Uninstaller::uninstall();
}

register_activation_hook( __FILE__, 'cookiex_cmp_activate' );
register_deactivation_hook( __FILE__, 'cookiex_cmp_deactivate' );
register_uninstall_hook( __FILE__, 'cookiex_cmp_uninstall' );

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    0.9.0
 */
function cookiex_cmp_run(): void {
	$plugin = new Cookiex_CMP();
	$plugin->run();
}
cookiex_cmp_run();
