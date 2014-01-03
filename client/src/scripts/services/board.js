angular.module('futurism')
	.factory('board', function(_) {
		'use strict';

		var self = this;
		self.areas = {};


		/**
		 * Update specific targets
		 * @param targets
		 * @param {Function} idToPlayer
		 */
		self.partialUpdate = function(targets, idToPlayer) {
			_.each(targets, function(target) {
				if(typeof target.column !== 'undefined') {
					target.player = idToPlayer(target.playerId);
					self.areas[target.playerId].targets[target.column][target.row] = target;
				}
			});
		};


		/**
		 * Apply a compressed game status from the server
		 * @param {Object} minBoard
		 * @param {Function} idToPlayer
		 */
		self.inflateStatus = function(minBoard, idToPlayer) {
			self.clear();
			self.areas = _.cloneDeep(minBoard.areas);
			_.each(self.areas, function(area, playerId) {
				area.playerId = Number(playerId);
				area.player = idToPlayer(playerId);
				area.team = area.player.team;

				_.each(area.targets, function(column, x) {
					_.each(column, function(card, y) {
						area.targets[x][y] = {
							column: x,
							row: y,
							playerId: area.playerId,
							player: area.player,
							card: card
						};
					});
				});
			});
		};


		/**
		 * Find a target containing specified cid
		 * @param {Number} cid
		 */
		self.cidToTarget = function(cid) {
			var matchTarget = null;
			var targets = self.allTargets();
			_.each(targets, function(target) {
				if(target.card && target.card.cid === cid) {
					matchTarget = target;
				}
			});
			return matchTarget;
		};


		/**
		 * Create a 1d array of all targets
		 * @returns {Array} targets
		 */
		self.allTargets = function() {
			var all = [];
			_.each(self.areas, function(area) {
				_.each(area.targets, function(column) {
					_.each(column, function(target) {
						all.push(target);
					});
				});
			});
			return all;
		};


		/**
		 * reset the board to a pristine state
		 */
		self.clear = function() {
			self.areas = [];
		};


		/**
		 *
		 */
		return self;
	});