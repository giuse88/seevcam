define(function (require) {

  var _ = require("underscore");
  var Backbone = require("backbone");
  var moment = require("moment");

	return  Backbone.View.extend({

    tagName : 'div',
    className : 'item',

    block_item_template : _.template(require("text!../templates/block_item.html")),
    list_item_template : _.template(require("text!../templates/list_item.html")),

    defaults : {
      isInterview : true
    },

    events : {
      'click .delete-interview' : 'removeInterview',
      'click '   : 'handleItemClick'
    },

    initialize : function(options) {
      this.options = _.extend( this.defaults, options);
    },

    getDataForTemplate : function(){
      // this transform the date received from the server to
      // the lib timezone
      var interviewStart = moment(this.model.get('start'));
      return {
        id : this.model.get('id'),
        name : this.model.get("candidate.name"),
        surname : this.model.get("candidate.surname"),
        job_position  : this.model.get("job_position_name"),
				overall_score: this.model.get("overall_score"),
        year : interviewStart.format("YYYY"),
        time : interviewStart.format("HH:mm"),
        day  : interviewStart.format("DD"),
        month : interviewStart.format("MM"),
        date_string : "",
        isInterview : this.options.isInterview,
				isOpen: this.model.isOpen(),
        date_separator : "-"
      }
    },

    toTimeString: function(number){
     return number > 9 ? String(number) : "0" +  number;
    },

    handleItemClick : function(event) {
      event.preventDefault();
      var router = window.app.router.InterviewsRouter;
      if ( this.options.isInterview && this.model.isOpen()) {
        router.goToInterviewRoom(this.model.getInterviewRoomURL());
      } else if ( this.options.isInterview) {
        router.goToInterview(this.model.get("id"), true);
      } else {
        router.goToReports(this.model.get("id"), true);
      }
    },

    removeInterview : function (event) {
      console.log("remove Interview");
      event.preventDefault();
      event.stopPropagation();
      //Delete model
      this.model.destroy();
      //Delete view
      this.close();
    },

    render : function() {
      console.log(this.getDataForTemplate());
      var template = this.options.mode === "list" ? this.list_item_template : this.block_item_template;
      this.$el.html(template(this.getDataForTemplate()));
      return this;
    },

    close: function (){
      this.remove();
      this.unbind();
      this.undelegateEvents();
    }

  });

});
