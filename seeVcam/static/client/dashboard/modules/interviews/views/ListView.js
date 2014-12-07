define(function (require) {

  var $ = require("jquery");
  var _ = require("underscore");
  var Backbone = require("backbone");

  return  Backbone.View.extend({

    template : _.template('' +
      '<div data-interview-id="<%= id %>" class="interview-item <%= date_string %>" >' +
      '<span class="glyphicon glyphicon-remove"></span> ' +
      '<header>' +
      '<div class="row">' +
       '         <div class="col-sm-12">' +
        '            <div class="name-container">' +
        '                <h4><%= name %>  <%= surname %></h4>' +
        '            </div>' +
        '            <p> <% job_position %></p>' +
        '        </div>' +
        '    </div>' +
        '</header>' +
        '<section class="interview-time">' +
         '   <p class="interview-date">' +
         '       <span class="date-string"><%= date_string %></span>' +
         '       <span class="date-month"><%= month %></span>' +
         '       <span class="date-separator"><%=  date_separator %></span>' +
         '       <span class="date-day"><%= day %></span>' +
         '       <span class="date-separator"><%= date_separator %></span>' +
         '       <span class="date-year"><% year %></span></p>' +
         '   <p class="interview-hours"><% time %></p>' +
        '</section>' +
    '</div>'),

    render : function() {
      return this;
    }

  });

});