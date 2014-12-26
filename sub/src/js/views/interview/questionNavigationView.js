define(function (require) {
  var BaseView = require('baseView');
  var QuestionNavigationItemView = require('views/interview/questionNavigationItemView');
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

        this.hasSubView('.question-navigation', navigationItemView);
        this.listenTo(navigationItemView, 'mouseover', this.onQuestionButtonOver, this);
        this.listenTo(navigationItemView, 'mouseleave', this.onQuestionButtonLeave, this);
      }, this);

      BaseView.prototype.initialize.apply(this, arguments);
    },

    questionUrl: function (question) {
      return QuestionPresenter.questionUrl(question);
    },

    onQuestionButtonOver: function (questionItemView) {
      var question = questionItemView.model;
      var $questionPreview = this.$('.question-selection-preview');
      $questionPreview.find('.number').text(QuestionPresenter.questionNumber(question));
      $questionPreview.find('.text').text(question.get('question_text'));
      $questionPreview.removeClass('not-visible').addClass('visible');
    },

    onQuestionButtonLeave: function () {
      var $questionPreview = this.$('.question-selection-preview');
      $questionPreview.find('.number').text('');
      $questionPreview.find('.text').text('');
      $questionPreview.removeClass('visible').addClass('not-visible');
    }
  });
});