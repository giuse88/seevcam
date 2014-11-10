define(function (require) {

  var $ = require("jquery");
  var _ = require("underscore");
  var Backbone = require("backbone");
  var Utils = require("utils");
  var CatalogueView = require("modules/questions/views/CatalogueView");
  var EditCatalogueView = require("modules/questions/views/EditCatalogueView");

  return  Backbone.View.extend({
    el :"#container",
    tagName : "div",
    id :  "#question-dashboard",
    template: _.template(
        '<div clalss="row" style="height:95%;" > ' +
        '    <div class="col-lg-6" style="height:100%;" >' +
        '       <div class="row" style="height:100%;" >' +
        '            <div class="panel" style="height:100%;" >' +
        '               <div class="catalogs-picker" >' +
        '                  <div class="catalog-labels">' +
        '                      <ul>' +
        '                          <li style="margin-left:20px;"class="label-red">seeVcam</li>' +
        '                         <li class="label-blue">Library</li>' +
        '                    </ul>' +
        '                 </div>' +
        '                <div class="catalogs-list">' +
        '                    <ul class="scroll-pane" style="height:100%;" >' +
        '                   </ul>' +
        '              </div>' +
        '         <div id="create-catalogue-block">' +
        '             <div id="create-catalogue" class="create-catalogue">' +
        '                 <input type="text" class="form-control" placeholder="Need a new category? Type its name here."/>' +
        '                  <span class="glyphicon"></span>' +
        '             </div>' +
        '         </div>' +
        '           </div>' +
        '      </div>' +
        ' </div>' +
        '</div>' +
        '       <div class="col-lg-6" style="height:100%;" >' +
        '          <div id="edit-catalogue" style="height: 100%">' +
        '              <div class="no-catalogue dashed-border" style="height: 100%"></div>' +
        '         </div>' +
        '     </div>' +
        '</div>'
    ),

    events: {
      'keypress #create-catalogue input': 'createCatalogue',
      'click .catalogue-list-item .edit-icon':'openCatalogueOnClick',
      'click li.label-blue':'renderPrivateCatalogues',
      'click li.label-red':'renderSeevcamCatalogues'
    },

    initialize: function (options) {
      // injected values
      this.collection = options.collection;
      this.options = options;
      this.openedCatalogue = null;
      this.catalogueViews = [];


      // bindings
      _.bindAll(this, 'render');
      _.bindAll(this, 'afterRender');
      _.bindAll(this, 'renderCatalogue');
      _.bindAll(this, 'validateCatalogueName');
      _.bindAll(this, 'renderEntireCollection');
      _.bindAll(this, 'addCatalogue');
      _.bindAll(this, 'openCatalogue');
      _.bindAll(this, 'openCatalogueOnClick');
      _.bindAll(this, 'removeCatalogue');
      _.bindAll(this, 'renderPrivateCatalogues');
      _.bindAll(this, 'renderSeevcamCatalogues');
      _.bindAll(this, 'resetCatalogueContainer');
      //
      this.listenTo(this.collection, 'add', this.addCatalogue);
      this.listenTo(this.collection, 'remove', this.removeCatalogue);
      this.listenTo(this.collection, 'reset', this.renderEntireCollection);
      this.listenTo(this.collection, 'error', Utils.syncError);
      this.listenTo(this.collection, 'sync', Utils.syncSuccess);
      this.render();
      this.afterRender();
//            _.defer(_.bind(function(){this.$el.find('.scroll-pane').jScrollPane()}, this));
      //
    },

    afterRender: function() {
      if ( this.options.catalogue) {
        console.log("Opening catalogue");
        var catalogue = this.collection.findWhere({id : Number(this.options.catalogue)});
        if (catalogue) {
          this.openCatalogue(catalogue);
        }else{
          console.error("Unknown catalogue");
        }
      }
    },

    renderEntireCollection: function () {
      this.resetCatalogueContainer();
      this.collection.each(function (catalogue) {
        this.renderCatalogue(catalogue);
      }, this);
      return this;
    },

    //TODO : THIS CODE is SHIT, it has to be rewritten entirely.

    renderPrivateCatalogues:function(){
      var $label = this.$el.find('.label-blue');
      if ($label.hasClass("deactive")) {
        $label.removeClass("deactive");
        return this.renderCataloguesByScope("PRIVATE");
      }else {
        $label.addClass("deactive");
        this.resetCatalogueContainer();
        if (!this.$el.find('.label-red').hasClass('deactive'))
          return this.renderCataloguesByScope("SEEVCAM");
        else
          return this;
      }
    },

    renderSeevcamCatalogues:function(){
      var $label = this.$el.find('.label-red');
      if ($label.hasClass("deactive")) {
        $label.removeClass("deactive");
        this.renderCataloguesByScope("SEEVCAM");
      }else {
        $label.addClass("deactive");
        this.resetCatalogueContainer();
        if (!this.$el.find('.label-blue').hasClass('deactive'))
          return this.renderCataloguesByScope("PRIVATE");
        else
          return this;
      }
    },

    resetCatalogueContainer : function(){
      this.$catalogueContainer.html("");
    },

    renderCataloguesByScope:function (scope) {
      this.collection.each(function (catalogue) {
        if(catalogue.get('catalogue_scope') === scope)
          this.renderCatalogue(catalogue);
      }, this);
      return this;
    },

    render: function () {
      this.$el.html(this.template());
      this.$catalogueContainer = this.$el.find('.catalogs-list ul');
      this.$statusIcon = this.$el.find('#create-catalogue .glyphicon');
      this.$createCatalogueBox = this.$el.find('#create-catalogue input');
      this.$createCatalogueBox.bind('input propertychange', this.validateCatalogueName);
      this.renderEntireCollection();
      return this;
    },

    renderCatalogue: function (catalogue) {
      this.catalogueViews[catalogue.id]= new CatalogueView({model: catalogue});
      this.$catalogueContainer.append(this.catalogueViews[catalogue.id].render().el);
      return this;
    },

    openCatalogue: function (catalogue) {
      if (this.openedCatalogue) {
        this.openedCatalogue.close(false);
      }
      this.openedCatalogue = new EditCatalogueView({catalogue: catalogue});
      window.app.router.QuestionsRouter.goToCatalogue(catalogue.get("id"));
      console.log("Catalogue " + catalogue.getName() + " opened.");
    },

    openCatalogueOnClick: function(event) {
      var catalogueIdContainer =  $(event.currentTarget).parents('li');
      var catalogue = this.collection.findWhere({id : Number(catalogueIdContainer.attr('id'))});
      this.openCatalogue(catalogue);
    },

    addCatalogue: function (catalogue) {
      console.log("Catalogue " + catalogue.getName() + " added.");
      this.renderCatalogue(catalogue);
      this.openCatalogue(catalogue);
      this.cleanInputBox();
    },

    removeCatalogue: function(catalogue) {
      this.catalogueViews[catalogue.id] &&  this.catalogueViews[catalogue.id].remove();
      console.log("Catalogue " + catalogue.getName() + " removed.");
    },

    validateCatalogueName: function (e) {
      var $target = $(e.currentTarget);
      var current_value = $target.val();

      if (!current_value) {
        this.$statusIcon.removeClass("glyphicon-ok-circle").removeClass("glyphicon-remove-circle");
        return;
      }

      if (this.collection.findWhere({"catalogue_name": current_value})) {
        this.$statusIcon.removeClass("glyphicon-ok-circle").addClass("glyphicon-remove-circle");
        return;
      }

      this.$statusIcon.removeClass("glyphicon-remove-circle").addClass("glyphicon-ok-circle");
    },

    createCatalogue: function (e) {
      var $target = $(e.currentTarget);
      var current_value = $target.val();
      if (e.which == 13 && $target.val() && !this.collection.findWhere({"catalogue_name": current_value})) {
        var new_catalogue = {"catalogue_name": $target.val(), "scope": "PRIVATE"};
        this.collection.create(new_catalogue, {wait: true});
      }
    },

    cleanInputBox: function () {
      this.$createCatalogueBox.val('');
      this.$statusIcon.removeClass("glyphicon-ok-circle").removeClass("glyphicon-remove-circle");
    },

    showQuestions : function(item) {
      console.log(item);
    }

  });

});

