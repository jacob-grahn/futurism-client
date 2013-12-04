angular.module('futurism')
	.controller('GameCtrl', ['$scope','$routeParams', function($scope, $routeParams) {
		'use strict';

		$scope.gameId = $routeParams.gameId;
		$scope.columnCount = 4;
		$scope.rowCount = 3;

		$scope.players = [
			{
				name: 'me',
				team: 0,
				friend: true,
				columns: [
					[{}, {}, {}],
					[{}, {}, {}],
					[{}, {}, {}],
					[{}, {}, {}]
				]
			},
			{
				name: 'you',
				team: 1,
				friend: false,
				columns: [
					[{card:true}, {card:true}, {card:true}],
					[{}, {}, {}],
					[{card:true}, {card:true}, {}],
					[{card:true}, {}, {}]
				]
			}
		];

	}]);