define(function(require) {

  require("redactor");
  var BaseView = require('baseView');
  var AutoSaveBehavior = require('behaviors/autosaveBehavior');

  return BaseView.extend({
    className: "editor",
    template: require('text!./templates/text-area.html'),

    bindings: {},

    setUp : function () {
     this.bindings["#"+ this.cid] = {
       observe: "content",
       events: ['change']
     };
    },

    initBehaviors: function () {
      this.attachBehavior(new AutoSaveBehavior({ignore: ['id']}));
    },

    postRender: function () {
      var note = this.model;
      this.$el.find("textarea").redactor({
        buttons : ['html', 'formatting', 'bold', 'italic', 'deleted', 'unorderedlist',
                    'orderedlist', 'outdent', 'indent','alignment', 'horizontalrule'],
        changeCallback: function() {
          note.set("content", this.code.get());
        }
      });
    },

    getRenderContext: function () {
      return {
        placeholder : "Use this area to take your notes during the interview",
        view : this
      }
    }

  });
});