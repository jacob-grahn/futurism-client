describe('actionFns', function() {

	var actionFns = require('../../../multi/game/actionFns');
	var Board = require('../../../multi/game/board');
	var game, board, player1, player2;


	beforeEach(function() {
		player1 = {
			_id: 1,
			name: 'Philly',
			team: 1
		};
		player2 = {
			_id: 2,
			name: 'Sue Grafton',
			team: 2
		};

		var columns = 2;
		var rows = 2;
		board = new Board([player1, player2], columns, rows);

		game = {
			board: board
		}
	});


	it('should perform a valid action', function() {
		board.target(1,0,0).card = {
			abilities: ['heal'],
			health: 3
		};
		var result = actionFns.doAction(game, player1, 'heal', [{playerId:1, column:0, row:0}, {playerId:1, column:0, row:0}]);
		expect(result).toEqual({newHealth: 4});
		expect(board.target(1,0,0).card.health).toBe(4);
	});


	it('should not perform an action on an invalid target', function() {
		var result = actionFns.doAction(game, player1, 'heal', [{playerId:1, column:0, row:0}]);
		expect(result).not.toBe('ok');
	});


	it('should not let you use a card you do not own', function() {
		board.target(2,0,0).card = {
			abilities: ['heal'],
			health: 3
		};
		var result = actionFns.doAction(game, player1, 'heal', [{playerId:2, column:0, row:0}]);
		expect(result.err).toContain('not your card');
	});


	it('should not let you use an ability the card does not have', function() {
		board.target(1,0,0).card = {
			abilities: [],
			player: player1
		};
		board.target(2,0,0).card = {
			player: player2
		};
		var result = actionFns.doAction(game, player1, 'rbld', [{playerId:1, column:0, row:0}, {playerId:2, column:0, row:0}]);
		expect(result.err).toContain('card does not have the ability');
	});


	it('should perform multi-step validations', function() {
		board.target(1,0,0).card = {
			abilities: ['male'],
			moves: 1
		};
		board.target(1,0,1).card = {
			abilities: ['feml'],
			moves: 1
		};
		var result = actionFns.doAction(game, player1, 'male', [
			{playerId:1, column:0, row:0}, //male
			{playerId:1, column:0, row:1}, //female
			{playerId:1, column:1, row:0} //empty slot for child
		]);
		expect(board.target(1,1,0).card.name).toBe('GROW TUBE');
	});


	it('should fail bad multi-step validations', function() {
		board.target(1,0,0).card = {
			abilities: ['male']
		};
		board.target(1,0,1).card = {
			abilities: ['feml']
		};
		var result = actionFns.doAction(game, player1, 'feml', [
			{playerId:1, column:0, row:1}, //male
			{playerId:1, column:0, row:0}, //female
			{playerId:2, column:1, row:0} //enemy territory, should fail here
		]);
		expect(result).toEqual({err: 'target is not allowed'});
	});

});