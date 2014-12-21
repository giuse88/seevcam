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
      this.model.set('rating', newRating);
      this.highlightRating();
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