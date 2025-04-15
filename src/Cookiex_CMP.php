<?php
/**
 * The file that defines the core plugin class
 *
 * A class definition that includes attributes and functions used across both the
 * public-facing side of the site and the admin area.
 *
 * @link       http://example.com
 * @since      0.9.0
 *
 * @package    Cookiex_CMP
 */

namespace Cookiex_CMP;

require_once plugin_dir_path( __FILE__ ) . '/banner.php';
require_once plugin_dir_path( __FILE__ ) . '/Redirect.php';

/**
 * The core plugin class.
 *
 * This is used to define internationalization, admin-specific hooks, and
 * public-facing site hooks.
 *
 * Also maintains the unique identifier of this plugin as well as the current
 * version of the plugin.
 *
 * @since      0.9.0
 * @package    Cookiex_CMP
 * @author     Manoj Kumar <manoj@cookiex.io>
 */
class Cookiex_CMP {


	const PLUGIN_NAME    = 'cookiex-consent-management-platform';
	const PLUGIN_VERSION = '1.1.1';

	/**
	 * The loader that's responsible for maintaining and registering all hooks that power
	 * the plugin
	 *
	 * @var Loader
	 */
	protected Loader $loader;

	/**
	 * Define the core functionality of the plugin.
	 *
	 * Set the plugin name and the plugin version that can be used throughout the plugin.
	 * Load the dependencies, define the locale, and set the hooks for the admin area and
	 * the public-facing side of the site.
	 *
	 * @since    0.9.0
	 */
	public function __construct() {

		$this->load_dependencies();
		$this->set_locale();
		$this->define_admin_hooks();
		$this->define_public_hooks();
	}

	/**
	 * Load the required dependencies for this plugin.
	 *
	 * Create an instance of the loader which will be used to register the hooks
	 * with WordPress.
	 *
	 * @since    0.9.0
	 * @access   private
	 */
	private function load_dependencies(): void {

		$this->loader = new Loader();
	}

	/**
	 * Define the locale for this plugin for internationalization.
	 *
	 * Uses the i18n class in order to set the domain and to register the hook
	 * with WordPress.
	 *
	 * @since    0.9.0
	 * @access   private
	 */
	private function set_locale(): void {

		$plugin_i18n = new I18n();

		$this->loader->add_action( 'plugins_loaded', $plugin_i18n, 'load_plugin_textdomain' );
	}

	/**
	 * Register all of the hooks related to the admin area functionality
	 * of the plugin.
	 */
	private function define_admin_hooks(): void {
		add_action( 'admin_menu', array( Admin_Menu::class, 'add_menu_pages' ) );

		// Initialize the redirect functionality
		$redirect = new Redirect();
		$redirect->init();

		add_action(
			'admin_enqueue_scripts',
			function () {
				$this->enqueue_bud_entrypoint(
					'cookiex-cmp-admin',
					array(
						'nonce'  => wp_create_nonce( 'wp_rest' ),
						'apiUrl' => rest_url( 'cookiex/v1/' ),
					)
				);
			},
			100
		);
	}

	/**
	 * Register all of the hooks related to the public-facing functionality
	 * of the plugin.
	 *
	 * @since     0.9.0
	 * @access    private
	 */
	private function define_public_hooks(): void {
		add_action( 'wp_head', 'cookiex_cmp_add_banner' );
	}

	/**
	 * Run the loader to execute all of the hooks with WordPress.
	 */
	public function run(): void {
		$this->loader->run();
	}

	/**
	 * The reference to the class that orchestrates the hooks with the plugin.
	 *
	 * @return Loader Orchestrates the hooks of the plugin.
	 */
	public function get_loader(): Loader {
		return $this->loader;
	}

	/**
	 * Enqueue a bud entrypoint
	 *
	 * @param string              $entry Name if the entrypoint defined in bud.js .
	 * @param array<string,mixed> $localize_data Array of associated data. See https://developer.wordpress.org/reference/functions/wp_localize_script/ .
	 */
	private function enqueue_bud_entrypoint( string $entry, array $localize_data = array() ): void {
		$entrypoints_manifest = COOKIEX_CMP_PLUGIN_PATH . '/dist/entrypoints.json';

		// Try to get WordPress filesystem. If not possible load it.
		global $wp_filesystem;
		if ( ! is_a( $wp_filesystem, 'WP_Filesystem_Base' ) ) {
			require_once ABSPATH . '/wp-admin/includes/file.php';
			WP_Filesystem();
		}

		$filesystem = new \WP_Filesystem_Direct( false );
		if ( ! $filesystem->exists( $entrypoints_manifest ) ) {
			return;
		}

		// Read the file contents.
		$file_contents = $filesystem->get_contents( $entrypoints_manifest );
		if ( false === $file_contents ) {
			return;
		}

		// Parse JSON.
		$entrypoints = json_decode( $file_contents, true );
		if ( json_last_error() !== JSON_ERROR_NONE ) {
			return;
		}

		// Iterate entrypoint groups.
		foreach ( $entrypoints as $key => $bundle ) {
			// Only process the entrypoint that should be enqueued per call.
			if ( $key !== $entry ) {
				continue;
			}

			// Iterate js and css files
			foreach ( $bundle as $type => $files ) {
				foreach ( $files as $file ) {
					if ( 'js' === $type ) {
						wp_enqueue_script(
							self::PLUGIN_NAME . "/$file",
							COOKIEX_CMP_PLUGIN_URL . 'dist/' . $file,
							$bundle['dependencies'] ?? array(),
							self::PLUGIN_VERSION,
							true,
						);

						// Maybe localize js
						if ( ! empty( $localize_data ) ) {
							wp_localize_script( self::PLUGIN_NAME . "/$file", str_replace( '-', '_', self::PLUGIN_NAME ), $localize_data );

							// Unset after localize since we only need to localize one script per bundle so on next iteration will be skipped
							unset( $localize_data );
						}
					}

					if ( 'css' === $type ) {
						wp_enqueue_style(
							self::PLUGIN_NAME . "/$file",
							COOKIEX_CMP_PLUGIN_URL . 'dist/' . $file,
							array(),
							self::PLUGIN_VERSION,
						);
					}
				}
			}
		}
	}
}
