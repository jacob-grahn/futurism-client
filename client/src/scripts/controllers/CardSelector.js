angular.module('futurism')
	.controller('CardSelectorCtrl', function($scope, $location, $routeParams, CardResource, UserResource, cardInProgress, me, shared) {
		'use strict';

		var groups = shared.groups;

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

		$scope.reportCard = function(card) {
			var r = CardResource.save({userId: card.userId, cardId: card._id, action: 'report'}, function() {
				// say the report worked
			});
			return r.$promise;
		};

		$scope.deleteCard = function(card) {
			var r = CardResource.delete({userId: card.userId, cardId: card._id}, function() {
				_.pull($scope.cards, card);
			});
			return r.$promise;
		};

		$scope.canReport = function(card) {
			if(me.user.group === groups.APPRENTICE || me.user.group === groups.MOD || me.user.group === groups.ADMIN) {
				return true;
			}
		};

		$scope.canDelete = function(card) {
			if(card.userId === me.user._id) {
				return true;
			}
			if(me.user.group === groups.MOD || me.user.group === groups.ADMIN) {
				return true;
			}
		};

	});