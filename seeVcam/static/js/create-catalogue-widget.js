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
    }

});

// Question view
app.QuestionView = Backbone.View.extend({

    tagName:   'li',
    id :  function() {return this.model.get('id')} ,
    className: 'question-container',
    template: _.template( $( '#questionTemplate' ).html() ),

     events: {
        'click .delete': 'deleteQuestion'
    },

    render: function() {
        this.$el.html( this.template( this.model.toJSON() ) );
        return this;
    },

    deleteQuestion: function() {
        //Delete model
        this.model.destroy();
        //Delete view
        this.remove();
    }

});

// List view
app.ListView = Backbone.View.extend({

    template: _.template( $("#editCatalogueTemplate").html() ),
    el: "#edit-catalogue",

    events : {
      'click #add-question': 'addNewQuestion'
    },


    initialize: function(collection ) {
        // injected values
        this.collection = collection;
        // bindings

        var render = this.render.bind(this);
        _.bindAll(this, 'addNewQuestion');
        _.bindAll(this, 'renderQuestion');
        _.bindAll(this, 'deleteQuestion');
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

    addNewQuestion: function() {
          console.log(this.$questionText.val());
          var newModel = this.collection.create({question_text: this.$questionText.val()}, {wait:true});
          this.$questionText.val("");
    },

    // render library by rendering each book in its collection
    render: function() {
        this.$el.html(this.template(this.collection.get_catalogue()));
        this.$questionText = $("#question-text");
        this.$listContainer = $("#question-container ul");
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
    }
});


// List view
var WidgetView = Backbone.View.extend({

    template: _.template( $("#editCatalogueTemplate").html() ),
    el: "#edit-catalogue",

    initialize : function (options) {
        this.catalogue = options.catalogue;
        this.render();
    },

    render : function() {

        this.$el.html(this.template(this.catalogue))
    }

});



    $('#create-catalogue input').keypress(function(e) {
        if(e.which == 13 && $(this).val()) {
            var new_catalogue = {"catalogue_name": $(this).val(), "catalogue_scope": "PRIVATE"};
       //     $.post("/dashboard/questions/catalogue/", new_catalogue, function(catalogue){
                //error checking
                var catalogue = {id: 9, scope: "PRIVATE", name: $(this).val()};
              var list=new app.List([catalogue],{catalogue: catalogue});
                console.log(list);
                $(this).val('');
                new app.ListView(list) ;
//                console.log(catalogue);
//                var list = )
//           })
        }
    });


})()