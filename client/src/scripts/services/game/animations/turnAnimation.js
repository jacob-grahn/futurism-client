angular.module('futurism')
	.factory('turnAnimation', function($, $timeout, players) {
		'use strict';

		var turnAnimation = {

			name: '',

			run: function(changes, callback) {
				$timeout(callback, 500);

				var playerId = changes.turnOwners[0];
				var player = players.idToPlayer(playerId);
				turnAnimation.name = player.name;

				turnAnimation.showing = true;
				$timeout(function() {
					turnAnimation.showing = false;
				}, 4000);
			}
		};

		return turnAnimation;

	});