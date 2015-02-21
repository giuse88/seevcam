define(function (require) {
  var BaseView = require('baseView');
  var AnswerPresenter = require('presenters/answerPresenter');
  var AnswerRating = require('components/answer_rating/answerRating');

  return BaseView.extend({
    className: 'rating',
    template: require('text!./templates/rating.html'),

    events: {
      'click [data-rating-value]': 'onClickRating'
    },

    setUp: function () {
      this.listenTo(this.model, 'change:rating', this.onChangeRating, this);

      this.attachSubView('.ratings-container', new AnswerRating({model: this.model}));
    },

    postRender: function () {
      this.highlightRatingButton();
    },

    onClickRating: function (e) {
      e.preventDefault();
      e.stopPropagation();

      var newRating = parseInt($(e.currentTarget).data('rating-value'));
      this.model.set('rating', newRating);
    },

    onChangeRating: function () {
      this.highlightRatingButton();
      this.displayChangedValue();
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
    },

    getRatingValues: function () {
      return _(AnswerPresenter.ratingIntervals).chain()
        .pluck('values')
        .flatten()
        .value();
    }
  });
});