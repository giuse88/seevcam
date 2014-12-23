/**
 *
 * Created by giuseppe on 23/12/14.
 */

define(function (require) {

  var $ = require("jquery");
  var _ = require("underscore");
  var Backbone = require("backbone");
  var createFormTemplate = require("text!modules/interviews/templates/createJobPosition.html");
  var JobPosition = require("modules/interviews/models/JobPosition");

 return Backbone.View.extend({
    className : "job-position-create-container",
    template: _.template(createFormTemplate),

    events :  {
      'submit #createJobSpec'  : 'handleFormSubmit'
    },

    render: function() {
      this.$el.html(this.template);
      this.$form = this.$el.find("form");
      return this;
    },

    handleFormSubmit : function(event) {
      event.preventDefault();
      var jobPostion = new JobPosition(this.serializer());
      console.log(jobPostion.get("position"));
      console.log(jobPostion.toJSON());
      window.cache.jobPositions.create(jobPostion,
        {
        success: function (response) {
          console.log("Job spec created ");
        },
        error: function (response) {
          console.error("FAILED : job Spec");
          console.error(response);
          Notification.warning("Update failed", "Reloading the page should fix the issue");
        }
      });
    },

   serializer: function(){
     var jobSpec = {};
     this.$form.serializeArray().map(function(item) {
       jobSpec[item.name] = item.value;
     });
     jobSpec.job_description = Number(jobSpec.job_description);
     return jobSpec;
   }
  });

});

