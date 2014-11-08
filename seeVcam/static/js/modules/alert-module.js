(function alertModule() {

    var AlertView = Backbone.View.extend({
        el : 'body',
        className:'alert',
        template : _.template('<div  class="alert alert-<%= type %> notification fade in">' +
                              '<a href="#" class="close" data-dismiss="alert">&times;</a>' +
                              ' <strong><%= shortMessage %> </strong> <%= message %>' +
                              '</div>'),

        initialize: function(){
           this.render();
        },

        render : function () {
           console.log("Rendering notification");
           this.$el.append(this.template(this.model));
           return this;
        }

    });

    function warning(shortMessage, message){
       return new AlertView({model:{type:"warning", message : message, shortMessage : shortMessage}});
    }

    function success(shortMessage, message){
        return new AlertView({model:{type:"success", message : message, shortMessage : shortMessage}});
    }

    function error(shortMessage, message){
        return new AlertView({model:{type:"danger", message : message, shortMessage : shortMessage}});
    }

     window.notification = {
         warning: warning,
         success :success,
         error : error
    };

    console.log("Installed notification modules");

})();