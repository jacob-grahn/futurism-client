angular.module('futurism')
	.controller('GameSummaryCtrl', function($scope, $routeParams, SummaryResource, me, rankCalc, _) {
		'use strict';

		$scope.gameId = $routeParams.gameId;
		$scope.me = me;
		$scope.rankCalc = rankCalc;

		$scope.summ = SummaryResource.get({gameId: $scope.gameId}, function() {
			fillCards($scope.summ.users, $scope.summ.cards);
		});


		var fillCards = function(players, cards) {
			var cardDict = makeCardDict(cards);
			_.each(players, function(player) {
				_.each(player.deck.cards, function(cardId, index) {
					player.deck.cards[index] = _.clone(cardDict[cardId]);
				});
			});
		};


		var makeCardDict = function(cards) {
			var dict = {};
			_.each(cards, function(card) {
				dict[card._id] = card;
			});
			return dict;
		};
	});