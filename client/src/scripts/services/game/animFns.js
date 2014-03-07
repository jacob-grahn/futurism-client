angular.module('futurism')
	.factory('animFns', function($, _, board) {

		var self = {

			cardWidth: 65,
			cardHeight: 93,
			halfCardWidth: Math.round(65/2),
			halfCardHeight: Math.round(93/2),



			chainedAnimTargets: function(update, targetChain) {
				var animTargets = _.map(targetChain, function(targetPos) {
					return self.makeAnimTarget(update, targetPos);
				});
				return animTargets;
			},



			makeAnimTarget: function(update, targetPos) {
				if(_.isUndefined(targetPos.column)) {
					return null;
				}

				var target = board.targetPos(targetPos);
				var elem = self.targetElem(target);
				var boardElem = $('#board');

				var newData = null;
				if(update.board && update.board.areas && update.board.areas[targetPos.playerId]) {
					newData = update.board.areas[targetPos.playerId].targets[targetPos.column+'-'+targetPos.row];
				}

				var animTarget = {
					target: target,
					newData: newData,
					elem: elem,
					center: self.targetCenter(target, boardElem),
					offset: self.relativeOffset(elem, boardElem)
				};

				return animTarget;
			},



			targetCenter: function(target, boardElem) {
				var elem = self.targetElem(target);
				var offset = self.relativeOffset(elem, boardElem);
				offset.left += self.halfCardWidth;
				offset.top += self.halfCardHeight;
				offset.x = offset.left;
				offset.y = offset.top;
				return offset;
			},



			relativeOffset: function(elem, boardElem) {
				var elemOffset = elem.offset();
				var boardOffset = boardElem.offset();
				return({
					left: elemOffset.left - boardOffset.left,
					top: elemOffset.top - boardOffset.top
				});
			},



			targetSelector: function(pos) {
				var playerId = pos.playerId || pos.player._id;
				var selector = "." + playerId + "-" + pos.column + "-" + pos.row;
				return selector;
			},



			targetElem: function(pos) {
				var selector = self.targetSelector(pos)
				return $(selector);
			}

		};

		return self;

	});