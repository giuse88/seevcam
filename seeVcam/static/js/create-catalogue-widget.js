(function() {

var app = app || {};

// Question Model
app.Question = Backbone.Model.extend({
      defaults: {
        question_text  : ""
     },

     parse: function( response ) {
        response.id = response.id;
        return response;
     }
});

// List Model
app.List = Backbone.Collection.extend({

    initialize : function(models, options) {
        this.catalogue= options.catalogue;
        this.url = "/dashboard/questions/catalogue/" + this.catalogue.id + "/list/";
    },
    model : app.Question,

    get_catalogue : function () {
       return this.catalogue;
    },

    get_catalogue_url:function() {
       return "/dashboard/questions/catalogue/" + this.catalogue.id + "/";
    }

});

// Question view
app.QuestionView = Backbone.View.extend({

    tagName:   'li',
    id :  function() {return this.model.get('id')} ,
    className: 'question',
    template: _.template( $( '#questionTemplate' ).html() ),

     events: {
        "click .delete": 'deleteQuestion',
        "keypress .edit"  : "updateOnEnter",
        "blur .edit"      : "close",
        "click .view"  : "edit"
    },

    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
    },

    render: function() {
        this.$el.html( this.template( this.model.toJSON() ) );
        this.$input = this.$('.edit');
        return this;
    },

    deleteQuestion: function() {
        //Delete model
        this.model.destroy();
        //Delete view
        this.remove();
    },

    // Switch this view into `"editing"` mode, displaying the input field.
    edit: function() {
      this.$el.addClass("editing");
      this.$input.focus();
    },

    // Close the `"editing"` mode, saving changes to the todo.
    close: function() {
        var value = this.$input.val();
        if (!value) {
            this.clear();
        } else {
            this.model.save({question_text: value});
            this.$el.removeClass("editing");
        }
    },
     // If you hit `enter`, we're through editing the item.
    updateOnEnter: function(e) {
      if (e.keyCode == 13) this.close();
    }


});

// List view
app.ListView = Backbone.View.extend({

    template: _.template( $("#editCatalogueTemplate").html() ),
    el: "#edit-catalogue",

    events : {
      'keypress #question-text': 'addNewQuestion',
      'keypress .input-panel-heading': 'updateOnEnter',
      "blur .input-panel-heading"    : "updateCatalogueOnFocusOut"
    },


    initialize: function(collection ) {
        // injected values
        this.collection = collection;
        // bindings

        var render = this.render.bind(this);
        _.bindAll(this, 'addNewQuestion');
        _.bindAll(this, 'renderQuestion');
        _.bindAll(this, 'deleteQuestion');
        _.bindAll(this, 'updateOnEnter');
        _.bindAll(this, 'updateCatalogueName');
        _.bindAll(this, 'updateCatalogueOnFocusOut');
        //

        this.render();
        //
        this.listenTo(this.collection, 'add', this.renderQuestion);
        //
        this.collection.fetch({
          reset: true,
          success : render,
          error : function(){console.error("Error")}
        });


    },

    deleteQuestion: function(item) {
         var questionId = $(item.target).parent('li').attr('id');
         console.log(this);
    },

    addNewQuestion: function(e) {
          if (e.keyCode == 13) {
              console.log(this.$questionText.val());
              var newModel = this.collection.create({question_text: this.$questionText.val()}, {wait: true});
              this.$questionText.val("");
          }
    },

    // render library by rendering each book in its collection
    render: function() {
        this.$el.html(this.template(this.collection.get_catalogue()));
        this.$questionText = $("#question-text");
        this.$listContainer = $("#question-container ul");
        this.$headingTitleInput = $('.panel-heading input.input-panel-heading');
//        this.$listContainer.jScrollPane({ autoReinitialise: true });
        this.$listContainer.html(''); // reset html
        this.collection.each(function( item ) {
            console.log(item);
            this.renderQuestion( item );
        }, this );
    },

    // render a book by creating a BookView and appending the
    // element it renders to the library's element
    renderQuestion: function( item ) {
        console.log("Create a new question : " + item);
        var questionView = new app.QuestionView({
            model: item
        });
        console.log(questionView.render().el);
        console.log(this.$listContainer);
       this.$listContainer.append( questionView.render().el );
    },

   updateOnEnter: function(e) {
      if (e.keyCode == 13) {
          this.updateCatalogueName(this.$headingTitleInput.val());
      }
   },

   updateCatalogueOnFocusOut:function(){
       this.updateCatalogueName(this.$headingTitleInput.val());
   },

   updateCatalogueName : function(updated_name) {

        if (!updated_name) {
            this.restoreCatalogueName();
            return;
        }

        if ( updated_name !== this.collection.get_catalogue().name  ) {
            var new_catalogue = {"catalogue_name": updated_name};
            console.log(new_catalogue);
            var self = this;
            $.ajax({
                url: self.collection.get_catalogue_url(),
                data: JSON.stringify(new_catalogue),
                type: 'PUT',
                contentType: 'application/json',
                dataType: "json"
            }).done(function () {
                console.log("Update catalogue name");
            }).fail(function () {
                self.restoreCatalogueName();
                console.error('failed updating catalogue name');
            });
        }
    },

    restoreCatalogueName:function() {
        this.$headingTitleInput.val(this.collection.get_catalogue().name);
    }
});


$('#create-catalogue input').keypress(function(e) {
        if(e.which == 13 && $(this).val()) {
            var catalogue = {id:9, "name": $(this).val(), "cope": "PRIVATE"};
//            $.post("/dashboard/questions/catalogue/", new_catalogue, function(catalogue){
              var list=new app.List([catalogue],{catalogue: catalogue});
                $(this).val('');
                new app.ListView(list) ;
                console.log(catalogue);
//            }, "json").fail(function(jxhr) {
//                console.log("test " + jxhr.responseText);
//            });
        }
    });

})()