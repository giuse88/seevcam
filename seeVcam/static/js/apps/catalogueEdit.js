(function(){

    app.Question = Backbone.Model.extend({
      defaults: {
        question  : ""
     },

    parse: function( response ) {
        response.id = response._id;
        return response;
    }
});

// List Model
app.List = Backbone.Collection.extend({
    model : app.Question,
    url : function() { return '/questions'; }

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
    },


});

// List view
app.ListView = Backbone.View.extend({
    el: '#app-container',


    events : {
      'click #add-question': 'addNewQuestion',
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
        this.$questionText = $("#question-text");
        this.$listContainer = $("#question-list");
        //
        this.listenTo(this.collection, 'add', this.renderQuestion);
        //
        this.collection.fetch({
          reset: true,
          success : render,
          error : function(){console.log("Error")}
        });
    },

    deleteQuestion: function(item) {
         var questionId = $(item.target).parent('li').attr('id');
         console.log(this);
    },

    addNewQuestion: function() {
          var newModel = this.collection.create({question: this.$questionText.val()}, {wait:true});
          this.$questionText.val("");
    },

    // render library by rendering each book in its collection
    render: function() {
        this.$listContainer.html(''); // reset html
        this.collection.each(function( item ) {
            this.renderQuestion( item );
        }, this );
    },

    // render a book by creating a BookView and appending the
    // element it renders to the library's element
    renderQuestion: function( item ) {
        var questionView = new app.QuestionView({
            model: item
        });
       this.$listContainer.append( questionView.render().el );
    }
});

})();