angular.module('futurism')
	.directive('cardDisplay', function(shared, staticContentUrl, lang) {
		'use strict';

		var cardFns = shared.cardFns;

		return {
			restrict: 'E',
			replace: false,
			templateUrl: 'views/card-display.html',

			scope: {
				card: '=',
				size: '@',
				abilityFn: '&'
			},

			link: function (scope, elem, params) {
				scope.lang = lang;
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