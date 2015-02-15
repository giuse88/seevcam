define(function (require) {

  var $ = require("jquery");
  var _ = require("underscore");
  var Backbone = require("backbone");
  var Utils = require("utils");
  var QuestionsView = require("./questions");
	var CatalogueTemplate = require("text!../templates/catalogue.html")

  return  Backbone.View.extend({

      className: 'catalogue-list-item',
      tagName  : 'li',
      template: _.template(CatalogueTemplate),

      events : {
          'click .catalog-item-name ' : 'showQuestions'
      },

      initialize: function () {

          _.bindAll(this, 'update');
          _.bindAll(this, 'updateSizeCatalogue');
          _.bindAll(this, 'render');
          _.bindAll(this, 'showQuestions');

          this.listenTo(this.model, 'change:catalogue_size', this.updateSizeCatalogue);
          this.listenTo(this.model, 'change:catalogue_name', this.updateCatalogueName);
          this.listenTo(this.model, 'error', Utils.syncError);
          this.listenTo(this.model, 'sync', Utils.syncSuccess);
      },

      updateCatalogueName : function(item){
          console.log("update catalogue name");
          console.log(item);
          this.$el.find(".catalogue-name p").html(this.model.get('catalogue_name'));
      },

      update: function (item) {
          console.log(item);
          console.log("update ");
          this.render();
      },

      updateSizeCatalogue: function (item) {
          console.log("update counter");
          console.log(item);
          this.$el.find(".catalog-count").html("("+this.model.get('catalogue_size') +")");
      },

      id: function () {
          return this.model.get('id')
      },

      render: function () {
          var jsonModel = this.model.toJSON();
          jsonModel.catalogue_class = 'catalog-blue';
          if (jsonModel.catalogue_scope.toLowerCase() === 'seevcam')
              jsonModel.catalogue_class = 'catalog-red';
          this.$el.html(this.template(jsonModel));
          this.$catalogueLink = this.$el.find('.catalog-item-name');
          this.$questionList = this.$el.find('.question-list-container');
          return this;
      },

      showQuestions : function(event){
          event.preventDefault();

          var isAlreadyOpened = this.$el.hasClass('opened');
          var highlightClass = this.model.get('catalogue_scope') === 'SEEVCAM' ?
                                          'highlight-catalogue-red': 'highlight-catalogue-blue';

          $('.highlight-catalogue-red, .highlight-catalogue-blue')
              .removeClass('highlight-catalogue-blue')
              .removeClass('highlight-catalogue-red');

          $('.opened').
               removeClass('opened').
               find(".row .question-list-container").
               collapse('hide');

          if(!isAlreadyOpened){
              this.$catalogueLink.parent('.row').toggleClass(highlightClass);
              this.$el.addClass('opened');
              // cleaning old view
              this.questionView && this.questionView.close();
              this.questionView = new QuestionsView({catalogue:this.model, readOnly : true});
              this.$questionList.html(this.questionView.render().el);
              this.$questionList.collapse('show');
          }

      },

      close : function(){
          console.log("Killing : ", this);
          this.remove();
          this.unbind();
          this.undelegateEvents();
        }
      });

});
