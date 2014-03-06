angular.module('futurism')
	.directive('rallyAnim', function(_, $, $rootScope, board, players, animFns) {
		'use strict';


		return {
			restrict: 'A',
			link: function(scope, boardElement) {


				scope.$on('event:rlly', function(srcScope, update) {

					var dominantFaction = update.data;

					_.each(update.players, function(playerData, index) {
						var player = players.list[index];
						var targets = board.playerTargets(player._id);
						var delay = 0;

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
								var effect = $('<div class="rally-effect">+' + prideGain + '</div>');
								effect.css({left: point.x, top: point.y, opacity: 0});
								effect.animate({top: point.y-100, opacity: 1});
								boardElement.append(effect);
							}, delay);
							delay += 333;
						});

						_.delay(function() {
							var allEffects = boardElement.find('.rally-effect');
							var descPosition = animFns.relativeOffset(boardElement.find('#area-desc-'+player._id), boardElement);
							allEffects.animate({left: descPosition.left + 10, top: descPosition.top - 25, opacity: 0}, {complete: function() {
								$rootScope.$apply(function() {
									$rootScope.$broadcast('event:animationComplete');
								});
								allEffects.remove();
							}});

						}, delay + 1000);
					});
				});


			}
		};
	});