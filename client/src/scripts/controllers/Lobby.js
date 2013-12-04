angular.module('futurism')
	.controller('LobbyCtrl', function($scope, matchups) {
		'use strict';

		$scope.lobbyName = 'brutus';

		matchups.subscribe();
		$scope.matchups = matchups;

		$scope.$on('$destroy', function() {
			matchups.unsubscribe();
		});
	});