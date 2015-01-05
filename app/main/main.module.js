(function(){
  'use strict';

  angular.module('wapjamain',['ngRoute'])
    .config(function($routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'main/main.html',
          controller: 'MainController',
          controllerAs: 'main',
        });
    })

})();
