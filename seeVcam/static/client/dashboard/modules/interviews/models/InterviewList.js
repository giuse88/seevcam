define(function(require){

  var Backbone = require("backbone");
  var Interview = require("modules/interviews/models/Interview");
  var notification = require("notification");

  var InterviewList =  Backbone.Collection.extend({

      model: Interview,
      url: "/dashboard/interviews/interviews",

      initialize: function (interviews) {
      },

      filterByName: function (name) {
        if (!name) {
          return this;
        }
        var filtered = this.filter(function(interview) {
          var fullName =  interview.getCandidateFullName();
          fullName = fullName.toLowerCase();
          return fullName.indexOf(name.toLowerCase()) > -1;
        });
        return new InterviewList(filtered);
      },

     getTodayInterviews : function () {
      var todayInterviews = this.filter(function(interview) {
         var interviewStart = new Date(interview.start);
         var today = new Date();
         return today.getDay() === interviewStart.getDay();
      });
      return todayInterviews;
     }

    });

    return InterviewList;

});