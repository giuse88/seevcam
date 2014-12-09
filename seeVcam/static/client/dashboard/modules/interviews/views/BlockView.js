define(function (require) {

  var $ = require("jquery");
  var _ = require("underscore");
  var Backbone = require("backbone");

  return  Backbone.View.extend({

    tagName : 'div',
    className : 'interview-item',

    template : _.template('' +
//      '<div data-interview-id="<%= id %>" class="interview-item <%= date_string %>" >' +
      '<span class="glyphicon glyphicon-remove"></span> ' +
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
      '       <span class="date-year"><%= year %></span>' +
      '       <span class="date-separator"><%= date_separator %></span>' +
      '       <span class="date-month"><%= month %></span>' +
      '       <span class="date-separator"><%=  date_separator %></span>' +
      '       <span class="date-day"><%= day %></span>' +
      '    </p> ' +
      '   <p class="interview-hours"><%= time %></p>' +
      '</section>'),

    getDataForTemplate : function(){
      var interviewStart = new Date(this.model.get('start'));
      return {
        id : this.model.get('id'),
        name : this.model.get("candidate.name"),
        surname : this.model.get("candidate.surname"),
        job_position  : this.model.get("job_position_name"),
        year : interviewStart.getUTCFullYear(),
        time : interviewStart.getHours() + ":" + interviewStart.getMinutes(),
        day  : interviewStart.getDay(),
        month : interviewStart.getMonth(),
        date_string : "",
        date_separator : "-"
      }
    },

    render : function() {
      console.log(this.getDataForTemplate());
      this.$el.html(this.template(this.getDataForTemplate()));
      return this;
    }

  });

});
