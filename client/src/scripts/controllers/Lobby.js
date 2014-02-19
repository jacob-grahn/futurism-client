angular.module('futurism')
	.controller('LobbyCtrl', function($scope, socket, matchups, LobbyResource) {
		'use strict';

		$scope.matchups = matchups;

		$scope.model = {
			lobby: {}
		};


		$scope.lobbies = LobbyResource.query({}, function() {
			$scope.model.lobby = $scope.lobbies[0];
		});


		$scope.$watch('model.lobby', function() {
			if($scope.model.lobby.server) {
				socket.connect($scope.model.lobby.server);
				matchups.subscribe('lobby:' + $scope.model.lobby._id);
			}
		}, true);


		$scope.$on('$destroy', function() {
			matchups.unsubscribe();
		});
	});