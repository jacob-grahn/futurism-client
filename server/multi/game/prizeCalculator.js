(function() {
	'use strict';

	var _ = require('lodash');
	var Elo = require('elo');


	var sum = function(numbers) {
		var sum = 0;
		_.each(numbers, function(number) {
			sum += number;
		});
		return sum;
	};


	var loadElos = function(players, callback) {

	};


	var saveElos = function(players, callback) {

	};


	module.exports = function(players, winningTeam) {
		var wElo = [];
		var lElo = [];

		_.each(players, function(player) {
			if(player.team === winningTeam) {
				wElo.push(player.elo);
			}
			else {
				lElo.push(player.elo);
			}
		});

		var avWinElo = sum(wElo) / wElo.length;
		var avLosElo = sum(lElo) / lElo.length;

		var results = Elo.calcChange(avWinElo, avLosElo, 1, 0);

		_.each(players, function(player) {
			if(player.team === winningTeam) {
				if(player.elo < results.a) {
					player.elo += (results.a-player.elo) / wElo.length;
				}
			}
			else {
				if(player.elo > results.b) {
					player.elo += (results.b-player.elo) / lElo.length;
				}
			}
		});
	}
}());