angular.module('futurism')
	.directive('deckDisplay', ['staticContentUrl', 'shared', function(staticContentUrl, shared) {
		'use strict';

		return {
			restrict: 'E',
			replace: true,

			template:
				'<div class="deck deck-{{size}}">' +
					'<div class="deck-image-holder">' +
					'<div class="deck-image-1"><img ng-src="{{displayUrls[0]}}"/></div>' +
					'<div class="deck-image-2"><img ng-src="{{displayUrls[1]}}"/></div>' +
					'<div class="deck-image-3"><img ng-src="{{displayUrls[2]}}"/></div>' +
					'</div>' +
					'<h1 class="deck-name">{{deck.name}}</h1>' +
					'<h1 class="deck-pride">pride: {{deck.pride}}</h1>' +
				'</div>',

			link: function (scope, elem, attrs) {
				scope.size = attrs.size || 'large';

				var deck = scope.deck;
				var cards = deck.cards;
				var displayIds = [];

				displayIds[0] = cards[0];
				displayIds[1] = cards[Math.round((cards.length-1)/2)];
				displayIds[2] = cards[cards.length-1];

				scope.displayUrls = _.map(displayIds, function(card) {
					var cardId;
					if(typeof card === 'string') {
						cardId = card;
					}
					else {
						cardId = card._id;
					}
					return staticContentUrl + '/images/cards/' + scope.size + '_' + cardId + '.jpg'
				});
			}
		}

	}]);