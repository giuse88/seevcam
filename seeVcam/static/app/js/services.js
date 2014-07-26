'use strict';

/* Services */

var catalogueServices = angular.module('CatalogueService', ['ngResource']);

catalogueServices.factory('Catalogue', ['$resource',
  function($resource){
    return $resource('catalogue/seevcam/', {}, {
      query: {method:'GET', isArray:true}
    });
  }]);