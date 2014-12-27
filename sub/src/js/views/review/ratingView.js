define(function (require) {
  var BaseView = require('baseView');
  var AnswerPresenter = require('presenters/answerPresenter');

  return BaseView.extend({
    className: 'rating',
    template: require('text!templates/review/rating.html'),

    events: {
      'click [data-rating-value]': 'onClickRating'
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
      this.$('[data-rating-value].active').attr('class', '');
      this.$('[data-rating-value="' + this.model.get('rating') + '"]')
        .addClass('active')
        .addClass(AnswerPresenter.ratingType(this.model));

      if (hasChanged) {
        this.$('.rating-change b').text(this.model.previous('rating'));
        this.$('.rating-change').show();
      }

      var rating = this.model.get('rating');
      this.$('.rating-icon').each(function () {
        var $this = $(this);
        $this.removeClass($this.data('default-icon'))
          .removeClass($this.data('active-icon'))
          .removeClass($this.data('inactive-icon'));

        var minRating = $this.data('min-rating');
        var maxRating = $this.data('max-rating');

        if (rating === null || rating === undefined) {
          $this.addClass($this.data('default-icon'));
        } else if (minRating <= rating && rating <= maxRating) {
          $this.addClass($this.data('active-icon'));
        } else {
          $this.addClass($this.data('inactive-icon'));
        }
      });
    }
  })
});