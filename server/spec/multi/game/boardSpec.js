describe('game/board', function() {

	var Board = require('../../../multi/game/board');
	var player1, player2, player3, columns, rows;


	beforeEach(function() {
		player1 = {
			_id: 1,
			team: 1
		};

		player2 = {
			_id: 2,
			team: 2
		};

		player3 = {
			_id: 3,
			team: 2
		};

		columns = 5;
		rows = 2;
	});


	it('should create an area grid for each player', function() {
		var board = new Board([player1, player2], columns, rows);
		expect(typeof board.areas['2']).toBe('object');
		expect(board.areas['1'].targets.length).toBe(columns);
		expect(board.areas['1'].targets[0].length).toBe(rows);
	});


	it('should lookup targets via playerId-column-row key', function() {
		var board = new Board([player1], columns, rows);
		board.areas['1'].targets[4][1].value = 'test';
		expect(board.target(1, 4, 1).value).toBe('test');
	});


	it('should store row and column numbers inside the targets', function() {
		var board = new Board([player1], columns, rows);
		expect(board.target(1,2,1).column).toBe(2);
		expect(board.target(1,2,1).row).toBe(1);
	});


	it('should store player in targets', function() {
		var board = new Board([player1, player2, player3], columns, rows);
		expect(board.target(1,0,0).player).toBe(player1);
		expect(board.target(3,0,0).player).toBe(player3);
	});


	it('should return all targets in one long array', function() {
		var board = new Board([player1, player2, player3], columns, rows);
		expect(board.allTargets().length).toBe(30);
	});


	it('should return all targets in an area', function() {
		var board = new Board([player1, player2, player3], columns, rows);
		expect(board.playerTargets(2).length).toBe(10);
	});

});