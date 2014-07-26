'use strict';

// Declare app level module which depends on filters, and services
angular.module('questions', [
    'ngResource',
    'CatalogueService',
    'questions.controllers'
]).
config(['$interpolateProvider', function($interpolateProvider ) {
           $interpolateProvider.startSymbol('{[');
           $interpolateProvider.endSymbol(']}');
}]);


