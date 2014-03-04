angular.module('futurism')
	.directive('boardAnimations', function(_, $, $timeout, $rootScope, board, players) {
		'use strict';

		var cardWidth = 65;
		var cardHeight = 93;
		var halfCardWidth = Math.round(cardWidth/2);
		var halfCardHeight = Math.round(cardHeight/2);


		var getUpdatedTargets = function(update) {
			var targets = [];
			if(update.board && update.board.areas) {
				_.each(update.board.areas, function(area, index) {
					var playerId = index;
					_.each(area.targets, function(targetData, index) {
						var xy = index.split('-');
						var column = xy[0];
						var row = xy[1];

						var target = board.target(playerId, column, row);
						var elem = findTargetElem(target);

						var updatingTarget = {target: target, newData: targetData, elem: elem};

						targets.push(updatingTarget);
					});
				});
			}
			return targets;
		};


		var getTargetPoint = function(target, boardElement) {
			var elem = findTargetElem(target);
			var offset = elem.offset();
			var selfOffset = boardElement.offset();
			var point = {
				x: offset.left - selfOffset.left + halfCardWidth,
				y: offset.top - selfOffset.top + halfCardHeight
			};
			return point;
		};


		var relativeOffset = function(elem, boardElem) {
			var elemOffset = elem.offset();
			var boardOffset = boardElem.offset();
			return({
				left: elemOffset.left - boardOffset.left,
				top: elemOffset.top - boardOffset.top
			});
		};


		var findTargetElem = function(pos) {
			var playerId = pos.playerId || pos.player._id;
			var selector = "." + playerId + "-" + pos.column + "-" + pos.row;
			return $(selector);
		};


		return {
			restrict: 'A',
			link: function(scope, boardElement) {


				/**
				 * summon animation
				 */
				scope.$on('event:smmn', function(srcScope, update) {

					var updatingTargets = getUpdatedTargets(update);
					var effect;
					var srcPoint;
					var destPoint = {x: 0, y: 0};

					_.each(updatingTargets, function(updatingTarget) {
						var point = getTargetPoint(updatingTarget.target, boardElement);
						if(!updatingTarget.target.card) {
							destPoint = point;
						}
						else {
							srcPoint = point;
						}
					});

					if(!srcPoint) {
						srcPoint = destPoint;
					}

					effect = $('<div class="summon-effect"><div class="effect"></div><div class="effect"></div></div>');
					effect.css({left: srcPoint.x, top: srcPoint.y});
					effect.animate({left: destPoint.x, top: destPoint.y});
					boardElement.append(effect);

					$timeout(function() {
						$rootScope.$broadcast('event:animationComplete');
					}, 1000);

					$timeout(function() {
						effect.remove();
					}, 2000);
				});



				/**
				 * rally animation
				 */
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
								var point = getTargetPoint(target, boardElement);
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
							var descPosition = relativeOffset(boardElement.find('#area-desc-'+player._id), boardElement);
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