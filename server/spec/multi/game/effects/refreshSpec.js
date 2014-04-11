var refresh = require('../../../../../server/multi/game/effects/refresh');


describe('effects/refresh', function() {
	it('should give a move to cards with less than 1 move', function() {

		var player1 = {_id: 1, hand: [], graveyard: []};
		var player2 = {_id: 2, hand: [], graveyard: []};

		var targets = [
			{card: {moves: -1} },
			{card: {moves: 0} },
			{card: {moves: 1} }
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
			}
		};

		refresh.refresh(game);

		expect(targets[0].card.moves).toBe(0);
		expect(targets[1].card.moves).toBe(1);
		expect(targets[2].card.moves).toBe(1);
	});
});

