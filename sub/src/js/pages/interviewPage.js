define(['baseView', 'text!templates/interview-page.html', 'views/candidateInfoView'], function (BaseView, template, CandidateInfoView) {
  return BaseView.extend({
    template: template,

    setUp: function () {
      this.hasSubView('.candidate-details-container', new CandidateInfoView());
    }
  });
});