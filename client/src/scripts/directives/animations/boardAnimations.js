angular.module('futurism')
	.directive('boardAnimations', function(_, $, $timeout, $rootScope, board, players) {
		'use strict';

		var cardWidth = 65;
		var cardHeight = 93;
		var halfCardWidth = Math.round(cardWidth/2);
		var halfCardHeight = Math.round(cardHeight/2);


		var parseUpdatePositions = function(update) {
			var positions = [];
			_.each(update.board.areas, function(area, index) {
				var playerId = index;
				_.each(area.targets, function(target, index) {
					var xy = index.split('-');
					positions.push({playerId: playerId, column: xy[0], row: xy[1], card: target});
				});
			});
			return positions;
		};


		var findTargetElm = function(pos) {
			var playerId = pos.playerId || pos.player._id;
			var selector = "." + playerId + "-" + pos.column + "-" + pos.row;
			return $(selector);
		};


		return {
			restrict: 'A',
			link: function(scope, element) {



				/**
				 * summon animation
				 */
				scope.$on('event:smmn', function(srcScope, update) {

					var updatedPositions = parseUpdatePositions(update);
					var effect, srcPoint, destPoint;

					_.each(updatedPositions, function(pos) {
						var target = board.targetPos(pos);
						var elm = findTargetElm(pos);
						var offset = elm.offset();
						var selfOffset = element.offset();
						var point = {
							x: offset.left - selfOffset.left + halfCardWidth,
							y: offset.top - selfOffset.top + halfCardHeight
						};

						if(!target.card) {
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
					element.append(effect);

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
					$rootScope.$broadcast('event:animationComplete');
				});



			}
		};
	});