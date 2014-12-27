define(function (require) {
  var BaseView = require('baseView');

  return BaseView.extend({
    tagName: 'span',
    className: 'ratings',
    template: require('text!templates/common/answer-rating.html'),

    events: {
      'click .rating-button': 'onClickRating',
      'mouseenter .rating-button': 'onMouseEnterRating',
      'mouseleave .rating-button': 'onMouseLeaveRating'
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

    onClickRating: function (e) {
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

    onMouseEnterRating: function (e) {
      var self = this;
      var $currentRating = $(e.currentTarget);
      this.$('.rating-button')
        .not($currentRating)
        .each(function () {
          self.setState($(this), 'inactive');
        });

      self.setState($currentRating, 'active');
    },

    onMouseLeaveRating: function () {
      this.highlightRating();
    },

    highlightRating: function () {
      var rating = this.model.get('rating');
      var self = this;

      this.$('.rating-button').each(function () {
        var $this = $(this);

        var minRating = $this.data('min-rating');
        var maxRating = $this.data('max-rating');

        var newState = 'inactive';
        if (rating === null || rating === undefined || (minRating <= rating && rating <= maxRating)) {
          newState = 'default';
        }

        self.setState($this, newState);
      });
    },

    setState: function ($rating, state) {
      $rating.removeClass($rating.data('default-icon'))
        .removeClass($rating.data('active-icon'))
        .removeClass($rating.data('inactive-icon'))
        .addClass($rating.data(state + '-icon'));
    }
  });
});