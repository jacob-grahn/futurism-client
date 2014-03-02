angular.module('futurism')
	.directive('boardAnimations', function(_, $, $timeout, $rootScope, board, players) {
		'use strict';

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
					console.log('positions', updatedPositions);

					_.each(updatedPositions, function(pos) {
						var target = board.targetPos(pos);
						var elm = findTargetElm(pos);
						var effect;

						console.log('target', target);
						console.log('elm', elm);

						//appear animation
						if(!target.card) {
							effect = $('<div class="appear">');
							elm.append(effect);
						}

						//summon animation
						if(target.card) {
							effect = $('<div class="summon">');
							elm.append(effect);
						}
					});

					$timeout(function() {
						$rootScope.$broadcast('event:animationComplete');
					}, 30000);
				});
			}
		};
	});