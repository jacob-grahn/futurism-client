angular.module('futurism')
	.controller('CardSelectorCtrl', ['$scope', '$location', 'CardResource', 'cardInProgress', function($scope, $location, CardResource, cardInProgress) {
		'use strict';

		$scope.cards = CardResource.query(function() {});


		$scope.selectCard = function(card) {
			cardInProgress.card = card;
			$location.url('/card-builder');
		};

	}]);