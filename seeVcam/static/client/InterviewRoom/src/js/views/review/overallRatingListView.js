define(function (require) {
  var BaseView = require('baseView');
  var OverallRatingView = require('views/review/overallRatingView');

  return BaseView.extend({
    template: require('text!templates/review/overall-rating-list.html'),

    setUp: function () {
      this.collection.each(function (overallRating) {
        this.attachSubView('.overall-rating-list', new OverallRatingView({model: overallRating, tagName: 'li'}));
      }, this);
    }
  });
});