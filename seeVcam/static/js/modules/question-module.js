(function questionModule(notification) {

    var app = app || {};

    function syncSuccess(value){
        // this function is called every we sycn with the remote server
        console.log(value);
    }

    function syncError(model, response){
        var message = "Synchronization failed!";
        console.error(message);
        console.log(response.responseText);
        console.log(model);
        notification.error(message, "Re-loading the page might fix this problem.");
    }

    var Question = Backbone.Model.extend({
        defaults: {
            question_text: ""
        },

        parse: function (response) {
            response.id = response.id;
            return response;
        }
    });

    app.Questions = Backbone.Collection.extend({

        initialize: function (models, options) {
            this.catalogue = options.catalogue;
            this.url = "/dashboard/questions/catalogue/" + this.catalogue.get('id') + "/list/";

            function fetchFailure (model,response){
                var message = "Error fetching questions for " +  model.catalogue.get('catalogue_name') + "!";
                console.error(message);
                console.log(response.responseText);
                notification.error(message, "Re-loading the page might fix this problem.");
            }

            if (models.length === 0) {
                this.fetch({
                    reset: true,
                    error: fetchFailure
                });
            }
        },
        model: Question

    });

    var Catalogue = Backbone.Model.extend({
        defaults: {
            catalogue_name: 'unknown',
            catalogue_scope: 'PRIVATE',
            catalogue_size: 0
        },

        initialize: function () {

            console.log("Initializing catalogue :  " + this.get('catalogue_name') + " " + this.get('id'));
            _.bindAll(this, 'updateName');
        },

        getName: function () {
            return this.get('catalogue_name');
        },

        setQuestions:function(questions){
            this.questions = questions;
        },

        getQuestions:function(){
            return this.questions;
        },

        incrementSize:function(){
            this.set('catalogue_size', this.get('catalogue_size') +1);
            return this.catalogue_size;
        },

        decrementSize:function(){
            this.set('catalogue_size', this.get('catalogue_size') -1);
            return this.catalogue_size;
        },

        getOrCreateQuestions:function(){
            if (!this.questions)
                this.questions = new app.Questions([], {catalogue:this});
            return this.questions;
        },

        fetchQuestions:function(){
            this.questions = new app.Questions([], {catalogue:this});
            return this.questions;
        },

        updateName: function (newName) {

            if (!newName )
                throw "Invalid catalogue name";

            if ( newName === this.get('catalogue_name')) {
                return;
            }

            var self = this;
            this.save({catalogue_name: newName}, {
                success: function (response) {
                    console.log("SUCCESS : Catalogue " + self.getName() + "updated.");
                },
                error: function (response) {
                    console.error("FAILED : Catalogue " + self.getName() + " not updated");
                    console.error(response);
                    notification.warning("Update failed", "Reloading the page should fix the issue");

                }
            });
        },

        serialize: function () {
            return this.toJSON();
        }

    });

    var CatalogueList = Backbone.Collection.extend({
        model: Catalogue,
        url: "/dashboard/questions/catalogue/",

        initialize: function (catalogues) {

            function fetchFailure (model,response){
                var message = "Error fetching catalogues!";
                console.error(message);
                console.log(response.responseText);
                notification.error(message, "Re-loading the page might fix this problem.");
            }

            function lazyFetchQuestion(model){
               model.each(function(catalogue){
                  catalogue.fetchQuestions();
               });
            }

            if (!catalogues) {
                this.fetch({
                    reset: true,
                    success:lazyFetchQuestion,
                    error: fetchFailure
                });
            }
        }
    });

    app.QuestionView = Backbone.View.extend({

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

    var QuestionViewReadOnly = Backbone.View.extend({

        tagName: 'li',
        className: 'question',
        template: _.template( '<div class="question-read-only view form-group"> <p class="drag-dots"> :: </p> <p><%- question_text %></p></div>' ),
        helper_template: _.template( '<div class="question-drag-helper <%= color %>"> <p><%- question_text %></p></div>' ),

        id: function () {
         return this.model.get('id')
        },

        initialize: function () {
            _.bindAll(this, "dragHelper");
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
            this.listenTo(this.model, 'error', syncError);
            this.listenTo(this.model, 'sync', syncSuccess);

        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            this.$el.draggable({ cursor: 'move', containment: 'document', helper: this.dragHelper });
            return this;
        },

        dragHelper : function () {
            var scope = this.model.collection && this.model.collection.catalogue.get("catalogue_scope");
            var color = scope === "PRIVATE" ? "blue" : "red";
            return this.helper_template(_.extend(this.model.toJSON(), {color : color}));
        },

        deleteQuestion: function () {
            this.model.destroy();
            this.remove();
        },

        close: function () {
            this.remove();
            this.unbind();
            this.undelegateEvents();
        }

    });

    var QuestionsView = Backbone.View.extend({

        tagName : 'ul',
        className : 'question-list',
        template_no_questions : '<li class="question"><div class="question-read-only view form-group"> <p>No questions</p></div></li>',

        initialize : function(options){
            this.catalogue = options && options.catalogue;
            this.readOnly  = options && options.readOnly;
            this.collection = options.catalogue.getOrCreateQuestions();
            this.questionsViews = [];

            _.bindAll(this, 'render');
            _.bindAll(this, 'renderQuestion');
            _.bindAll(this, 'renderAllQuestions');
            _.bindAll(this, 'renderNoQuestion');

            this.listenTo(this.collection, 'add', this.renderQuestion);
            this.listenTo(this.collection, 'error', syncError);
            this.listenTo(this.collection, 'sync', this.renderAllQuestions);
            this.listenTo(this.collection, 'remove', this.renderNoQuestion);
            this.listenTo(this.collection, 'destroy', this.renderNoQuestion);

        },

        renderNoQuestion : function(){
            debugger;
            if (this.catalogue.get("catalogue_size") === 0)
                this.$el.append(this.template_no_questions);
        },

        render:function() {
            if (this.catalogue.get("catalogue_size") === 0)
                this.$el.append(this.template_no_questions);
            else
               this.renderAllQuestions();
            return this;
        },

         renderAllQuestions: function(){
            this.$el.html("");
            console.log("Questions view render entire collection");
            this.collection.each(function (item) {
                this.renderQuestion(item);
            }, this);
            console.log("Questions view render entire collection end");
            return this;
        },

        renderQuestion: function (item) {
            var questionView = null;
            if (this.readOnly){
                questionView =new QuestionViewReadOnly({ model: item });
            }else {
                questionView =new app.QuestionView({ model: item });
            }
            this.$el.append(questionView.render().el);
            this.questionsViews.push(questionView);
        }

    });

    var EditCatalogueView = Backbone.View.extend({

        template: _.template(
                '    <div class="create-interview-catalog-section" style="height:100%;">' +
                '        <div class="row" style="height:100%;margin-right:0;">' +
                '           <div class="panel" style="height:100%;position: relative;">' +
                '                <div class="panel-heading clearfix">' +
                '                    <span class="inline-block" style="width:80%">' +
                '                        <input class="input-panel-heading" style="width:100%" type="text" value="<%- catalogue_name %>">' +
                '                    </span>' +
                '                   <span class="margin-b2-t2 inline-block pull-right">' +
                '                       <span class="glyphicon input-status-icon"></span>' +
                '                       <span class="delete-panel-heading icon glyphicon glyphicon-trash"></span>' +
                '                       <span class="close-panel-heading icon glyphicon glyphicon-remove"></span>' +
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

        events: {
            'keypress #question-text': 'newQuestionFromKeyboard',
            "blur .input-panel-heading": "updateCatalogueOnFocusOut",
            "keypress .input-panel-heading": "updateOnEnter",
            "click .close-panel-heading": "close",
            "click .delete-panel-heading": "deleteCatalogue"
        },


        initialize: function (options) {
            //
            this.catalogue = options && options.catalogue;
            this.collection = this.catalogue.getOrCreateQuestions();
            this.questions = [];
            // bindings
            _.bindAll(this, 'render');
            _.bindAll(this, 'newQuestionFromKeyboard');
            _.bindAll(this, 'removeQuestion');
            _.bindAll(this, 'renderQuestion');
            _.bindAll(this, 'restoreCatalogueName');
            _.bindAll(this, 'validateCatalogueName');
            _.bindAll(this, 'updateOnEnter');
            _.bindAll(this, 'updateCatalogueName');
            _.bindAll(this, 'updateCatalogueOnFocusOut');
            _.bindAll(this, 'renderEntireCollection');
            _.bindAll(this, 'close');
            _.bindAll(this, 'deleteCatalogue');
            _.bindAll(this, 'isValidCatalogueName');
            //
            this.$noCatalogue = $('.no-catalogue');
            this.render();
            //
            this.listenTo(this.collection, 'add', this.renderQuestion);
            this.listenTo(this.collection, 'remove', this.removeQuestion);
            this.listenTo(this.collection, 'reset', this.renderEntireCollection);
            this.listenTo(this.collection, 'error', syncError);
            this.listenTo(this.collection, 'sync', syncSuccess);
            //
        },

        addNewQuestion : function( text ) {
            this.collection.create({question_text: text}, {wait: true});
            this.catalogue.incrementSize();
        },

        removeQuestion : function() {
            this.catalogue.decrementSize();
        },

        newQuestionFromKeyboard: function (e) {
            var $target = $(e.currentTarget);
            if (e.keyCode == 13 && $target.val()) {
                console.log(this.$questionText.val());
                this.addNewQuestion(this.$questionText.val());
                this.$questionText.val("");
            }
        },

        render: function () {
            console.log("Questions view render");
            this.$el.html(this.template(this.catalogue.serialize()));
            this.$questionText = $("#question-text");
            this.$listContainer = $("#question-container ul");
            this.$headingTitleInput = $('.panel-heading input.input-panel-heading');
            this.$headingTitleInput.bind('input propertychange', this.validateCatalogueName);
            this.$listContainer.html('');
            this.$statusIcon= this.$el.find(".input-status-icon");
            this.renderEntireCollection();
            this.installDroppable();
            this.$questionText.focus();
            //this.$el.find('.scroll-pane').jScrollPane({ autoReinitialise: true });
        },

        installDroppable : function() {
            var that =this;
            this.$listContainer.droppable({
                drop: _.bind(function( event, ui ) {
                    var questionText = ui.helper.find('p').html();
                    that.addNewQuestion(questionText);
                    console.log("Added question using drag and drop : " +  questionText);
                }, this)
            });
        },

        renderEntireCollection : function(){
            console.log("Questions view render entire collection");
            this.collection.each(function (item) {
                this.renderQuestion(item);
            }, this);
        },

        renderQuestion: function (item) {
            console.log("Create a new question : " + item);
            var questionView = new app.QuestionView({ model: item });
            console.log(questionView.render().el);
            console.log(this.$listContainer);
            this.$listContainer.append(questionView.render().el);
            this.questions.push(questionView);
        },

        updateOnEnter: function (e) {
            if (e.keyCode == 13) {
                this.updateCatalogueName(this.$headingTitleInput.val());
            }
        },

        updateCatalogueOnFocusOut: function () {
            this.updateCatalogueName(this.$headingTitleInput.val());
        },

        isValidCatalogueName : function (current_value) {
            return !!current_value &&  !this.catalogue.collection.findWhere({"catalogue_name": current_value});
        },

        updateCatalogueName: function (updated_name) {
            // remove focus
            this.$headingTitleInput.blur();
            // remove status icon
            this.$statusIcon
                .removeClass("glyphicon-remove-circle")
                .removeClass("glyphicon-ok-circle");

            if (!this.isValidCatalogueName(updated_name)) {
                this.restoreCatalogueName();
                return;
            }

            this.catalogue.updateName(updated_name);

        },

         validateCatalogueName: function (e) {
            var $target = $(e.currentTarget);
            var current_value = $target.val();
            console.log(current_value);

            if (!this.isValidCatalogueName(current_value)) {
                this.$statusIcon.removeClass("glyphicon-ok-circle").addClass("glyphicon-remove-circle");
                return;
            }

            this.$statusIcon.removeClass("glyphicon-remove-circle").addClass("glyphicon-ok-circle");
        },

        restoreCatalogueName: function () {
            this.$headingTitleInput.val(this.catalogue.get('catalogue_name'));
        },

        remove: function () {
            this.$el.empty();
            this.stopListening();
            return this;
        },

        close: function () {
            console.log("Closing edit mode for " + this.catalogue.getName());
            _.each(this.questions, function (question_view) {
                question_view.close();
            });
            this.remove();
            this.unbind();
            this.undelegateEvents();
            this.$el.append(this.$noCatalogue);
        },

        deleteCatalogue: function () {
            console.log("Deleting catalogue " + this.catalogue.getName());
            this.catalogue.destroy();
            this.close();
        }

    });

    var CatalogueView = Backbone.View.extend({
        className: 'catalogue-list-item',
        tagName  : 'li',
        template: _.template(
                '   <div class="container-fluid <%-catalogue_class %>">' +
                '       <div class="row catalogue-name white-text-on-hover "> ' +
                '           <a class="catalog-item-name" href="#">' +
                    '           <p> <%- catalogue_name %> </p>' +
                    '           <span class="catalog-count">(<%- catalogue_size %>)</span></a>' +
                    '<% if (catalogue_class !== "catalog-red") { %>' +
                    '           <span class="edit-icon glyphicon glyphicon-pencil"></span>' +
                    '<% } %>' +
                '       </div> '+
                '       <div class="row"> ' +
                '           <div class="question-list-container"></div> ' +
                '       </div>' +
                '   </div>'),

        events : {
            'click .catalog-item-name ' : 'showQuestions'
        },

        initialize: function () {

            _.bindAll(this, 'update');
            _.bindAll(this, 'updateSizeCatalogue');
            _.bindAll(this, 'render');
            _.bindAll(this, 'showQuestions');

            this.listenTo(this.model, 'change:catalogue_size', this.updateSizeCatalogue);
            this.listenTo(this.model, 'change:catalogue_name', this.updateCatalogueName);
            this.listenTo(this.model, 'error', syncError);
            this.listenTo(this.model, 'sync', syncSuccess);
        },

        updateCatalogueName : function(item){
            console.log("update catalogue name");
            console.log(item);
            this.$el.find(".catalogue-name p").html(this.model.get('catalogue_name'));
        },

        update: function (item) {
            console.log(item);
            console.log("update ");
            this.render();
        },

        updateSizeCatalogue: function (item) {
            console.log("update counter");
            console.log(item);
            this.$el.find(".catalog-count").html("("+this.model.get('catalogue_size') +")");
        },

        id: function () {
            return this.model.get('id')
        },

        render: function () {
            var jsonModel = this.model.toJSON();
            jsonModel.catalogue_class = 'catalog-blue';
            if (jsonModel.catalogue_scope.toLowerCase() === 'seevcam')
                jsonModel.catalogue_class = 'catalog-red';
            this.$el.html(this.template(jsonModel));
            this.$catalogueLink = this.$el.find('.catalog-item-name');
            this.$questionList = this.$el.find('.question-list-container');
            return this;
        },

        showQuestions : function(event){
            event.preventDefault();

            var isAlreadyOpened = this.$el.hasClass('opened');
            var highlightClass = this.model.get('catalogue_scope') === 'SEEVCAM' ?
                                            'highlight-catalogue-red': 'highlight-catalogue-blue';

            $('.highlight-catalogue-red, .highlight-catalogue-blue')
                .removeClass('highlight-catalogue-blue')
                .removeClass('highlight-catalogue-red');

            $('.opened').
                 removeClass('opened').
                 find(".row .question-list-container").
                 collapse('hide');

            if(!isAlreadyOpened){
                this.$catalogueLink.parent('.row').toggleClass(highlightClass);
                this.$el.addClass('opened');
                var view = new QuestionsView({catalogue:this.model, readOnly : true});
                this.$questionList.html(view.render().el);
                this.$questionList.collapse('show');
            }

        }


    });

    var CatalogueViewList = Backbone.View.extend({
        el: "#question-module",
        template: _.template(
                '<div clalss="row" style="height:100%;" > ' +
                '       <div class="col-lg-6" style="height:100%;" >' +
                '          <div id="edit-catalogue" style="height: 80%">' +
                '              <div class="no-catalogue dashed-border" style="height: 100%"></div>' +
                '         </div>' +
                '         <hr/>' +
                '         <div id="create-catalogue-block">' +
                '             <div id="create-catalogue" class="form-group has-feedback create-catalogue">' +
                '                 <input type="text" class="form-control" placeholder="Need a new category? Type its name here."/>' +
                '                  <span class="glyphicon"></span>' +
                '             </div>' +
                '         </div>' +
                '     </div>' +
                '    <div class="col-lg-6" style="height:100%;" >' +
                '       <div class="row" style="height:90%;" >' +
                '            <div class="panel" style="height:100%;" >' +
                '               <div class="catalogs-picker" style="height:100%;" >' +
                '                  <div class="catalog-labels">' +
                '                      <ul>' +
                '                          <li class="label-red">seeVcam</li>' +
                '                         <li class="label-blue">Library</li>' +
                '                    </ul>' +
                '                 </div>' +
                '                <div class="catalogs-list">' +
                '                    <ul class="scroll-pane" style="height:100%;" >' +
                '                   </ul>' +
                '              </div>' +
                '           </div>' +
                '      </div>' +
                ' </div>' +
                '</div>'
        ),

        events: {
            'keypress #create-catalogue input': 'createCatalogue',
            'click .catalogue-list-item .edit-icon':'openCatalogueOnClick',
            'click li.label-blue':'renderPrivateCatalogues',
            'click li.label-red':'renderSeevcamCatalogues'
        },

        initialize: function (collection) {
            // injected values
            this.collection = collection;
            this.openedCatalogue = null;
            this.catalogueViews = [];

            // bindings
            _.bindAll(this, 'render');
            _.bindAll(this, 'renderCatalogue');
            _.bindAll(this, 'validateCatalogueName');
            _.bindAll(this, 'renderEntireCollection');
            _.bindAll(this, 'addCatalogue');
            _.bindAll(this, 'openCatalogue');
            _.bindAll(this, 'openCatalogueOnClick');
            _.bindAll(this, 'removeCatalogue');
            _.bindAll(this, 'renderPrivateCatalogues');
            _.bindAll(this, 'renderSeevcamCatalogues');
            //
            this.listenTo(this.collection, 'add', this.addCatalogue);
            this.listenTo(this.collection, 'remove', this.removeCatalogue);
            this.listenTo(this.collection, 'reset', this.renderEntireCollection);
            this.listenTo(this.collection, 'error', syncError);
            this.listenTo(this.collection, 'sync', syncSuccess);
            this.render();
            //
        },

        renderEntireCollection: function () {
            this.$catalogueContainer.html("");
            this.collection.each(function (catalogue) {
                this.renderCatalogue(catalogue);
            }, this);
            return this;
        },

        renderPrivateCatalogues:function(){
            console.log("FFF");
            return this.renderCataloguesByScope("PRIVATE");
        },

        renderSeevcamCatalogues:function(){
            console.log("FFF");
            return this.renderCataloguesByScope("SEEVCAM");
        },

        renderCataloguesByScope:function (scope) {
            this.$catalogueContainer.html("");
            this.collection.each(function (catalogue) {
                if(catalogue.get('catalogue_scope') === scope)
                    this.renderCatalogue(catalogue);
            }, this);
            return this;
        },

        render: function () {
            this.$el.html(this.template());
            this.$catalogueContainer = this.$el.find('.catalogs-list ul');
            this.$statusIcon = this.$el.find('#create-catalogue .glyphicon');
            this.$createCatalogueBox = this.$el.find('#create-catalogue input');
            this.$createCatalogueBox.bind('input propertychange', this.validateCatalogueName);
            this.renderEntireCollection();
//            _.defer(_.bind(function(){this.$el.find('.scroll-pane').jScrollPane()}, this));
            return this;
        },

        renderCatalogue: function (catalogue) {
            this.catalogueViews[catalogue.id]= new CatalogueView({model: catalogue});
            this.$catalogueContainer.append(this.catalogueViews[catalogue.id].render().el);
            return this;
        },

        openCatalogue: function (catalogue) {
            if (this.openedCatalogue) {
                this.openedCatalogue.close();
            }
            this.openedCatalogue = new EditCatalogueView({catalogue: catalogue});
            console.log("Catalogue " + catalogue.getName() + " opened.");
        },

        openCatalogueOnClick: function(event) {
            var catalogueIdContainer =  $(event.currentTarget).parents('li');
            var catalogue = this.collection.findWhere({id : Number(catalogueIdContainer.attr('id'))});
            this.openCatalogue(catalogue);
        },

        addCatalogue: function (catalogue) {
            console.log("Catalogue " + catalogue.getName() + " added.");
            this.renderCatalogue(catalogue);
            this.openCatalogue(catalogue);
            this.cleanInputBox();
        },

        removeCatalogue: function(catalogue) {
            this.catalogueViews[catalogue.id] &&  this.catalogueViews[catalogue.id].remove();
            console.log("Catalogue " + catalogue.getName() + " removed.");
        },

        validateCatalogueName: function (e) {
            var $target = $(e.currentTarget);
            var current_value = $target.val();

            if (!current_value) {
                this.$statusIcon.removeClass("glyphicon-ok-circle").removeClass("glyphicon-remove-circle");
                return;
            }

            if (this.collection.findWhere({"catalogue_name": current_value})) {
                this.$statusIcon.removeClass("glyphicon-ok-circle").addClass("glyphicon-remove-circle");
                return;
            }

            this.$statusIcon.removeClass("glyphicon-remove-circle").addClass("glyphicon-ok-circle");
        },

        createCatalogue: function (e) {
            var $target = $(e.currentTarget);
            var current_value = $target.val();
            if (e.which == 13 && $target.val() && !this.collection.findWhere({"catalogue_name": current_value})) {
                var new_catalogue = {"catalogue_name": $target.val(), "scope": "PRIVATE"};
                this.collection.create(new_catalogue, {wait: true});
            }
        },

        cleanInputBox: function () {
            this.$createCatalogueBox.val('');
            this.$statusIcon.removeClass("glyphicon-ok-circle").removeClass("glyphicon-remove-circle");
        },

        showQuestions : function(item) {
            console.log(item);
        }

    });

    window.catalogueList = null;
    window.catalogueViewList = null;

    function installCataloguePicker() {
        catalogueList = new CatalogueList();
        catalogueViewList =  new CatalogueViewList(catalogueList);
    }

    function installQuestionModule() {
        console.log("Installing question module");

//        $('#create-catalogue input').keypress(function(e) {
//            if(e.which == 13 && $(this).val()) {
//                var new_catalogue = {"catalogue_name": $(this).val(), "scope": "PRIVATE"};
//                var self = this;
//                $.post("/dashboard/questions/catalogue/", new_catalogue, function(catalogue){
//                    if (window.openCatalogue){
//                        window.openCatalogue.close();
//                    }
//                    $(self).val('');
//                    var list=new app.List([catalogue],{catalogue: catalogue});
//                    window.openCatalogue = new app.ListView(list) ;
//                    console.log(catalogue);
//                }, "json").fail(function(jxhr) {
//                    console.log("Creation catalogue failed. Reason :" + jxhr.responseText);
//                });
//            }
//        });
        installCataloguePicker();
        console.log("Question module installed.");
    }

    window.questionCenter = {
        install: installQuestionModule
    };

})(window.notification);

