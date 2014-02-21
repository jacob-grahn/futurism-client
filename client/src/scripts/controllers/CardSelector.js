angular.module('futurism')
	.controller('CardSelectorCtrl', function($scope, $location, $routeParams, CardResource, UserResource, cardInProgress, me) {
		'use strict';

		$scope.userId = $routeParams.userId;
		$scope.user = UserResource.get({userId: $scope.userId});

		$scope.CardResource = CardResource;
		$scope.query = {userId: $scope.userId};
		$scope.cards = [];

		$scope.selectCard = function(card) {
			if($scope.userId === me.user._id) {
				cardInProgress.card = card;
				$location.url('/card-builder');
			}
		};

	});