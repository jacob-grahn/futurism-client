'use strict';

var renaissance = require('../../../../../server/multi/game/futures/renaissance');
var futures = require('../../../../../shared/futures');
var actions = require('../../../../../shared/actions');
var sinon = require('sinon');
var _ = require('lodash');


describe('futures/nuclearWar', function() {

	var player1, player2, player1Targets, player2Targets, game;

	beforeEach(function() {
		player1 = {_id: 1};
		player1Targets = [
			{player: player1, card: {commander: true, moves: 0}},
			{player: player1, card: {moves: 0}}
		];

		player2 = {_id: 2};
		player2Targets = [
			{player: player2, card: {commander: true, moves: 0}},
			{player: player2, card: {moves: 0}}
		];

		game = {
			turnOwners: [player1],
			board: {
				playerTargets: function(playerId) {
					if(playerId === 1) {
						return player1Targets;
					}
					if(playerId === 2) {
						return player2Targets;
					}
				}
			},
			broadcastChanges: sinon.spy()
		};

	});


	describe('energizeCommanders', function() {
		it('should give commanders an action point on their turn', function() {
			renaissance.energizeCommanders(game);
			expect(player1Targets[0].card.moves).toBe(1);
			expect(player1Targets[1].card.moves).toBe(0);
			expect(player2Targets[0].card.moves).toBe(0);
			expect(player2Targets[1].card.moves).toBe(0);
			expect(game.broadcastChanges.calledWith(futures.RENAISSANCE)).toBe(true);
		});
	});

});