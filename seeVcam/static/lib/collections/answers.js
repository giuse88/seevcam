define(function(require){
  var Answer = require("models/answer");
  var Backbone = require("backbone");

  return Backbone.Collection.extend({
    model: Answer,

    url: function () {
      return '/dashboard/interviews/' + this.interviewId + '/answers';
    },

    initialize: function (models, options) {
      this.interviewId = options.interviewId;
    },

    getOverallScore: function () {
      var averageScore = this.computeOverallScore();
      return this.roundToAtMostOneDecimalPlaces(averageScore);
    },

    computeOverallScore : function () {
      var answerRatingSum = 0;
      var answerWithRatingCounter = 0;

      this.each(function (answer) {
        var rating = answer.get("rating");
        if (rating) {
          answerRatingSum += rating;
          answerWithRatingCounter++;
        }
      });

      return answerRatingSum/answerWithRatingCounter;
    },

    roundToAtMostOneDecimalPlaces: function (average) {
      return Number(average.toFixed(1));
    }
  });
});