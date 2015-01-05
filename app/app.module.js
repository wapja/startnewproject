(function(){
	'use strict';

angular.module('wapja', [ 'ngRoute',
													'restangular',
													'templates',
													'wapjamain'
												])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .otherwise({
                redirectTo: '/'
            });
    }]);

})();
