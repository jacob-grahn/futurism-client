angular.module('futurism')
	.directive('rallyAnim', function(_, $, $timeout, board, players, animFns) {
		'use strict';


		return {
			restrict: 'A',
			link: function(scope, boardElement) {


				scope.$on('pre:rlly', function(srcScope, update) {
					_.each(update.players, function(playerData, index) {
						var player = players.list[index];
						player.prevPride = player.pride;
						player.newPride = playerData.pride;
					});
				});


				scope.$on('post:rlly', function(srcScope, update) {

					var dominantFaction = update.data.result;

					_.each(update.players, function(playerData, index) {
						var player = players.list[index];
						var targets = board.playerTargets(player._id);
						var delay = 0;

						player.pride = player.prevPride;

						targets = _.filter(targets, function(target) {
							return target.card;
						});

						_.each(targets, function(target) {
							_.delay(function() {
								var point = animFns.targetCenter(target, boardElement);

								var prideGain = 1;
								if(target.card.faction === dominantFaction) {
									prideGain = 2;
								}

								var effect = animFns.animNotif(boardElement, point, '+'+prideGain, 'rally-effect');

								effect
									.stop(true, true)
									.css({left: point.x, top: point.y, opacity: 0})
									.animate({top: point.y-100, opacity: 1});

							}, delay);
							delay += 200;
						});

						_.delay(function() {
							var allEffects = boardElement.find('.rally-effect');
							var descPosition = animFns.relativeOffset(boardElement.find('#area-desc-'+player._id), boardElement);
							allEffects.animate({
								left: descPosition.left + 10,
								top: descPosition.top - 25, 
								opacity: 0
							}, function() {
								scope.$apply(function() {
									player.pride = player.newPride;
								});
								allEffects.remove();
							});

						}, delay + 1000);
					});
				});


			}
		};
	});