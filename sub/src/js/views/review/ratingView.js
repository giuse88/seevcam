define(function (require) {
  var BaseView = require('baseView');
  var AnswerPresenter = require('presenters/answerPresenter');
  var AnswerRating = require('views/common/answerRating');

  return BaseView.extend({
    className: 'rating',
    template: require('text!templates/review/rating.html'),

    events: {
      'click [data-rating-value]': 'onClickRating'
    },

    setUp: function () {
      this.attachSubView('.ratings-container', new AnswerRating({model: this.model}));
    },

    postRender: function () {
      this.highlightRating();
    },

    onClickRating: function (e) {
      e.preventDefault();
      e.stopPropagation();

      var newRating = parseInt($(e.currentTarget).data('rating-value'));
      this.model.set('rating', newRating);
      this.highlightRating(true);
    },

    highlightRating: function (hasChanged) {
      this.highlightRatingButton();

      if (hasChanged) {
        this.displayChangedValue();
      }
    },

    displayChangedValue: function () {
      this.$('.rating-change b').text(this.model.previous('rating'));
      this.$('.rating-change').show();
    },

    highlightRatingButton: function () {
      this.$('[data-rating-value].active').attr('class', '');
      this.$('[data-rating-value="' + this.model.get('rating') + '"]')
        .addClass('active')
        .addClass(AnswerPresenter.ratingType(this.model));
    }
  });
});