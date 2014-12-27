define(function (require) {
  var BaseView = require('baseView');
  var OverallRatingListView = require('views/overallRatingListView');

  return BaseView.extend({
    template: require('text!templates/review-page.html'),

    postRender: function () {
      this.openModal(new OverallRatingListView({collection: this.model.get('overallRatings')}), {
        okText: 'Next',
        allowCancel: false,
        footer: true
      });
    }
  });
});