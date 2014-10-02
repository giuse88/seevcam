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
    },

    set_catalogue_name:function(new_name) {
       this.catalogue.name = new_name;
    }

});

// Question view
app.QuestionView = Backbone.View.extend({

    tagName:   'li',
    id :  function() {return this.model.get('id')} ,
    className: 'question',
    template: _.template(
        '<div class="view form-group"> <p><%- question_text %></p> ' +
        '<a class="delete"> <span class="hidden glyphicon glyphicon-trash"></span> </a>' +
        '</div> ' +
        '<input class="edit form-control" type="text" value="<%- question_text %>" /> '
    ),

     events: {
        "click .delete": 'deleteQuestion',
        "keypress .edit"  : "updateOnEnter",
        "blur .edit"      : "closeEditing",
        "click .view"  : "edit"
    },

    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
    },

    render: function() {
        this.$el.html( this.template( this.model.toJSON() ) );
        this.$input = this.$('.edit');
        this.$el.hover(function(){
            $(this).find(".glyphicon").removeClass("hidden");
        }, function() {
            $(this).find(".glyphicon").addClass("hidden");
        });
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
    closeEditing: function() {
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
    },


    close: function(){
      this.remove();
      this.unbind();
      this.undelegateEvents();
    }


});

// List view
app.ListView = Backbone.View.extend({

    template: _.template(
    '    <div class="create-interview-catalog-section" style="height:100%;">' +
    '        <div class="row" style="height:100%;margin-right:0;">' +
    '           <div class="panel" style="height:100%;position: relative;">' +
    '                <div class="panel-heading clearfix">' +
    '                    <span class="inline-block" style="width:90%">' +
    '                        <input class="input-panel-heading" style="width:100%" type="text" value="<%- catalogue_name %>">' +
    '                    </span>' +
    '                   <span class="margin-b2-t2 inline-block pull-right">' +
    '                       <span class="hidden delete-panel-heading icon glyphicon glyphicon-trash"></span>' +
    '                       <span class="hidden close-panel-heading icon glyphicon glyphicon-remove"></span>' +
    '                    </span>' +
    '                </div>' +
    '                <div id="question-container" class="">' +
    '                    <ul class="scroll-pane"></ul>' +
    '                </div>' +
    '                <div id="enter-new-question" class="">' +
    '                    <input id="question-text" class="form-control" type="text" placeholder="Enter a new question"/>' +
    '                </div>' +
    '            </div>' +
    '        </div>' +
    '    </div>'
    ),
    el: "#edit-catalogue",

    events : {
      'keypress #question-text': 'addNewQuestion',
      "blur .input-panel-heading"    : "updateCatalogueOnFocusOut",
      "click .close-panel-heading" : "close",
      "click .delete-panel-heading" : "deleteCatalogue"
    },


    initialize: function(collection ) {
        // injected values
        this.collection = collection;
        this.questions = [];

        // bindings
        var render = this.render.bind(this);
        _.bindAll(this, 'addNewQuestion');
        _.bindAll(this, 'renderQuestion');
        _.bindAll(this, 'deleteQuestion');
        _.bindAll(this, 'updateOnEnter');
        _.bindAll(this, 'updateCatalogueName');
        _.bindAll(this, 'updateCatalogueOnFocusOut');
        _.bindAll(this, 'close');
        _.bindAll(this, 'deleteCatalogue');
        //
        // saving previous view
        this.$noCatalogue=$('.no-catalogue');
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
        this.$listContainer.html('');
        this.$el.find(".panel-heading").hover(function(){
            $(this).find(".icon").removeClass("hidden");
        }, function() {
            $(this).find(".icon").addClass("hidden");
        });
        this.collection.each(function( item ) {
            console.log(item);
            this.renderQuestion( item );
        }, this );
        //this.$el.find('.scroll-pane').jScrollPane({ autoReinitialise: true });
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
        this.questions.push(questionView);
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
                self.collection.set_catalogue_name(updated_name);
            }).fail(function () {
                self.restoreCatalogueName();
                console.error('failed updating catalogue name');
            });
        }
    },

    restoreCatalogueName:function() {
        this.$headingTitleInput.val(this.collection.get_catalogue().name);
    },

   remove : function() {
       this.$el.empty();
       this.stopListening();
       return this;
   },

   close: function(){
       console.log("closing view")
       _.each(this.questions, function(question_view){
               question_view.close();
       });
       this.remove();
       this.unbind();
       this.undelegateEvents();
       console.log(this.$noCatalogue);
       this.$el.append(this.$noCatalogue);
    },

   deleteCatalogue : function() {
       var self=this;
       console.log("deleting catalogue");
       $.ajax({
           url: this.collection.get_catalogue_url(),
           type: 'DELETE',
           contentType: 'application/json',
           dataType: "json"
       }).done(function () {
           console.log("deleted catalogue");
           self.close() ;
       }).fail(function () {
            console.error('failed deleting catalogue');
       });
    }

});


    var Catalogue = Backbone.Model.extend({
       defaults: {
           name: 'unknown',
           id: 'unknown',
           scope: 'PRIVATE',
           size : 0
       }
    });

    var CatalogueList = Backbone.Collection.extend({
       model: Catalogue
    });

    var CatalogueView = Backbone.View.extend({
        className: 'catalogue',
        template: _.template(
            '<li id="{{ id }}"  class="catalog-list-item <%- scope %> <%-catalogue_class %>">' +
            '   <div class="container-fluid">' +
            '       <div class="row"> ' +
            '           <a class="catalog-item-name" href="#"> <%- name %>' +
                        '<span class="catalog-count">(<%- size %>)</span></a>' +
            '       </div>' +
            '   </div>' +
            '</li>'),

        id :  function() {
            return this.model.get('id')
        },

        render: function() {
            var jsonModel = this.model.toJSON();
            jsonModel.catalogue_class = 'catalog-blue';
            if ( jsonModel.scope.toLowerCase() === 'seevcam' )
                jsonModel.catalogue_class = 'catalog-red';
            this.$el.html( this.template(jsonModel) );
            return this;
        }

    });

    var CatalogueViewList = Backbone.View.extend({
        el : '.catalogs-list',


        initialize: function(collection ) {
            // injected values
            this.collection = collection;
            this.questions = [];

            // bindings
            var render = this.render.bind(this);
            _.bindAll(this, 'renderCatalogue');

            //
            this.$catalogueContainer = this.$el.find('ul');
            console.log(this.$el);
            // saving previous view
            this.render();
            //

        },

        render : function() {
            this.collection.each(function(catalogue){
                this.renderCatalogue(catalogue);
            }, this);
        },

       renderCatalogue: function( item ) {
           var catalogueView = new CatalogueView({model:item});
//           console.log(_.template(this.catalogue_template, item.toJSON()));
           this.$catalogueContainer.append(catalogueView.render().el);
       }

    });

    function installCataloguePicker() {
           new CatalogueViewList(new CatalogueList(
              [{name:'catalogue_1', id:'9', scope:'PRIVATE', size: 0}]
           ));
    }

    function installQuestionModule() {
        console.log("Installing question module");

        $('#create-catalogue input').keypress(function(e) {
            if(e.which == 13 && $(this).val()) {
                var new_catalogue = {"catalogue_name": $(this).val(), "scope": "PRIVATE"};
                var self = this;
                $.post("/dashboard/questions/catalogue/", new_catalogue, function(catalogue){
                    if (window.openCatalogue){
                        window.openCatalogue.close();
                    }
                    $(self).val('');
                    var list=new app.List([catalogue],{catalogue: catalogue});
                    window.openCatalogue = new app.ListView(list) ;
                    console.log(catalogue);
                }, "json").fail(function(jxhr) {
                    console.log("Creation catalogue failed. Reason :" + jxhr.responseText);
                });
            }
        });
        installCataloguePicker();
        console.log("Question module installed.");
    }

    window.questionCenter = {
        install : installQuestionModule
    };

})();

