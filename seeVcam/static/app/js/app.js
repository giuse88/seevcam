'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers'
]).
config(['$routeProvider', '$locationProvider',  function($routeProvider, $locationProvider) {
           $routeProvider.when('questions', {templateUrl: '/dashboard/questions', controller: 'questions'});
           $routeProvider.otherwise({redirectTo: 'questions'});
//           $locationProvider.html5Mode(true);
}]);
