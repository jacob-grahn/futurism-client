angular.module('futurism')
	.controller('LobbyCtrl', ['$scope', 'matchups', function($scope, matchups) {
		'use strict';

		$scope.lobbyName = 'brutus';

		matchups.subscribe();
		$scope.matchups = matchups;

		$scope.$on('$destroy', function() {
			matchups.unsubscribe();
		});
	}]);