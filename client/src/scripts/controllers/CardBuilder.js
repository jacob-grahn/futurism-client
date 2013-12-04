angular.module('futurism')
	.controller('CardBuilderCtrl', function($scope, shared, cardInProgress, dataUrlToBlob, CardResource, _) {
		'use strict';

		var factions = shared.factions;
		var cardFns = shared.cardFns;


		var objToArr = function(obj) {
			var arr = [];
			_.each(obj, function(value, abilityId) {
				if(value) {
					arr.push(abilityId);
				}
			});
			return arr;
		};


		var arrToObj = function(arr) {
			var obj = {};
			_.each(arr, function(abilityId) {
				obj[abilityId] = true;
			});
			return obj;
		};


		var updatePride = function() {
			$scope.card.pride = cardFns.calcPride($scope.card);
		};


		$scope.saveCard = function() {
			$scope.card.imageUrl = null;

			if($scope.uppedImage) {
				$scope.card.image = dataUrlToBlob($scope.uppedImage.resized.dataURL);
			}
			else {
				$scope.card.image = null;
			}

			$scope.card.$save({},
				function(value, responseHeaders) {
					console.log('I assume this is a callback', value, responseHeaders);
					$scope.uppedImage = null;
				},
				function(httpResponse) {
					console.log('There was an error', httpResponse);
				}
			);
		};


		$scope.deleteCard = function() {
			CardResource.delete({id:$scope.card.id});
			$scope.applyDefaults();
		};


		$scope.applyDefaults = function() {
			cardFns.applyDefaults($scope.card);
			$scope.abilityObj = {};
		};


		$scope.uppedImage = null;
		$scope.card = cardInProgress.card;
		$scope.factions = factions;
		$scope.abilityObj = arrToObj($scope.card.abilities);


		$scope.$watch('card.faction', function() {
			_.each($scope.abilityObj, function(value, key) {
				var abil = factions.abilityLookup[key];
				if(abil.faction !== $scope.card.faction) {
					$scope.abilityObj[key] = false;
				}
			});
		});


		$scope.$watchCollection('abilityObj', function() {
			$scope.card.abilities = objToArr($scope.abilityObj);
			updatePride();
		});


		$scope.$watchCollection('[card.attack, card.health]', updatePride);


		$scope.$watch('uppedImage', function() {
			if($scope.uppedImage) {
				console.log('uppedImage changed');
				$scope.card.imageUrl = $scope.uppedImage.resized.dataURL;
			}
		});

	});