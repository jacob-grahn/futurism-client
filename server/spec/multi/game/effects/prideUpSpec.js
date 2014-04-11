var prideUp = require('../../../../../server/multi/game/effects/prideUp');

describe('effects/prideUp', function() {

	it('should increase player pride by 1', function() {

		var player1 = {_id: 1};
		var player2 = {_id: 2, pride: -5};
		var player3 = {_id: 3, pride: 2};


		var game = {
			turnOwners: [player1, player2, player3]
		};

		prideUp.prideUp(game);

		expect(player1.pride).toBe(1);
		expect(player2.pride).toBe(-4);
		expect(player3.pride).toBe(3);

	});
});