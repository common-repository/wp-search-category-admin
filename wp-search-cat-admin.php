<?php

/*
Plugin Name: WP search category admin
Description: Search dynamically a category in the box category in admin
Version: 1.5.1
Author: Clément Décou
Author URI: http://www.clement-decou.fr
*/

require_once __DIR__ . '/admin/ConfigurationAdmin.php';

// init admin
if (is_admin()) {
    new ConfigurationAdmin();
}

function register_wpsca_custom_script($hook)
{
    if ( 'post.php' != $hook && $hook != 'post-new.php' && $hook != 'edit.php' )
    {
        return;
    }

    wp_register_script('wpsca_admin', plugin_dir_url( __FILE__ ).'js/debounce.min.js');
    wp_register_script('wpsca_debounce', plugin_dir_url( __FILE__ ).'js/script.js');
    wp_enqueue_script('wpsca_debounce', false, array(), false, true);
    wp_enqueue_script('wpsca_admin', false, array('wp-blocks'), false, true);
    wp_enqueue_style('wpsca_style', plugin_dir_url( __FILE__ ).'css/style.css');
}
add_action( 'admin_enqueue_scripts', 'register_wpsca_custom_script');

// Add list of taxonomy in input hidden in admin footer
function print_input_list_taxonomies() {
    $screen = get_current_screen();
    if ($screen->parent_base !== 'edit') {
        return;
    }

    $pluginOption = ConfigurationAdmin::getOption();
    $listTax = array_keys($pluginOption[ConfigurationAdmin::$registerTaxSectionName]);
    echo '<input type="hidden" id="wpsca_list_taxonomies" value="' . implode(',', $listTax) . '">';
}
add_action('admin_footer', 'print_input_list_taxonomies');