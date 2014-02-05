angular.module('futurism')
	.factory('players', function(me) {
		'use strict';

		var players = {

			list: [],
			me: null,


			/**
			 * Find a player using their id
			 * @param {number} playerId
			 */
			idToPlayer: function(playerId) {
				playerId = Number(playerId);
				var playerMatch = null;
				_.each(players.list, function(player) {
					if(player._id === playerId) {
						playerMatch = player;
					}
				});
				return playerMatch;
			},


			/**
			 * Find a player with your _id
			 */
			findMe: function() {
				return players.idToPlayer(me.userId);
			}

		};

		return players;

	});