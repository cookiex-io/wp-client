<?php
/**
 * Register all actions, filters, shortcodes and cli commands for the plugin
 *
 * @package    Cookiex_CMP
 */

namespace Cookiex_CMP;

/**
 * Register all actions and filters for the plugin.
 *
 * Maintain a list of all hooks that are registered throughout
 * the plugin, and register them with the WordPress API. Call the
 * run function to execute the list of actions and filters.
 */
class Loader {

	/**
	 * The array of actions registered with WordPress.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      array<int, array{'hook':string, 'component':object, 'callback':string, 'priority':int, 'accepted_args':int}> $actions The actions registered with WordPress to fire when the plugin loads.
	 */
	protected $actions;

	/**
	 * The array of filters registered with WordPress.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      array<int, array{'hook':string, 'component':object, 'callback':string, 'priority':int, 'accepted_args':int}> $filters The filters registered with WordPress to fire when the plugin loads.
	 */
	protected $filters;

	/**
	 * The array of shortcodes registered with WordPress.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      array<int, array{'hook':string, 'component':object, 'callback':string, 'priority':int, 'accepted_args':int}> $shortcodes The shortcodes registered with WordPress to load when the plugin loads.
	 */
	protected $shortcodes;

	/** @var array<string, array{'instance': object|string, 'args': array<mixed>}> $cli */
	protected array $cli = [];

	/**
	 * Initialize the collections used to maintain the actions and filters.
	 *
	 * @since    1.0.0
	 */
	public function __construct() {
		$this->actions    = array();
		$this->filters    = array();
		$this->shortcodes = array();
	}

	/**
	 * Add a new action to the collection to be registered with WordPress.
	 *
	 * @param string $hook The name of the WordPress action that is being registered.
	 * @param object $component A reference to the instance of the object on which the action is defined.
	 * @param string $callback The name of the function definition on the $component.
	 * @param int    $priority Optional. The priority at which the function should be fired. Default is 10.
	 * @param int    $accepted_args Optional. The number of arguments that should be passed to the $callback. Default is 1.
	 *
	 * @since    1.0.0
	 */
	public function add_action( string $hook, object $component, string $callback, int $priority = 10, int $accepted_args = 1 ): void {
		$this->actions = $this->add( $this->actions, $hook, $component, $callback, $priority, $accepted_args );
	}

	/**
	 * Add a new action to the collection to be registered with WordPress.
	 *
	 * @param string $hook The name of the WordPress action that is being registered.
	 * @param object $component A reference to the instance of the object on which the action is defined.
	 * @param string $callback The name of the function definition on the $component.
	 *
	 * @since    1.0.0
	 */
	public function add_shortcode( string $hook, object $component, string $callback ): void {
		$this->shortcodes = $this->add( $this->shortcodes, $hook, $component, $callback );
	}

	/**
	 * Add a new WP-CLI command to the collection to be registered with WordPress.
	 *
	 * @param string              $name The name of the cli command you want to register.
	 * @param object              $instance A reference to the instance of the object on which the callback is defined.
	 * @param array<string,mixed> $args An associative array with additional registration parameters.
	 *
	 * @return void
	 */
	public function add_cli( string $name, object $instance, array $args = array() ): void {
		$this->cli[ $name ] = array(
			'instance' => $instance,
			'args'     => $args,
		);
	}

	/**
	 * A utility function that is used to register the actions and hooks into a single
	 * collection.
	 *
	 * @param array<int, array{'hook':string, 'component':object, 'callback':string, 'priority':int, 'accepted_args':int}> $hooks The collection of hooks that is being registered (that is, actions or filters).
	 * @param string                                                                                                       $hook The name of the WordPress filter that is being registered.
	 * @param object                                                                                                       $component A reference to the instance of the object on which the filter is defined.
	 * @param string                                                                                                       $callback The name of the function definition on the $component.
	 * @param int                                                                                                          $priority The priority at which the function should be fired.
	 * @param int                                                                                                          $accepted_args The number of arguments that should be passed to the $callback.
	 *
	 * @return   array<int, array{'hook':string, 'component':object, 'callback':string, 'priority':int, 'accepted_args':int}> The collection of actions and filters registered with WordPress.
	 * @since    1.0.0
	 * @access   private
	 */
	private function add( array $hooks, string $hook, object $component, string $callback, int $priority = - 1, int $accepted_args = - 1 ): array {

		$hooks[] = array(
			'hook'          => $hook,
			'component'     => $component,
			'callback'      => $callback,
			'priority'      => $priority,
			'accepted_args' => $accepted_args,
		);

		return $hooks;
	}

	/**
	 * Add a new filter to the collection to be registered with WordPress.
	 *
	 * @param string $hook The name of the WordPress filter that is being registered.
	 * @param object $component A reference to the instance of the object on which the filter is defined.
	 * @param string $callback The name of the function definition on the $component.
	 * @param int    $priority Optional. The priority at which the function should be fired. Default is 10.
	 * @param int    $accepted_args Optional. The number of arguments that should be passed to the $callback. Default is 1.
	 *
	 * @since    1.0.0
	 */
	public function add_filter( string $hook, object $component, string $callback, int $priority = 10, int $accepted_args = 1 ): void {
		$this->filters = $this->add( $this->filters, $hook, $component, $callback, $priority, $accepted_args );
	}

	/**
	 * Register the filters and actions with WordPress.
	 *
	 * @since    1.0.0
	*/
	public function run(): void {
		foreach ($this->filters as $hook) {
			$callback = [$hook['component'], $hook['callback']];
			if (is_callable($callback)) {
				add_filter(
					$hook['hook'],
					$callback,
					$hook['priority'],
					$hook['accepted_args']
				);
			} else {
				error_log("Error: Method {$hook['callback']} not found in " . get_class($hook['component']));
			}
		}
	
		foreach ($this->actions as $hook) {
			$callback = [$hook['component'], $hook['callback']];
			if (is_callable($callback)) {
				add_action(
					$hook['hook'],
					$callback,
					$hook['priority'],
					$hook['accepted_args']
				);
			} else {
				error_log("Error: Method {$hook['callback']} not found in " . get_class($hook['component']));
			}
		}
	
		foreach ($this->shortcodes as $hook) {
			$callback = [$hook['component'], $hook['callback']];
			if (is_callable($callback)) {
				add_shortcode(
					$hook['hook'],
					$callback
				);
			} else {
				error_log("Error: Method {$hook['callback']} not found in " . get_class($hook['component']));
			}
		}
	
		if (!empty($this->cli) && class_exists('WP_CLI')) {
			foreach ($this->cli as $name => $data) {
				if (is_callable([$data['instance'], '__invoke'])) {
					\WP_CLI::add_command($name, $data['instance'], $data['args']);
				} else {
					error_log("Error: WP-CLI command {$name} is not callable.");
				}
			}
		}
	}		
}
