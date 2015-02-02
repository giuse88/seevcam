define(function (require) {

  var _ = require("underscore");
  var Backbone = require("backbone");
  var moment = require("moment");

  return  Backbone.View.extend({

    tagName : 'div',
    className : 'interview-item',

    block_item_template : _.template('' +
      '<span class="glyphicon glyphicon-remove delete-interview"></span> ' +
      '<header>' +
      '<div class="row">' +
      '         <div class="col-sm-12">' +
      '            <div class="name-container">' +
      '                <h4><%= name %>  <%= surname %></h4>' +
      '            </div>' +
      '            <p> <%= job_position %></p>' +
      '        </div>' +
      '    </div>' +
      '</header>' +
      '<section class="interview-time">' +
      '   <p class="interview-date">' +
      '       <span class="date-string"><%= date_string %></span>' +
      '       <span class="date-day"><%= day %></span>' +
      '       <span class="date-separator"><%= date_separator %></span>' +
      '       <span class="date-month"><%= month %></span>' +
      '       <span class="date-separator"><%=  date_separator %></span>' +
      '       <span class="date-year"><%= year %></span>' +
      '    </p> ' +
      '   <p class="interview-hours"><%= time %></p>' +
      '</section>'),

    list_item_template : _.template('' +
        '<div class="interview-date"><span class="date-string"> <%= date_string %></span>' +
        '<span class="date-month"><%= month %></span> <span class="date-separator"><%= date_separator %></span>' +
        '<span class="date-day"><%= day %></span> <span class="date-separator"><%= date_separator %></span>' +
        '<span class="date-year"><%= year %></span></div>' +
        '<div class="interview-time"><%= time %></div>' +
        '<h4><%= name %>  <%= surname %></h4>' +
        '<p><%= job_position%> </p>' +
        '<div class="action-icons">' +
            '<span class="glyphicon glyphicon-remove delete-interview"></span> ' +
        '</div>'),

    events : {
      'click .delete-interview' : 'removeInterview',
      'click '   : 'handleItemClick'
    },

    initialize : function(options) {
      this.options = options || {};
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
