define(function (require) {

  var $ = require("jquery");
  var _ = require("underscore");
  var BaseView = require('baseView');

  return BaseView.extend({
    template: require('text!./templates/template.html'),
    className : "timeline",
    postRender : function () {
     	var $timeline_block = this.$el.find('.cd-timeline-block');
      var self = this;

      $timeline_block.each(function(){
        if($(this).position().top > self.$el.height()) {
          $(this).find('.cd-timeline-img, .cd-timeline-content').addClass('is-hidden');
        }
      });

      this.$el.on('scroll', function(){
        console.log("events");
        $timeline_block.each(function(){
          if( $(this).position().top <= self.$el.scrollTop() + self.$el.height()/2 &&
              $(this).find('.cd-timeline-img').hasClass('is-hidden') ) {
            console.log("Yesss");
            $(this).find('.cd-timeline-img, .cd-timeline-content').removeClass('is-hidden').addClass('bounce-in');
          }
        });
      });
    }
  });

});
