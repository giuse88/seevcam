define(function(require){

  var Backbone = require("backbone");
  var _ = require("underscore");

  return  Backbone.View.extend({

    tagName: 'li',

    id: function () {
        return this.model.get('id')
    },

    className: 'question',
    template: _.template(
            '<div class="view form-group"> <p><%- question_text %></p> ' +
            '<a class="delete"> <span class="hidden glyphicon glyphicon-trash"></span> </a>' +
            '</div> ' +
            '<input class="edit form-control" type="text" value="<%- question_text %>" /> '
    ),

    events: {
        "click .delete": 'deleteQuestion',
        "keypress .edit": "updateOnEnter",
        "blur .edit": "closeEditing",
        "click .view": "edit"
    },

    initialize: function () {
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'destroy', this.remove);
    },

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        this.$input = this.$('.edit');
        this.$el.hover(function () {
            $(this).find(".glyphicon").removeClass("hidden");
        }, function () {
            $(this).find(".glyphicon").addClass("hidden");
        });
        return this;
    },

    deleteQuestion: function () {
        //Delete model
        this.model.destroy();
        //Delete view
        this.remove();
    },

    // Switch this view into `"editing"` mode, displaying the input field.
    edit: function () {
        this.$el.addClass("editing");
        this.$input.focus();
    },

    // Close the `"editing"` mode, saving changes to the todo.
    closeEditing: function () {
        var value = this.$input.val();
        if (!value) {
            this.clear();
        } else {
            this.model.save({question_text: value});
            this.$el.removeClass("editing");
        }
    },
    // If you hit `enter`, we're through editing the item.
    updateOnEnter: function (e) {
        if (e.keyCode == 13) this.closeEditing();
    },


    close: function () {
        this.remove();
        this.unbind();
        this.undelegateEvents();
    }


  });
});