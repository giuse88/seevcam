define(function(require){

  var Backbone = require("backbone");
  var Interview = require("models/interview");

  function filter ( interviews, predicate ) {
    var filtered = interviews.filter(predicate);
    return new InterviewList(filtered);
  }

  var InterviewList =  Backbone.Collection.extend({

      model: Interview,
      url: "/dashboard/interviews/interviews",

      initialize: function (interviews) {
      },

      comparator : function () {
        return this.get("start");
      },

      filterByNameOrJobSpecification: function (key) {
        if (!key) {
          return this;
        }
        var filtered = this.filter(function(interview) {
          var fullName =  interview.getCandidateFullName().toLowerCase();
          var jobPositionName = interview.get("job_position_name").toLowerCase();
          var normalizedKey = key.toLowerCase();
          return jobPositionName.indexOf(normalizedKey) > -1 || fullName.indexOf(key.toLowerCase()) > -1;
        });
        return new InterviewList(filtered);
      },

      getInterviews : function () {
        function openInterview ( interview ) {
          return interview.get("status") === "OPEN";
        }
        return filter(this, openInterview);
      },

      getReports : function () {
        function isAReport ( interview ) {
          return interview.get("status") === "CLOSED";
        }
        return filter(this, isAReport);
      },

      getTodayInterviews : function () {
        var todayInterviews = this.filter(function(interview) {
           var interviewStart = new Date(interview.get('start'));
           var today = new Date();
           return today.getUTCDate() === interviewStart.getUTCDate();
        });
        return todayInterviews;
      }

    });

    return InterviewList;

});