define(['baseView', 'text!templates/candidate-info.html'], function (BaseView, template) {
  return BaseView.extend({
    template: template,

    getRenderContext: function () {
      return {
        candidate: this.model.get('candidate'),
        jobPosition: this.model.get('jobPosition'),
        interview: this.model.get('interview'),
        model: this.model,
        view: this
      };
    }
  });
});