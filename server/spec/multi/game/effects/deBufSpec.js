var deBuf = require('../../../../../server/multi/game/effects/deBuf');
var sinon = require('sinon');

describe('effects/deBuf', function() {
	it('should clear shield, attackBuf, and hero', function() {

		var player1 = {_id: 1, hand: [], graveyard: []};
		var player2 = {_id: 2, hand: [], graveyard: []};

		var targets = [
			{card: {shield:506, attackBuf:-1} },
			{card: {hero:1} }
		];

		var game = {
			players: [player1, player2],
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

		deBuf.deBuf(game);

		expect(targets[0].card.shield).toBe(0);
		expect(targets[0].card.attackBuf).toBe(0);
		expect(targets[1].card.hero).toBe(0);
		expect(game.broadcastChanges.callCount).toBe(1);
	});
});
