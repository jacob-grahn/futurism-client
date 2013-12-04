module.exports = function() {
	'use strict';

	var _ = require('lodash');
	var filters = {};
	var mapWidth = 4;
	var mapHeight = 3;


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


	filters.spaceAhead = function(targets, me) {
		return _.filter(targets, function(target) {
			return target.rowNum < mapHeight-1;
		});
	};


	filters.friend = function(targets, me) {
		return _.filter(targets, function(target) {
			return target.account.team === me.team;
		});
	};


	filters.enemy = function(targets, me) {
		return _.filter(targets, function(target) {
			return target.account.team !== me.team;
		});
	};


	filters.front = function(targets, me) {
		return _.filter(targets, function(target) {
			if(!target.card) {
				return false;
			}
			if(target.rowNum === mapHeight-1) {
				return true;
			}
			for(var i=(target.rowNum+1); i<mapHeight; i++) {
				var higherTarget = target.column[i];
				if(higherTarget && higherTarget.card) {
					return false;
				}
			};
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
			return target.account._id === me._id;
		});
	};


	return filters;


}();