var death = require('../../../../../server/multi/game/effects/death');

describe('effects/death', function() {

	it('should remove cards with health less than or equal to 0 and add them to their owners graveyard', function() {
		var player1 = {_id:1, graveyard:[]};
		var player2 = {_id:2, graveyard:[]};

		var targets = [
			{
				card: {name: 'bob', health: -3},
				player: player1
			},
			{
				card: {name: 'sue', health: 0},
				player: player2
			},
			{
				card: {name: 'wright', health: 1},
				player: player1
			}
		];

		var game = {
			players: [player1, player2],
			board: {
				allTargets: function() {
					return targets;
				}
			}
		};

		death.death(game);

		expect(targets[0].card).toBeFalsy();
		expect(targets[1].card).toBeFalsy();
		expect(targets[2].card).toBeTruthy();
		expect(player1.graveyard[0].name).toBe('bob');
		expect(player2.graveyard[0].name).toBe('sue');
	});
});

