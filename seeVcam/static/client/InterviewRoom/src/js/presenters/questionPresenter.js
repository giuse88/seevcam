define(function () {
  return {
    questionIndex: function (question) {
      return question.collection.indexOf(question);
    },

    questionNumber: function (question) {
      return this.questionIndex(question) + 1;
    },

    questionUrl: function (question) {
      return '/#/interview/questions/' + question.id;
    },

    previousQuestionUrl: function (question) {
      var result = '';
      var questionIndex = this.questionIndex(question);
      if (questionIndex > 0) {
        var previousQuestion = question.collection.at(questionIndex - 1);
        result = this.questionUrl(previousQuestion);
      }

      return result;
    },

    nextQuestionUrl: function (question) {
      var result = '';
      var questionIndex = this.questionIndex(question);
      if (questionIndex < question.collection.length - 1) {
        var nextQuestion = question.collection.at(questionIndex + 1);
        result = this.questionUrl(nextQuestion);
      }

      return result;
    }
  };
});