(function( $ ){
    var adminSearch = {
        isQuickEditPage: false,
        listInputTaxononomiesId: 'wpsca_list_taxonomies',
        listInputTaxononomiesNameId: 'wpsca_list_taxonomies_name',
        injectInputEventName: 'wpsca-inject-search-input',

        getNameSearchField: function(){
            return 'wpsca-search-field';
        },
        init : function(){
            $.expr[':'].Contains = function(a, i, m) {
                return $(a).text().toUpperCase()
                  .indexOf(m[3].toUpperCase()) >= 0;
            };

            // Can edit in post edit page or in quick edit
            this.isQuickEditPage = $('.quick-edit-row').length > 0;

            if (document.getElementById(this.listInputTaxononomiesId).length === 0) {
                return;
            }
            if (this.isQuickEditPage === true) {
                this.initQuickEdit();
            } else {
                this.initEditPage();
            }
        },

        getListTaxonomies: function() {
            return document.getElementById(this.listInputTaxononomiesId).value.split(',');
        },

        getSearchBox: function(taxonomyName) {
            var nameSearchField = this.getNameSearchField() + taxonomyName;
            return '<input type="text" name="'+ nameSearchField +'" id="'+ nameSearchField +'" data-taxonomy="' + taxonomyName +'" class="meta-box-search-field" placeholder="Search" />';
        },

        initEditPage: function() {
            var globalObject = this;
            // get list input taxonomies and init initial vars
            var listTaxonomies = this.getListTaxonomies();

            setTimeout(function() {
                listTaxonomies.forEach(function (taxonomy) {
                    var searchBox = globalObject.getSearchBox(taxonomy);
                    var divIdToInject = 'taxonomy-' + taxonomy;
                    var nameSearchField = globalObject.getNameSearchField() + taxonomy;

                    $('#' + divIdToInject).prepend(searchBox);
                    globalObject.initSearch($('#'+ nameSearchField), false);
                });
            }, 800);
        },

        initQuickEdit: function() {
            var globalObject = this;
            var listTaxonomies = this.getListTaxonomies();

            $('.editinline').on('click', function(event) {
                $('.meta-box-search-field').remove();
                setTimeout(function() {
                    listTaxonomies.forEach(function (taxonomy) {
                        var search_box = globalObject.getSearchBox(taxonomy);
                        var nameSearchField = globalObject.getNameSearchField() + taxonomy;
                        $('.' + taxonomy + '-checklist.cat-checklist').first().before(search_box); // first to not have duplicate id
                        globalObject.initSearch($('#'+nameSearchField), true);
                    });
                },50);
            });

        },

        initSearch: function(element, isQuickEdit){
            this.initAutocomplete(element, isQuickEdit);
        },

        initClick: function(element){
            var that = this;
            var nameField = this.getNameSearchField();

            $('body').on('click', '#'+element.attr('id'), function(e){
                e.preventDefault();
                var $el = $(this);
                var s = $el.siblings('#'+nameField).val();
                that.searchTaxonomyElement(s, $el);
            });
        },

        initAutocomplete: function(element, isQuickEdit){
            var that = this;
            element.keyup($.debounce(500, function(){
                var s = $(this).val();
                that.searchTaxonomyElement(s, element, isQuickEdit);
            }));
        },

        searchTaxonomyElement: function(s, elementEvent, isQuickEdit){
            var parentClass = 'categorydiv';
            var taxonomyChecklistClass = 'categorychecklist';
            var itemSelector = 'li';

            if (this.isGutenberg) {
                parentClass = 'components-panel__body';
                taxonomyChecklistClass = 'editor-post-taxonomies__hierarchical-terms-list';
                itemSelector = '.editor-post-taxonomies__hierarchical-terms-choice';
            }
            if (isQuickEdit) {
                parentClass = 'inline-edit-col';
                var taxonomy = $(elementEvent).data('taxonomy')
                taxonomyChecklistClass = taxonomy + '-checklist';
            }

            if ( $.trim(s) == "" ){
                elementEvent.parents('.' + parentClass).first().find('.'+ taxonomyChecklistClass +' ' + itemSelector).show();
            } else {
                var result = elementEvent.parents('.' + parentClass).first().find('.'+taxonomyChecklistClass+' ' + itemSelector + ':Contains("'+s+'")');

                elementEvent.parents('.' + parentClass).first().find('.' + taxonomyChecklistClass + ' ' + itemSelector).hide();
                result.each(function(){
                    $(this).show();
                });
            }
        }
    };
    $(window).load(function(){
        adminSearch.init();
    });


})( jQuery );