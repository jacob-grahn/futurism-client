angular.module('futurism')
	.factory('animFns', function($, _, board) {

		var self = {

			cardWidth: 65,
			cardHeight: 93,
			halfCardWidth: Math.round(65/2),
			halfCardHeight: Math.round(93/2),


			getUpdatedTargets: function(update) {
				var targets = [];
				if(update.board && update.board.areas) {
					_.each(update.board.areas, function(area, index) {
						var playerId = index;
						_.each(area.targets, function(targetData, index) {
							var xy = index.split('-');
							var column = xy[0];
							var row = xy[1];

							var updatingTarget = self.getUpdatedTarget(update, {playerId: playerId, column: column, row: row});

							targets.push(updatingTarget);
						});
					});
				}
				return targets;
			},



			getUpdatedTarget: function(update, targetPos) {
				var target = board.targetPos(targetPos);
				var elem = self.findTargetElem(target);
				console.log('getUpdatedTarget', update, targetPos);

				var newData = null;
				if(update.board && update.board.areas && update.board.areas[targetPos.playerId]) {
					newData = update.board.areas[targetPos.playerId].targets[targetPos.column+'-'+targetPos.row];
				}
				console.log('newData', newData);

				var updatingTarget = {target: target, newData: newData, elem: elem};
				return updatingTarget;
			},



			getTargetPoint: function(target, boardElement) {
				var elem = self.findTargetElem(target);
				var offset = elem.offset();
				var selfOffset = boardElement.offset();
				var point = {
					x: offset.left - selfOffset.left + self.halfCardWidth,
					y: offset.top - selfOffset.top + self.halfCardHeight
				};
				return point;
			},



			relativeOffset: function(elem, boardElem) {
				var elemOffset = elem.offset();
				var boardOffset = boardElem.offset();
				return({
					left: elemOffset.left - boardOffset.left,
					top: elemOffset.top - boardOffset.top
				});
			},



			findTargetElem: function(pos) {
				var playerId = pos.playerId || pos.player._id;
				var selector = "." + playerId + "-" + pos.column + "-" + pos.row;
				return $(selector);
			}

		};

		return self;

	});