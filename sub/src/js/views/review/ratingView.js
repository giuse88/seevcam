define(function (require) {
  var BaseView = require('baseView');

  return BaseView.extend({
    className: 'rating',
    template: require('text!templates/review/rating.html'),

    events: {
      'click [data-rating-value]': 'onClickRating'
    },

    setUp: function () {
      this.listenTo(this.model, 'change:rating', this.highlightRating, this);
    },

    highlightRating: function () {
      this.$('[data-rating-value].active').removeClass('active');
      this.$('[data-rating-value="' + this.model.get('rating') + '"]').addClass('active');
    },

    onClickRating: function (e) {
      var newRating = parseInt($(e.currentTarget).data('rating-value'));
      this.model.set('rating', newRating);
    }
  })
});