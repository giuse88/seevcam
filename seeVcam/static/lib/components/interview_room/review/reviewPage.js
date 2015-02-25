define(function (require) {
  require('slimscroll');

  var BaseView = require('baseView');
  var Navigator = require("navigator");
  var OverallRatingListView = require('./overallRatingListView');
  var ReviewItemListView = require('components/review_item_list/reviewItemListView');

  return BaseView.extend({
    className: 'review-page',
    template: require('text!./templates/review-page.html'),

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
    },

    teardown: function () {
      this.$el.slimScroll('destroy');
    },

    onClickConclude: function () {
      // set the interview scoere
      this.model.get("interview").save({status : "CLOSED"}, {
        patch:true,
        success : function () {
          Navigator.goToDashboard();
        },
        error : function () {
          console.error("failing closing interview");
        }
      });
    }
  });
});