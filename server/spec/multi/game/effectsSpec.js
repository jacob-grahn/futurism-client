describe('game/effectsSpec', function() {

	var effects = require('../../../multi/game/effects');


	beforeEach(function() {
	});


	it('.death should remove cards with health less than or equal to 0 and add them to their owners graveyard', function() {
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

		effects.death(targets);

		expect(targets[0].card).toBeFalsy();
		expect(targets[1].card).toBeFalsy();
		expect(targets[2].card).toBeTruthy();
		expect(player1.graveyard[0].name).toBe('bob');
		expect(player2.graveyard[0].name).toBe('sue');
	});


	it('.poison should damage cards with a poison value greater than 0', function() {
		var targets = [
			{card: {health:1, poison:2} },
			{card: {health:1, poison:0} },
			{card: {health:1, poison:-1} }
		];

		effects.poison(targets);

		expect(targets[0].card.health).toBe(-1);
		expect(targets[1].card.health).toBe(1);
		expect(targets[2].card.health).toBe(1);
	});


	it('.deBuf should clear shield, attackBuf, and hero', function() {
		var targets = [
			{card: {shield:506, attackBuf:-1} },
			{card: {hero:1} },
		];

		effects.deBuf(targets);

		expect(targets[0].card.shield).toBe(0);
		expect(targets[0].card.attackBuf).toBe(0);
		expect(targets[1].card.hero).toBe(0);
	});


	it('.refresh should give a move to cards with less than 1 move', function() {
		var targets = [
			{card: {moves: -1} },
			{card: {moves: 0} },
			{card: {moves: 1} }
		];

		effects.refresh(targets);

		expect(targets[0].card.moves).toBe(0);
		expect(targets[1].card.moves).toBe(1);
		expect(targets[2].card.moves).toBe(1);
	});

});