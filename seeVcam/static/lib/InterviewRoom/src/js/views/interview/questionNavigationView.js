define(function (require) {
  var BaseView = require('baseView');
  var QuestionNavigationItemView = require('views/interview/questionNavigationItemView');
  var QuestionPreviewView = require('views/interview/questionPreviewView');
  var QuestionPresenter = require('presenters/questionPresenter');

  return BaseView.extend({
    template: require('text!templates/interview/question-navigation.html'),

    initialize: function (options) {
      this.answers = options.answers;
      this.currentQuestion = options.currentQuestion;

      this.collection.each(function (question) {
        var navigationItemView = new QuestionNavigationItemView({
          model: question,
          answer: this.answers.findWhere({question: question.id}),
          isSelected: question == this.currentQuestion
        });

        this.attachSubView('.question-navigation', navigationItemView);
        this.listenTo(navigationItemView, 'mouseover', this.onQuestionButtonOver, this);
        this.listenTo(navigationItemView, 'mouseleave', this.onQuestionButtonLeave, this);
      }, this);

      BaseView.prototype.initialize.apply(this, arguments);
    },

    questionUrl: function (question) {
      return QuestionPresenter.questionUrl(question);
    },

    onQuestionButtonOver: function (questionItemView) {
      this.currentPreview = new QuestionPreviewView({model: questionItemView.model});
      this.attachSubView('.question-selection-preview', this.currentPreview);
    },

    onQuestionButtonLeave: function () {
      this.detachSubView(this.currentPreview);
    }
  });
});