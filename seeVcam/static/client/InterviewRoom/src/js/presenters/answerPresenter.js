define(function (require) {
  var _ = require('underscore');

  return {
    ratingIntervals: [
      {
        type: 'negative',
        values: _.range(1, 5),
        defaultValue: 3
      },
      {
        type: 'neuter',
        values: _.range(5, 7),
        defaultValue: 6
      },
      {
        type: 'positive',
        values: _.range(7, 11),
        defaultValue: 9
      }
    ],

    ratingType: function (answer) {
      var result;

      var rating = answer.get('rating');
      return _(this.ratingIntervals).chain()
        .filter(function (interval) {
          return _.include(interval.values, rating);
        })
        .pluck('type')
        .first()
        .value() || '';
    }
  }
});