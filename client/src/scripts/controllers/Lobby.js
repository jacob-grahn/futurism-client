angular.module('futurism')
	.controller('LobbyCtrl', function($scope, matchups, LobbyResource) {
		'use strict';

		$scope.matchups = matchups;


		$scope.lobbies = LobbyResource.query({}, function() {
			console.log($scope.lobbies);
			$scope.connectToLobby($scope.lobbies[0]);
		});


		$scope.connectToLobby = function(lobby) {
			$scope.lobby = lobby;
			matchups.subscribe(lobby._id);
		};


		$scope.$on('$destroy', function() {
			matchups.unsubscribe();
		});
	});