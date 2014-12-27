define(function (require) {
  var BaseView = require('baseView');
  var AnswerPresenter = require('presenters/answerPresenter');

  return BaseView.extend({
    className: 'rating',
    template: require('text!templates/review/rating.html'),

    events: {
      'click [data-rating-value]': 'onClickRating'
    },

    setUp: function () {
      this.listenTo(this.model, 'change:rating', this.onChangeRating, this);
    },

    postRender: function () {
      this.highlightRating();
    },

    highlightRating: function (hasChanged) {
      this.$('[data-rating-value].active').attr('class', '');
      this.$('[data-rating-value="' + this.model.get('rating') + '"]')
        .addClass('active')
        .addClass(AnswerPresenter.ratingType(this.model));

      if (hasChanged) {
        this.$('.rating-change b').text(this.model.previous('rating'));
        this.$('.rating-change').show();
      }
    },

    onChangeRating: function () {
      this.highlightRating(true);
    },

    onClickRating: function (e) {
      var newRating = parseInt($(e.currentTarget).data('rating-value'));
      this.model.set('rating', newRating);
    }
  })
});