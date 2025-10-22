<?php
/**
 * Define the internationalization functionality
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @package Cookiex_CMP
 */

namespace Cookiex_CMP;

/**
 * Define the internationalization functionality.
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 */
class I18n {

	/**
	 * Load the plugin text domain for translation.
	 *
	 * @since    1.0.0
	 * @deprecated Since WordPress 4.6, translations are automatically loaded.
	 */
	public function load_plugin_textdomain(): void {
		// No longer needed - WordPress automatically loads translations
		// for plugins hosted on WordPress.org sin
	}
}
