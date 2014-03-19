angular.module('futurism')
	.directive('sacrificeAnim', function($, animFns, shared) {
		'use strict';


		return {
			restrict: 'A',
			link: function(scope, boardElem) {


				scope.$on('post:'+shared.actions.HERO, function(srcScope, update) {

					var src = animFns.chainedAnimTargets(update, update.data.targetChain)[0];
					animFns.animFlasher(boardElem, src.center, 'hero');
				});
			}
		}
	});