angular.module('futurism')
	.directive('vagabondAnim', function(_, $, board, players, animFns) {
		'use strict';


		return {
			restrict: 'A',
			link: function(scope, boardElement) {


				scope.$on('pre:vgbn', function(srcScope, update) {

					var targetChain = update.data;
					var target = board.targetPos(targetChain[0]);
					var player = target.player;


					var targets = board.playerTargets(player._id);
					var delay = 0;

					targets = _.filter(targets, function(target) {
						return target.card && target.card.abilities.indexOf('move') === -1;
					});

					_.each(targets, function(target) {
						_.delay(function() {
							var point = animFns.targetCenter(target, boardElement);
							var effect = $('<div class="rally-effect">+move</div>');
							effect.css({left: point.x, top: point.y, opacity: 0});
							effect.animate({top: point.y-100, opacity: 1});
							boardElement.append(effect);
						}, delay);
						delay += 333;
					});

					_.delay(function() {
						var allEffects = boardElement.find('.rally-effect');
						allEffects.animate({opacity: 0}, function() {
							allEffects.remove();
						});
					}, delay + 1000);
				});

			}
		};
	});