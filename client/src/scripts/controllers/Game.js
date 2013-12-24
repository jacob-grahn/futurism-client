angular.module('futurism')
	.controller('GameCtrl', function($scope, $routeParams, socket) {
		'use strict';

		$scope.gameId = $routeParams.gameId;
		$scope.columnCount = 4;
		$scope.rowCount = 3;
		$scope.status = {};


		socket.on('gameStatus', function(data) {
			$scope.status = data;
		});


		socket.authEmit('subscribe', $scope.gameId);
		socket.authEmit('gameStatus', $scope.gameId);


		$scope.$on('$destroy', function() {
			socket.authEmit('unsubscribe', $scope.gameId);
		});

	});