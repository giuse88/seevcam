define(function (require) {
  var BaseView = require('baseView');
  var OverallRatingListView = require('views/review/overallRatingListView');
  var ReviewItemListView = require('views/review/reviewItemListView');
  var $ = require('jquery');
  require('slimscroll');

  return BaseView.extend({
    className: 'review-page',
    template: require('text!templates/review/review-page.html'),

    events: {
      'click .conclude-control': 'onClickConclude'
    },

    setUp: function () {
      this.attachSubView('.review-item-list-container', new ReviewItemListView({collection: this.model.get('answers'), questions: this.model.get('questions')}));
    },

    postRender: function () {
      this.openModal(new OverallRatingListView({collection: this.model.get('overallRatings')}), {
        okText: 'Next',
        allowCancel: false,
        footer: true
      });

      var windowWidth = $(window).width();
      this.$el.slimScroll({
        height: 'auto',
        position: 'right',
        alwaysVisible: true,
        railVisible: true,
        distance: (windowWidth / 2 + windowWidth / 200) + 'px'
      });
    },

    teardown: function () {
      this.$el.slimScroll('destroy');
    },

    onClickConclude: function () {
      alert('Closing ...');
    }
  });
});