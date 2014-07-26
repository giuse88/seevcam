'use strict';

/* Controllers */

var questionsControllers = angular.module('questions.controllers', []);

questionsControllers.controller('CatalogueListCtrl', ['$scope', 'Catalogue', function($scope, Catalogue) {
  $scope.catalogues = Catalogue.query();
    console.log($scope.catalogues);
}]);