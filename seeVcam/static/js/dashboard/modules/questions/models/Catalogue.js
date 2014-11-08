define(function(require){

  var Backbone = require("backbone");

  return  Backbone.Model.extend({
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

});
