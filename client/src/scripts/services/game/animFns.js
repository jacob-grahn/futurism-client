angular.module('futurism')
	.factory('animFns', function($, _, board) {

		var self = {

			cardWidth: 65,
			cardHeight: 93,
			halfCardWidth: Math.round(65/2),
			halfCardHeight: Math.round(93/2),


			updatedAnimTargets: function(update) {
					var animTargets = [];
					if(update.board && update.board.areas) {
						_.each(update.board.areas, function(area, index) {
							var playerId = index;
							_.each(area.targets, function(targetData, index) {
								var xy = index.split('-');
								var column = xy[0];
								var row = xy[1];

								var animTarget = self.makeAnimTarget(update, {playerId: playerId, column: column, row: row});

								animTargets.push(animTarget);
							});
						});
					}
					return animTargets;
			},



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
			},


			animNotif: function(elem, point, txt, classStr) {
				var effect = $('<div class="card-notif '+classStr+'">'+txt+'</div>');

				effect.css({left: point.x, top: point.y})
					.animate({top: point.y-100}, 'slow')
					.animate({opacity: 0}, 'slow', function() {
						this.remove();
					});

				elem.append(effect);

				return effect;
			},


			animFlasher: function(elem, point, classStr) {
				var effect = $('<div class="card-flasher '+classStr+'"><div class="card-flasher-inner"></div></div>');

				effect.css({
					left: point.x,
					top: point.y
				});

				elem.append(effect);

				// cleanup
				_.delay(function() {
					effect.remove();
				}, 2000);

				return effect;
			},


			animMove: function(elem, startPos, endPos, delayTime) {
				endPos.elem.addClass('target-hidden');

				var cloneElem = endPos.elem.find('.card-small').clone();

				cloneElem
					.css({
						position: 'absolute',
						top: startPos.offset.top,
						left: startPos.offset.left,
						'z-index': 48
					})
					.delay(delayTime)
					.animate({
						top: endPos.offset.top,
						left: endPos.offset.left
					}, 'slow', function() {
						endPos.elem.removeClass('target-hidden');
						cloneElem.remove();
					});

				elem.append(cloneElem);
			}

		};

		return self;

	});