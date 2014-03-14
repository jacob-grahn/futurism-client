angular.module('futurism')
	.directive('moveAnim', function($, animFns) {
		'use strict';


		return {
			restrict: 'A',
			link: function(scope, boardElem) {


				scope.$on('post:move', function(srcScope, update) {

					_.delay(function() {
						var animTargets = animFns.chainedAnimTargets(update, update.data.targetChain);
						var startPos = animTargets[0];
						var endPos = animTargets[1];

						animFns.animMove(boardElem, startPos, endPos, 1);
					});
				});

			}
		}
	});