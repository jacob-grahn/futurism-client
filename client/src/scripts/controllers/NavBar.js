angular.module('futurism')
	.controller('navBarCtrl', ['$scope', 'account', function($scope, account) {
		$scope.path = '';
		$scope.account = account;

		$scope.$on('$routeChangeSuccess', function(event, current, previous) {
			if(current.$$route) {
				$scope.path = current.$$route.originalPath;
			}
			else {
				$scope.path = '/';
			}
		});
	}]);