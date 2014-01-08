angular.module('futurism')
	.factory('rankCalc', function() {
		'use strict';

		var rankCalc = {};
		var mult = 10;
		var om = .5;
		var omInv = 1 / om;


		/**
		 * convert exp to rank
		 * @param {number} exp
		 * @returns {number}
		 */
		rankCalc.expToRank = function(exp) {
			var rank = Math.floor(Math.pow(exp/mult, om));
			if(isNaN(rank)) {
				rank = 0;
			}
			return rank;
		};


		/**
		 * convert rank to exp
		 * @param rank
		 * @returns {number}
		 */
		rankCalc.rankToExp = function(rank) {
			if(isNaN(rank) || !rank || rank <= 0) {
				return 0;
			}
			return Math.round(Math.pow(rank, omInv) * mult);
		};


		/**
		 * Calculate how much exp is needed to rank up
		 * @param {number} rank
		 * @returns {number}
		 */
		rankCalc.expNeeded = function(rank) {
			rank = Math.floor(rank);
			if(isNaN(rank) || !rank || rank <= 0) {
				return 0;
			}
			var minExp = rankCalc.rankToExp(rank);
			var maxExp = rankCalc.rankToExp(rank+1);
			return maxExp - minExp;
		};

		return rankCalc;
	});