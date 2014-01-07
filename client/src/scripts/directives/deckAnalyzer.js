angular.module('futurism')
	.directive('deckAnalyzer', function(shared, lang) {
		'use strict';

		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'views/deck-analyzer.html',

			scope: {
				deck: '='
			},

			link: function (scope) {

				scope.lang = lang;

				var updateDesc = function() {
					scope.desc = shared.deckFns.analyze(scope.deck);
				};
				updateDesc();

				scope.$watchCollection('deck.cards', updateDesc);
			}
		}
	});