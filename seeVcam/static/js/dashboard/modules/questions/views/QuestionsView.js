define(function (require) {

  var $ = require("jquery");
  var _ = require("underscore");
  var Backbone = require("backbone");

  return  Backbone.View.extend({

        tagName : 'ul',
        className : 'question-list',
        template_no_questions : '<li class="question"><div class="question-read-only view form-group"> <p>No questions</p></div></li>',

        initialize : function(options){
            this.catalogue = options && options.catalogue;
            this.readOnly  = options && options.readOnly;
            this.collection = options.catalogue.getOrCreateQuestions();
            this.questionsViews = [];

            _.bindAll(this, 'render');
            _.bindAll(this, 'renderQuestion');
            _.bindAll(this, 'renderAllQuestions');
            _.bindAll(this, 'renderNoQuestion');

            this.listenTo(this.collection, 'add', this.renderQuestion);
            this.listenTo(this.collection, 'error', syncError);
            this.listenTo(this.collection, 'sync', this.renderAllQuestions);
            this.listenTo(this.collection, 'remove', this.renderNoQuestion);
            this.listenTo(this.collection, 'destroy', this.renderNoQuestion);

        },

        renderNoQuestion : function(){
            debugger;
            if (this.catalogue.get("catalogue_size") === 0)
                this.$el.append(this.template_no_questions);
        },

        render:function() {
            if (this.catalogue.get("catalogue_size") === 0)
                this.$el.append(this.template_no_questions);
            else
               this.renderAllQuestions();
            return this;
        },

         renderAllQuestions: function(){
            this.$el.html("");
            console.log("Questions view render entire collection");
            this.collection.each(function (item) {
                this.renderQuestion(item);
            }, this);
            console.log("Questions view render entire collection end");
            return this;
        },

        renderQuestion: function (item) {
            var questionView = null;
            if (this.readOnly){
                questionView =new QuestionViewReadOnly({ model: item });
            }else {
                questionView =new app.QuestionView({ model: item });
            }
            this.$el.append(questionView.render().el);
            this.questionsViews.push(questionView);
        }

    });

});
