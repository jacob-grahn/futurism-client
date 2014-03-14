angular.module('futurism')
	.directive('teleporterAnim', function(_, $, board, animFns) {
		'use strict';


		return {
			restrict: 'A',
			link: function(scope, boardElem) {


				scope.$on('pre:tlpt', function(srcScope, update) {

					var animTarget = animFns.chainedAnimTargets(update, update.data.targetChain)[0];

					animFns.animNotif(boardElem, animTarget.center, 'Who wants to teleport somewhere?', '');

					var player = animTarget.target.player;
					var targets = board.playerTargets(player._id);
					targets = _.filter(targets, function(target) {
						return target.card && target.card.abilities.indexOf('move') === -1;
					});
					_.delay(function() {
						giveMove(targets);
					}, 1500);
				});



				var giveMove = function(targets) {

					var delay = 0;

					_.each(targets, function(target) {
						_.delay(function() {
							var point = animFns.targetCenter(target, boardElem);
							animFns.animNotif(boardElem, point, '+move', '');
						}, delay);
						delay += 333;
					});
				};

			}
		};
	});