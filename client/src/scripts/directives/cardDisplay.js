angular.module('futurism')
	.directive('cardDisplay', function(shared, staticContentUrl) {
		'use strict';

		var cardFns = shared.cardFns;
		var factions = shared.factions;

		return {
			restrict: 'E',
			replace: false,
			templateUrl: 'views/card-display.html',

			scope: {
				card: '=',
				size: '@'
			},

			link: function (scope, elem, params) {
				scope.factions = factions;
				scope.size = scope.size || 'large';

				var card = scope.card;
				card.pride = cardFns.calcPride(card);
				if(card.hasImage) {
					var cardId = card.id || card._id || card.cardId;
					card.imageUrl = (staticContentUrl + '/images/cards/' + scope.size + '_' + cardId + '.jpg?' + card.version);
				}
			}
		};

	});