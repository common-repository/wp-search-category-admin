<?php
/**
 * @var $option
 * @var $allTaxonomies
 */
?>
<?php if (isset($save) && $save): ?>
    <div class="notice notice-success is-dismissible">
        <p>Option saved.</p>
    </div>
<?php endif; ?>
<div class="wrap">
    <h1><?= get_admin_page_title() ?></h1>
    <form method="post" action="">
        <h2><?= __('Activate search for taxonomies', 'wpsca') ?></h2>
        <?php wp_nonce_field(ConfigurationAdmin::$actionName); ?>
        <table class="form-table">
            <tbody>
                <?php foreach($allTaxonomies as $aTax): ?>
                <tr>
                    <td><label for="register_<?= $aTax ?>"><?= $aTax ?></label></td>
                    <td><input id="register_<?= $aTax ?>" <?php if (array_key_exists($aTax, $option['register_taxonomy'])){ echo 'checked'; } ?> type="checkbox" name="<?= ConfigurationAdmin::$registerTaxSectionName ?>[<?= $aTax?>]"></td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
        <?php submit_button(); ?>
    </form>
</div>

