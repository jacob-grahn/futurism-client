angular.module('futurism')
	.directive('cardDisplay', ['shared', 'staticContentUrl', function(shared, staticContentUrl) {
		'use strict';

		var cardFns = shared.cardFns;
		var factions = shared.factions;

		return {
			restrict: 'A',
			replace: true,
			template:
				'<div class="card card-{{size}} card-{{card.faction}}">' +
					'<div class="card-image-holder">' +
						'<img class="card-image absolute-center" ng-src="{{card.imageUrl}}"/>' +
					'</div>' +
					'<h1>{{card.name}}</h1>' +
					'<ul class="abilities">' +
						'<li ng-repeat="abilityId in card.abilities">- {{factions.abilityLookup[abilityId].name}} -</li>' +
					'</ul>' +
					'<div class="card-story">{{card.story}}</div>' +
					'<div class="card-stats">{{card.attack}}/{{card.health}}</div>' +
					'<div class="card-pride">{{card.pride}}</div>' +
				'</div>',

			link: function (scope, elem, attrs) {
				scope.factions = factions;
				scope.size = attrs.size || 'large';

				var card = scope.card;
				card.pride = cardFns.calcPride(card);
				if(card.hasImage) {
					var cardId = card.id || card._id || card.cardId;
					card.imageUrl = (staticContentUrl + '/images/cards/' + scope.size + '_' + cardId + '.jpg?' + card.version);
				}
			}
		};

	}]);