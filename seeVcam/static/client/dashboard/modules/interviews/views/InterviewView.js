define(function (require) {

  var _ = require("underscore");
  var Backbone = require("backbone");
  var moment = require("moment");
	var BlockItemTemplate = require("text!modules/interviews/templates/blockItem.html")
	var ListItemTemplate = require("text!modules/interviews/templates/listItem.html")


	return  Backbone.View.extend({

    tagName : 'div',
    className : 'col-md-3',

    block_item_template : _.template(require("text!modules/interviews/templates/block_item.html")),
    list_item_template : _.template(require("text!modules/interviews/templates/list_item.html")),

    defaults : {
      isReport : false
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
      // the client timezone
      var interviewStart = moment(this.model.get('start'));
      return {
        id : this.model.get('id'),
        name : this.model.get("candidate.name"),
        surname : this.model.get("candidate.surname"),
        job_position  : this.model.get("job_position_name"),
        year : interviewStart.format("YYYY"),
        time : interviewStart.format("HH:mm"),
        day  : interviewStart.format("DD"),
        month : interviewStart.format("MM"),
        date_string : "",
        isReport : this.options.isReport,
        isInterview : !this.options.isReport,
        classType : this.options.isReport ? "report-item" : "interview-item",
        date_separator : "-"
      }
    },

    toTimeString: function(number){
     return number > 9 ? String(number) : "0" +  number;
    },

    handleItemClick : function(event) {
      event.preventDefault();
      if ( this.model.isOpen()) {
        console.log("Interview open");
        window.app && window.app.router && window.app.router.InterviewsRouter &&
        window.app.router.InterviewsRouter.goToInterviewRoom(this.model.getInterviewRoomURL());
      } else {
        window.app && window.app.router && window.app.router.InterviewsRouter &&
        window.app.router.InterviewsRouter.goToInterview(this.model.get("id"), true);
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
      var template = this.options.list ? this.list_item_template : this.block_item_template;
      this.$el.html(template(this.getDataForTemplate()));
      // This should be in the template
      if (this.options.today) {
        this.$el.addClass('today');
      }
      return this;
    },

    close: function (){
      this.remove();
      this.unbind();
      this.undelegateEvents();
    }

  });

});
