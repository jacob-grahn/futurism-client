var freeLove = require('../../../../../server/multi/game/futures/freeLove');
var sinon = require('sinon');

describe('futures/freeLove', function() {

	it('give cards with action points one health', function() {

		var player1 = {_id: 1};

		var targets = [
			{card: {health: 5, moves: 2}},
			{card: {health: 5, moves: 1}},
			{card: {health: 5, moves: 0}},
			{card: {health: 5, moves: -1}}
		];

		var game = {
			turnOwners: [player1],
			board: {
				playerTargets: function(playerId) {
					if(playerId === 1) {
						return targets;
					}
				}
			},
			broadcastChanges: sinon.spy()
		};

		freeLove.freeLove(game);

		expect(targets[0].card.health).toBe(6);
		expect(targets[1].card.health).toBe(6);
		expect(targets[2].card.health).toBe(5);
		expect(targets[3].card.health).toBe(5);
		expect(game.broadcastChanges.callCount).toBe(1);
	});
});
