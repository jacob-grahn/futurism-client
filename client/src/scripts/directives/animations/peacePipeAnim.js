angular.module('futurism')
	.directive('peacePipeAnim', function($, animFns) {
		'use strict';


		return {
			restrict: 'A',
			link: function(scope, boardElem) {


				scope.$on('post:peap', function(srcScope, update) {

					var animTargets = animFns.chainedAnimTargets(update, update.data.targetChain);
					var src = animTargets[0];
					var target = animTargets[1];

					animFns.animFlasher(boardElem, src.center, 'peace-pipe');
					_.delay(function() {
						animFns.animFlasher(boardElem, target.center, 'peace-pipe');
					}, 500);

				});
			}
		}
	});