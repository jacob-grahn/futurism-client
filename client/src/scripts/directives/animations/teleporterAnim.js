angular.module('futurism')
	.directive('teleporterAnim', function(_, $, board, animFns, sound) {
		'use strict';


		return {
			restrict: 'A',
			link: function(scope, boardElem) {


				scope.$on('pre:tlpt', function(srcScope, update) {

					sound.play('teleport');

					var animTargets = animFns.chainedAnimTargets(update, update.data.targetChain);

					animFns.animNotif(boardElem, animTargets[0].center, 'How does this thing work?', '');

					_.delay(function() {

					}, 500);

				});
			}
		};
	});