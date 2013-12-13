describe('game/board', function() {

	var Board = require('../../../multi/game/board');
	var player1, player2, player3, rules;


	beforeEach(function() {
		player1 = {
			_id: 1,
			teamId: 1
		};

		player2 = {
			_id: 2,
			teamId: 2
		};

		player3 = {
			_id: 3,
			teamId: 2
		};

		rules = {
			rows: 2,
			columns: 5
		};
	});


	it('should create an area grid for each player', function() {
		var board = new Board([player1, player2], rules);
		expect(typeof board.areas['2']).toBe('object');
		expect(board.areas['1'].targets.length).toBe(rules.columns);
		expect(board.areas['1'].targets[0].length).toBe(rules.rows);
	});


	it('should lookup targets via playerId-column-row key', function() {
		var board = new Board([player1], rules);
		board.areas['1'].targets[4][1].value = 'test';
		expect(board.target(1, 4, 1).value).toBe('test');
	});


	it('should store row and column numbers inside the targets', function() {
		var board = new Board([player1], rules);
		expect(board.target(1,2,1).column).toBe(2);
		expect(board.target(1,2,1).row).toBe(1);
	});


	it('should store playerId and teamId in targets', function() {
		var board = new Board([player1, player2, player3], rules);
		expect(board.target(1,0,0).playerId).toBe(1);
		expect(board.target(2,0,0).teamId).toBe(2);
		expect(board.target(3,0,0).teamId).toBe(2);
	});

});