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
            if(isNaN(exp) || exp <= 0) {
                return 0;
            }
            return Math.floor(Math.pow(exp/mult, om));
        };


        /**
         * convert rank to exp
         * @param rank
         * @returns {number}
         */
        rankCalc.rankToExp = function(rank) {
            if(isNaN(rank) || rank <= 0) {
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
            if(isNaN(rank) || rank <= 0) {
                return 0;
            }
            var minExp = rankCalc.rankToExp(rank);
            var maxExp = rankCalc.rankToExp(rank+1);
            return maxExp - minExp;
        };


        /**
         * Calculate how much exp is contributing to a new rank
         * @param {number} exp
         * @returns {number}
         */
        rankCalc.expRemainder = function(exp) {
            if(isNaN(exp) || exp <= 0) {
                return 0;
            }
            var rank = rankCalc.expToRank(exp);
            var baseExp = rankCalc.rankToExp(rank);
            return exp - baseExp;
        };

        return rankCalc;
    });