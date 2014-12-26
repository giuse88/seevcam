define(function (require) {
  var BaseView = require('baseView');
  var _ = require('underscore');

  return BaseView.extend({
    template: require('text!templates/overall-rating.html'),

    events: {
      'mouseover [data-rating-value]': 'onMouseEnterRating',
      'mouseleave [data-rating-value]': 'onMouseLeaveRating',
      'click [data-rating-value]': 'onClickRating'
    },

    postRender: function () {
      this.highlightRating(this.model.get('rating'));
    },

    onMouseEnterRating: function (e) {
      var ratingValue = parseInt($(e.currentTarget).data('rating-value'));
      this.highlightRating(ratingValue);
    },

    onMouseLeaveRating: function () {
      this.highlightRating(this.model.get('rating'));
    },

    onClickRating: function (e) {
      var ratingValue = parseInt($(e.currentTarget).data('rating-value'));
      this.model.set('rating', ratingValue);
    },

    highlightRating: function (ratingValue) {
      ratingValue = ratingValue || 0;

      var ratingClass;
      if (ratingValue < 3) {
        ratingClass = 'negative';
      } else if (ratingValue == 3) {
        ratingClass = 'neuter';
      } else {
        ratingClass = 'positive';
      }

      this.$('[data-rating-value]').each(function () {
        var thisRating = parseInt(this.getAttribute('data-rating-value'));
        if (thisRating <= ratingValue) {
          this.setAttribute('class', ratingClass);
        } else {
          this.setAttribute('class', 'empty');
        }
      });
    }
  });
});