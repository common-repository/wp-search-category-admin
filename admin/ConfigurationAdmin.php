<?php

class ConfigurationAdmin {
    public static $optionName = "wpsca_configuration";
    public static $registerTaxSectionName = 'register_taxonomy';
    public static $actionName = 'wpsca_save_options';

    public function __construct() {
        add_action('admin_menu', function() {
            add_menu_page(
                'Search taxonomy admin option',
                'WPSCA Option',
                'manage_categories',
                'wpsca-options',
                [$this, 'optionPage']
            );
        });
    }

    public function optionPage() {
        $args = array(
            'public'   => true,
            'hierarchical' => true
        );
        $allTaxonomies = get_taxonomies($args);
        $save = null;

        if (array_key_exists('_wpnonce', $_POST)) {
            if (!wp_verify_nonce($_POST['_wpnonce'], self::$actionName)) {
                wp_die('Hello dude !');
            }
            $arraySave = array();
            if (is_array($_POST[self::$registerTaxSectionName])) {
                $arraySave[self::$registerTaxSectionName] = $_POST[self::$registerTaxSectionName];
            }
            $save = $this->saveOption($arraySave);
        }

        $option = self::getOption();

        include plugin_dir_path(__FILE__) . '../views/admin/option-page.php';
    }

    public static function getOption() {
        return get_option(self::$optionName, [
            self::$registerTaxSectionName => array('category' => 'on')
        ]);
    }
    public function saveOption($array) {
        return update_option(self::$optionName, $array, false);
    }

}
