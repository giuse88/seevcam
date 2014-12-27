define(function (require) {
  var BaseView = require('baseView');

  return BaseView.extend({
    tagName: 'span',
    className: 'ratings',
    template: require('text!templates/common/answer-rating.html'),

    events: {
      'click .rating-button': 'ratingClicked'
    },

    initialize: function (options) {
      if (options.big) {
        this.buttonClass = 'icon-big';
      } else {
        this.buttonClass = 'icon-small';
      }

      BaseView.prototype.initialize.apply(this, arguments);
    },

    setUp: function () {
      this.listenTo(this.model, 'change:rating', this.highlightRating, this);
    },

    postRender: function () {
      this.highlightRating();
    },

    ratingClicked: function (e) {
      var newRating = parseInt($(e.currentTarget).data('rating'));
      var oldRating = this.model.get('rating');

      if (newRating == oldRating) return;

      this.model.set('rating', newRating);

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
  });
});