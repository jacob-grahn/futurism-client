(function() {
	'use strict';

	var _;
	var filters = {};


	/**
	 * import
	 */
	if(typeof require !== 'undefined') {
		_ = require('lodash');
	}
	else {
		_ = window._;
	}


	filters.playable = function(targets, me) {
		var isCommanderInHand = _.where(me.hand, {commander: true}).length > 0;
		return _.filter(targets, function(target) {
			return !isCommanderInHand || target.card.commander === true;
		});
	};


	filters.weak = function(targets, me) {
		return _.filter(targets, function(target) {
			return target.card.health === 1;
		});
	};


	filters.affordable = function(targets, me) {
		return _.filter(targets, function(target) {
			return target.card.pride <= me.pride;
		});
	};


	filters.empty = function(targets, me) {
		return _.filter(targets, function(target) {
			return !target.card;
		});
	};


	filters.full = function(targets, me) {
		return _.filter(targets, function(target) {
			return !!target.card;
		});
	};


	filters.friend = function(targets, me) {
		return _.filter(targets, function(target) {
			return target.player.team === me.team;
		});
	};


	filters.enemy = function(targets, me) {
		return _.filter(targets, function(target) {
			return target.player.team !== me.team;
		});
	};


	filters.front = function(targets, me, board) {

		return _.filter(targets, function(target) {
			var column = target.column;
			var row = target.row - 1;

			if(column === undefined || row === undefined) {
				return false;
			}

			while(row >= 0) {
				if(board.target(target.player._id, column, row).card) {
					return false;
				}
				row--;
			}

			return true;
		});
	};


	filters.male = function(targets, me) {
		return _.filter(targets, function(target) {
			return target.card && target.card.abilities.indexOf('male') !== -1;
		});
	};


	filters.female = function(targets, me) {
		return _.filter(targets, function(target) {
			return target.card && target.card.abilities.indexOf('feml') !== -1;
		});
	};


	filters.owned = function(targets, me) {
		return _.filter(targets, function(target) {
			return target.player._id === me._id;
		});
	};


	/**
	 * export
	 */
	if (typeof module !== 'undefined') {
		module.exports = filters;
	}
	else {
		window.futurismShared = window.futurismShared || {};
		window.futurismShared.filters = filters;
	}

}());