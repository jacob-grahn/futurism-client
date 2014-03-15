angular.module('futurism')
	.directive('shieldAnim', function($, animFns) {
		'use strict';


		return {
			restrict: 'A',
			link: function(scope, boardElem) {

				scope.$on('post:shld', function(srcScope, update) {

					var animTarget = animFns.chainedAnimTargets(update, update.data.targetChain)[0];
					animFns.animFlasher(boardElem, animTarget.center, 'shield');

				});
			}
		}
	});