define(function (require) {
  return {
    ratingType: function (answer) {
      var result;

      var rating = answer.get('rating');
      if (rating === null || rating === undefined) {
        result = '';
      } else if (rating < 4) {
        result = 'negative';
      } else if (rating < 8) {
        result = 'neuter';
      } else {
        result = 'positive';
      }

      return result;
    }
  }
});