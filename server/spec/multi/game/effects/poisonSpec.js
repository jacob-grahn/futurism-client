var poison = require('../../../../../server/multi/game/effects/poison');
var sinon = require('sinon');

describe('effects/poison', function() {

	it('should do 1 damage for each poison', function() {

		var player1 = {_id: 1};

		var targets = [
			{card: {health: 5, poison: 1}},
			{card: {health: 5, poison: 0}},
			{card: {health: 5, poison: -1}},
			{card: {health: 5, poison: 5}}
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

		poison.poison(game);

		expect(targets[0].card.health).toBe(4);
		expect(targets[1].card.health).toBe(5);
		expect(targets[2].card.health).toBe(5);
		expect(targets[3].card.health).toBe(0);
		expect(game.broadcastChanges.callCount).toBe(1);
	});
});
