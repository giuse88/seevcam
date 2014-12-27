define(function (require) {
  var BaseView = require('baseView');
  var OverallRatingListView = require('views/review/overallRatingListView');
  var ReviewItemListView = require('views/review/reviewItemListView');

  return BaseView.extend({
    className: 'review-page',
    template: require('text!templates/review/review-page.html'),

    setUp: function () {
      this.attachSubView('.review-item-list-container', new ReviewItemListView({collection: this.model.get('answers'), questions: this.model.get('questions')}));
    },

    postRender: function () {
      this.openModal(new OverallRatingListView({collection: this.model.get('overallRatings')}), {
        okText: 'Next',
        allowCancel: false,
        footer: true
      });
    }
  });
});