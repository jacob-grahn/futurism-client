(function() {
	'use strict';


	/**
	 * import
	 */
	var _;
	if(typeof require !== 'undefined') {
		_ = require('lodash');
	}
	else {
		_ = window._;
	}


	/**
	 *
	 * @constructor
	 */
	var Board = function(players, columns, rows) {

		var self = {};
		self.areas = {};


		/**
		 * Create a 2d array filled with target objects
		 * @param {Array.<Player>} players
		 * @param {number} columns
		 * @param {number} rows
		 * @returns {Object}
		 */
		self.generateTargets = function(players, columns, rows) {

			_.each(players, function(player) {
				var targets = [];
				self.areas[player._id] = {targets: targets};

				for(var i=0; i<columns; i++) {
					targets[i] = [];

					for(var j=0; j<rows; j++) {
						targets[i][j] = {
							row: j,
							column: i,
							player: player,
							playerId: player._id,
							card: null
						}
					}
				}
			});

			return self.areas;
		};


		/**
		 * reset
		 */
		self.clear = function() {
			self.areas = {};
		};


		/**
		 * Create a simple copy that excludes redundant data
		 */
		self.getMini = function() {
			var copy = {};
			copy.future = self.future;
			copy.areas = {};

			var targets = self.allTargets();

			_.each(targets, function(target) {
				var id = target.player._id;
				if(!copy.areas[id]) {
					copy.areas[id] = {targets: {}};
				}
				copy.areas[id].targets[target.column+"-"+target.row] = target.card;
			});

			return copy;
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
		 * Return target found at pos
		 * @param {number} playerId
		 * @param {number} column
		 * @param {number} row
		 * @returns {*}
		 */
		self.target = function(playerId, column, row) {
			return self.areas[playerId].targets[column][row];
		};


		/**
		 * Return target found at pos
		 * @param {Object} pos
		 * @returns {*}
		 */
		self.targetPos = function(pos) {
			return self.target(pos.playerId, pos.column, pos.row);
		};


		/**
		 * Create a 1d array of all targets owned by a player
		 * @param {number} playerId
		 * @returns {Array} targets
		 */
		self.playerTargets = function(playerId) {
			var area = self.areas[playerId];
			if(!area) {
				return [];
			}

			var all = [];
			_.each(area.targets, function(column) {
				_.each(column, function(target) {
					all.push(target);
				});
			});
			return all;
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
		 * auto init if values were passed in
		 */
		if(players) {
			self.generateTargets(players, columns, rows);
		}


		return self;

	};


	/**
	 * export
	 */
	if (typeof module !== 'undefined') {
		module.exports = Board;
	}
	else {
		window.futurismShared = window.futurismShared || {};
		window.futurismShared.Board = Board;
	}

}());