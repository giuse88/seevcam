(function() {
    'use strict'

    var Catalogue = Backbone.Model.extend({
       defaults: {
           name: 'unknown',
           id: 'unknown',
           scope: 'PRIVATE',
           size : 0
       }
    });

    var CatalogueList = Backbone.Collection.extend({
       model: Catalogue
    });

    var CatalogueView = Backbone.View.extend({
        tagName:   'li',
        className: 'catalogue',
        template: _.template( $('#catalogueTemplate').html()),

        id :  function() {
            return this.model.get('id')
        },

        render: function() {
            this.$el.html( this.template( this.model.toJSON() ) );
            return this;
        }

    });

})();