define(function (require) {

  var $ = require("jquery");
  require("jquery-ui");
  var _ = require("underscore");
  var Backbone = require("backbone");
  var Utils = require("utils");
  var QuestionView = require("modules/questions/views/QuestionView");

  return Backbone.View.extend({

      template: _.template(
              '    <div class="create-interview-catalog-section" style="height:100%;">' +
              '        <div class="row" style="height:100%;margin-right:0;">' +
              '           <div class="panel" style="height:100%;position: relative;">' +
              '                <div class="panel-heading clearfix">' +
              '                    <span class="inline-block" style="width:80%">' +
              '                        <input class="input-panel-heading" style="width:100%" type="text" value="<%- catalogue_name %>">' +
              '                    </span>' +
              '                   <span class="margin-b2-t2 inline-block pull-right">' +
              '                       <span class="glyphicon input-status-icon"></span>' +
              '                       <span class="delete-panel-heading icon glyphicon glyphicon-trash"></span>' +
              '                       <span class="close-panel-heading icon glyphicon glyphicon-remove"></span>' +
              '                    </span>' +
              '                </div>' +
              '                <div id="question-container" class="">' +
              '                    <ul class="scroll-pane"></ul>' +
              '                </div>' +
              '                <div id="enter-new-question" class="">' +
              '                    <input id="question-text" class="form-control" type="text" placeholder="Enter a new question"/>' +
              '                </div>' +
              '            </div>' +
              '        </div>' +
              '    </div>'
      ),
      el: "#edit-catalogue",

      events: {
          'keypress #question-text': 'newQuestionFromKeyboard',
          "blur .input-panel-heading": "updateCatalogueOnFocusOut",
          "keypress .input-panel-heading": "updateOnEnter",
          "click .close-panel-heading": "close",
          "click .delete-panel-heading": "deleteCatalogue"
      },


      initialize: function (options) {
          //
          this.catalogue = options && options.catalogue;
          this.collection = this.catalogue.getOrCreateQuestions();
          this.questions = [];
          // bindings
          _.bindAll(this, 'render');
          _.bindAll(this, 'newQuestionFromKeyboard');
          _.bindAll(this, 'removeQuestion');
          _.bindAll(this, 'renderQuestion');
          _.bindAll(this, 'restoreCatalogueName');
          _.bindAll(this, 'validateCatalogueName');
          _.bindAll(this, 'updateOnEnter');
          _.bindAll(this, 'updateCatalogueName');
          _.bindAll(this, 'updateCatalogueOnFocusOut');
          _.bindAll(this, 'renderEntireCollection');
          _.bindAll(this, 'close');
          _.bindAll(this, 'deleteCatalogue');
          _.bindAll(this, 'isValidCatalogueName');
          //
          this.$noCatalogue = $('.no-catalogue');
          this.render();
          //
          this.listenTo(this.collection, 'add', this.renderQuestion);
          this.listenTo(this.collection, 'remove', this.removeQuestion);
          this.listenTo(this.collection, 'reset', this.renderEntireCollection);
          this.listenTo(this.collection, 'error', Utils.syncError);
          this.listenTo(this.collection, 'sync', Utils.syncSuccess);
          //
      },

      addNewQuestion : function( text ) {
          this.collection.create({question_text: text}, {wait: true});
          this.catalogue.incrementSize();
      },

      removeQuestion : function() {
          this.catalogue.decrementSize();
      },

      newQuestionFromKeyboard: function (e) {
          var $target = $(e.currentTarget);
          if (e.keyCode == 13 && $target.val()) {
              console.log(this.$questionText.val());
              this.addNewQuestion(this.$questionText.val());
              this.$questionText.val("");
          }
      },

      render: function () {
          console.log("Questions view render");
          this.$el.html(this.template(this.catalogue.serialize()));
          this.$questionText = $("#question-text");
          this.$listContainer = $("#question-container ul");
          this.$headingTitleInput = $('.panel-heading input.input-panel-heading');
          this.$headingTitleInput.bind('input propertychange', this.validateCatalogueName);
          this.$listContainer.html('');
          this.$statusIcon= this.$el.find(".input-status-icon");
          this.renderEntireCollection();
          this.installDroppable();
          this.$questionText.focus();
//            this.$el.find('.scroll-pane').jScrollPane({ autoReinitialise: true });
      },

      installDroppable : function() {
          var that =this;
          this.$listContainer.droppable({
              drop: _.bind(function( event, ui ) {
                  var questionText = ui.helper.find('p').html();
                  that.addNewQuestion(questionText);
                  console.log("Added question using drag and drop : " +  questionText);
              }, this)
          });
      },

      renderEntireCollection : function(){
          console.log("Questions view render entire collection");
          this.collection.each(function (item) {
              this.renderQuestion(item);
          }, this);
      },

      renderQuestion: function (item) {
//          console.log("Create a new question : " + item);
          var questionView = new QuestionView({ model: item });
//          console.log(questionView.render().el);
//          console.log(this.$listContainer);
          this.$listContainer.append(questionView.render().el);
          this.questions.push(questionView);
      },

      updateOnEnter: function (e) {
          if (e.keyCode == 13) {
              this.updateCatalogueName(this.$headingTitleInput.val());
          }
      },

      updateCatalogueOnFocusOut: function () {
          this.updateCatalogueName(this.$headingTitleInput.val());
      },

      isValidCatalogueName : function (current_value) {
          return !!current_value &&  !this.catalogue.collection.findWhere({"catalogue_name": current_value});
      },

      updateCatalogueName: function (updated_name) {
          // remove focus
          this.$headingTitleInput.blur();
          // remove status icon
          this.$statusIcon
              .removeClass("glyphicon-remove-circle")
              .removeClass("glyphicon-ok-circle");

          if (!this.isValidCatalogueName(updated_name)) {
              this.restoreCatalogueName();
              return;
          }

          this.catalogue.updateName(updated_name);

      },

       validateCatalogueName: function (e) {
          var $target = $(e.currentTarget);
          var current_value = $target.val();
          console.log(current_value);

          if (!this.isValidCatalogueName(current_value)) {
              this.$statusIcon.removeClass("glyphicon-ok-circle").addClass("glyphicon-remove-circle");
              return;
          }

          this.$statusIcon.removeClass("glyphicon-remove-circle").addClass("glyphicon-ok-circle");
      },

      restoreCatalogueName: function () {
          this.$headingTitleInput.val(this.catalogue.get('catalogue_name'));
      },

      remove: function () {
          this.$el.empty();
          this.stopListening();
          return this;
      },

      close: function (skipUpdateUrl) {
          console.log("Closing edit mode for " + this.catalogue.getName());
          _.each(this.questions, function (question_view) {
              question_view.close();
          });
          if (!skipUpdateUrl){
            window.app.router.QuestionsRouter.goToQuestions();
          }
          this.remove();
          this.unbind();
          this.undelegateEvents();
          this.$el.append(this.$noCatalogue);
      },

      deleteCatalogue: function () {
          console.log("Deleting catalogue " + this.catalogue.getName());
          this.catalogue.destroy();
          this.close();
      }

});

});
