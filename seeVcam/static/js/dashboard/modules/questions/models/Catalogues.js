define(function(require){
  var Backbone = requre("backbone");

  return  Backbone.Collection.extend({
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

});