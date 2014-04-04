angular.module('futurism')
	.directive('seductionAnim', function($, animFns, sound) {
		'use strict';


		return {
			restrict: 'A',
			link: function(scope, boardElem) {


				scope.$on('post:sduc', function(srcScope, update) {

					_.delay(function() {

						sound.play('seduce');

						var animTargets = animFns.chainedAnimTargets(update, update.data.targetChain);
						var src = animTargets[0];
						var target = animTargets[1];
						var dest = animTargets[2];

						animFns.animMove(boardElem, target, dest, 2000);

						animFns.animNotif(boardElem, src.center, '-1 health', 'danger');

						_.delay(function() {

							animFns.animFlasher(boardElem, src.center, 'seduction');

							_.delay(function() {
								animFns.animFlasher(boardElem, target.center, 'seduction');
							}, 500);

						}, 500);

					});

				});
			}
		}
	});