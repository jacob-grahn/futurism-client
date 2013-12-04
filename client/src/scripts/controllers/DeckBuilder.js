angular.module('futurism')
	.controller('DeckBuilderCtrl', ['$scope', 'CardResource', 'DeckResource', 'deckInProgress', 'shared', 'lodash',
	function($scope, CardResource, DeckResource, deckInProgress, shared, _) {
		'use strict';

		var deck = deckInProgress.deck;
		$scope.deck = deck;
		$scope.cards = CardResource.query({canon:true}, function() {});
		$scope.deckFns = shared.deckFns;


		$scope.save = function() {
			var cardIds = [];
			_.each(deck.cards, function(card) {
				cardIds.push(card._id);
			});

			var params = {
				name: deck.name,
				cards: cardIds,
				pride: shared.deckFns.calcPride(deck)
			};
			
			DeckResource.save(params);
		};


		$scope.addCard = function(card) {
			deck.cards.push(angular.copy(card));
			$scope.sortDeck();
		};


		$scope.removeCard = function(card) {
			var index = deck.cards.indexOf(card);
			if(index !== -1) {
				deck.cards.splice(index, 1);
			}
			$scope.sortDeck();
		};


		$scope.sortDeck = function() {
			deck.cards.sort(function(a, b) {

				//sort pride descending
				if(a.pride !== b.pride) {
					return b.pride - a.pride;
				}
				else {

					//sort name descending
					var nameA = a.name.toLowerCase();
					var nameB = b.name.toLowerCase();
					if (nameA < nameB) {
						return -1;
					}
					if (nameA > nameB) {
						return 1;
					}

					//default return value (no sorting)
					return 0;
				}
			});
		};
	}]);