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
        if($(this).offset().top > self.$el.scrollTop()+self.$el.height()*0.75) {
          $(this).find('.cd-timeline-img, .cd-timeline-content').addClass('is-hidden');
        }
      });

      this.$el.on('scroll', function(){
        console.log("events");
        $timeline_block.each(function(){
          if( $(this).offset().top <= self.$el.scrollTop()+self.$el.height()*0.75 &&
              $(this).find('.cd-timeline-img').hasClass('is-hidden') ) {
            $(this).find('.cd-timeline-img, .cd-timeline-content').removeClass('is-hidden').addClass('bounce-in');
          }
        });
      });
    }
  });

});
