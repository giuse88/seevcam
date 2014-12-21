define(function (require) {
  var BaseView = require('baseView');

  return BaseView.extend({
    template: require('text!templates/answer.html'),

    events: {
      'click .rating-button': 'ratingClicked'
    },

    bindings: {
      '.answer': {
        observe: 'content'
      }
    },

    postRender: function () {
      this.highlightRating();
    },

    ratingClicked: function (e) {
      var newRating = parseInt($(e.currentTarget).data('rating'));
      var oldRating = this.model.get('rating');

      if (newRating == oldRating) return;

      this.model.set('rating', newRating);
      this.highlightRating();

      var eventLogger = require('services/eventLogger');
      if (oldRating === null || oldRating === undefined) {
        eventLogger.log(eventLogger.eventType.rated, {rating: newRating, question_id: this.model.get('question')});
      } else {
        eventLogger.log(eventLogger.eventType.rateUpdated, {new_rating: newRating, old_rating: oldRating, question_id: this.model.get('question')});
      }
    },

    highlightRating: function () {
      var rating = this.model.get('rating');
      this.$('.rating-button').each(function () {
        var $this = $(this);
        $this.removeClass($this.data('default-icon'))
          .removeClass($this.data('active-icon'))
          .removeClass($this.data('inactive-icon'));

        if (rating === null || rating === undefined) {
          $this.addClass($this.data('default-icon'));
        } else if ($this.data('rating') == rating.toString()) {
          $this.addClass($this.data('active-icon'));
        } else {
          $this.addClass($this.data('inactive-icon'));
        }
      });
    }
  });
});