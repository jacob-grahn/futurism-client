describe('filters', function() {
	'use strict';

	var filters = require('../../../shared/filters');
	var Board = require('../../../shared/Board');
	var _ = require('lodash');

	// players
	var player1 = {
		_id: 1,
		team: 1
	};

	var player2 = {
		_id: 2,
		team: 1
	};

	var player3 = {
		_id: 3,
		team: 2
	};


	// cards
	var basicCard = {
		_id: 1,
		abilities: []
	};

	var femaleCard = {
		_id: 1,
		abilities: ['zzzz', 'blah', 'feml']
	};

	var maleCard = {
		_id: 1,
		abilities: ['male']
	};


	// targets
	var targets = [

		//////////////////////////////////////////////////////////////////////
		// player 1
		//////////////////////////////////////////////////////////////////////

		// player 1, column 0
		{
			targetId: 0,
			row: 0,
			column: 0,
			player: player1,
			card: femaleCard
		},
		{
			targetId: 1,
			row: 1,
			column: 0,
			player: player1,
			card: basicCard
		},
		{
			targetId: 2,
			row: 2,
			column: 0,
			player: player1,
			card: femaleCard
		},

		// player 1, column 1
		{
			targetId: 3,
			row: 0,
			column: 1,
			player: player1,
			card: null
		},
		{
			targetId: 4,
			row: 1,
			column: 1,
			player: player1,
			card: null
		},
		{
			targetId: 5,
			row: 2,
			column: 1,
			player: player1,
			card: null
		},

		// player 1, column 2
		{
			targetId: 6,
			row: 0,
			column: 2,
			player: player1,
			card: maleCard
		},
		{
			targetId: 7,
			row: 1,
			column: 2,
			player: player1,
			card: basicCard
		},
		{
			targetId: 8,
			row: 2,
			column: 2,
			player: player1,
			card: null
		},

		// player 1, column 3
		{
			targetId: 9,
			row: 0,
			column: 3,
			player: player1,
			card: null
		},
		{
			targetId: 10,
			row: 1,
			column: 3,
			player: player1,
			card: null
		},
		{
			targetId: 11,
			row: 2,
			column: 3,
			player: player1,
			card: null
		},

		//////////////////////////////////////////////////////////////////////////////
		// player 2
		//////////////////////////////////////////////////////////////////////////////

		// player 2, column 0
		{
			targetId: 12,
			row: 0,
			column: 0,
			player: player2,
			card: null
		},
		{
			targetId: 13,
			row: 1,
			column: 0,
			player: player2,
			card: null
		},
		{
			targetId: 14,
			row: 2,
			column: 0,
			player: player2,
			card: null
		},

		// player 2, column 1
		{
			targetId: 15,
			row: 0,
			column: 1,
			player: player2,
			card: null
		},
		{
			targetId: 16,
			row: 1,
			column: 1,
			player: player2,
			card: null
		},
		{
			targetId: 17,
			row: 2,
			column: 1,
			player: player2,
			card: null
		},

		// player 2, column 2
		{
			targetId: 18,
			row: 0,
			column: 2,
			player: player2,
			card: null
		},
		{
			targetId: 19,
			row: 1,
			column: 2,
			player: player2,
			card: null
		},
		{
			targetId: 20,
			row: 2,
			column: 2,
			player: player2,
			card: null
		},

		// player 2, column 3
		{
			targetId: 21,
			row: 0,
			column: 3,
			player: player2,
			card: maleCard
		},
		{
			targetId: 22,
			row: 1,
			column: 3,
			player: player2,
			card: null
		},
		{
			targetId: 23,
			row: 2,
			column: 3,
			player: player2,
			card: null
		},

		//////////////////////////////////////////////////////////////////////////////
		// player 3
		//////////////////////////////////////////////////////////////////////////////

		// player 3, column 0
		{
			targetId: 24,
			row: 0,
			column: 0,
			player: player3,
			card: null
		},
		{
			targetId: 25,
			row: 1,
			column: 0,
			player: player3,
			card: null
		},
		{
			targetId: 26,
			row: 2,
			column: 0,
			player: player3,
			card: null
		},

		// player 3, column 1
		{
			targetId: 27,
			row: 0,
			column: 1,
			player: player3,
			card: null
		},
		{
			targetId: 28,
			row: 1,
			column: 1,
			player: player3,
			card: null
		},
		{
			targetId: 29,
			row: 2,
			column: 1,
			player: player3,
			card: null
		},

		// player 3, column 2
		{
			targetId: 30,
			row: 0,
			column: 2,
			player: player3,
			card: null
		},
		{
			targetId: 31,
			row: 1,
			column: 2,
			player: player3,
			card: null
		},
		{
			targetId: 32,
			row: 2,
			column: 2,
			player: player3,
			card: null
		},

		// player 3, column 3
		{
			targetId: 33,
			row: 0,
			column: 3,
			player: player3,
			card: maleCard
		},
		{
			targetId: 34,
			row: 1,
			column: 3,
			player: player3,
			card: null
		},
		{
			targetId: 35,
			row: 2,
			column: 3,
			player: player3,
			card: null
		}
	];


	it('should find affordable targets (targets that cost less pride than you have)', function() {
		var targets = [
			{
				card: {
					cid: 0,
					pride: 8
				}
			},
			{
				card: {
					cid: 1,
					pride: 3
				}
			}
		];
		player1.pride = 3;
		var results = filters.affordable(targets, player1);
		expect(results.length).toBe(1);
		expect(results[0].card.cid).toBe(1);
	});


	describe('weak', function() {

		it('should find targets with a health of 1', function() {
			var targets = [
				{card: {
					cid: 0,
					health: 8
				}},
				{card: {
					cid: 1,
					health: 1
				}}
			];
			var weakTargets = filters.weak(targets);
			expect(weakTargets.length).toBe(1);
			expect(weakTargets[0].card.cid).toBe(1);
		});
	});


	it('should find empty targets', function() {
		var emptyTargets = filters.empty(targets);
		var results = _.map(emptyTargets, function(target) {
			return !!target.card;
		});
		expect(results).not.toContain(true);
		expect(emptyTargets).toContain(targets[5]);
	});


	it('should find full targets (targets with a card)', function() {
		var fullTargets = filters.full(targets);
		expect(fullTargets).toContain(targets[33]);
		expect(fullTargets).not.toContain(targets[32]);
	});


	it('should find targets owned by you or an ally', function() {
		var friendTargets = filters.friend(targets, player1);
		expect(friendTargets).toContain(targets[0]);
		expect(friendTargets).toContain(targets[18]);
		expect(friendTargets).not.toContain(targets[34]);
	});


	it('should find targets owned by an enemy', function() {
		var enemyTargets = filters.enemy(targets, player2);
		expect(enemyTargets).not.toContain(targets[1]);
		expect(enemyTargets).not.toContain(targets[20]);
		expect(enemyTargets).toContain(targets[35]);
	});


	describe('front', function() {
		it('should find targets that are at the highest row in the column', function() {
			var board = new Board([player1], 4, 2);
			board.target(1, 3, 0).card = {cid: 1};
			board.target(1, 2, 1).card = {cid: 2};
			board.target(1, 1, 1).card = {cid: 3};
			board.target(1, 0, 1).card = {cid: 4};
			var frontTargets = filters.front(board.allTargets(), player1, board);
			expect(frontTargets.length).toBe(7);
			expect(frontTargets).not.toContain(board.target(1, 3, 1));
		});
	});


	describe('hero', function() {
		it('should return only heroes if there are enemy heroes on the board', function() {
			var board = new Board([player1, player2], 2, 2);
			board.target(1, 0, 0).card = {cid: 1};
			board.target(2, 1, 1).card = {cid: 3, hero: 1};
			board.target(2, 0, 1).card = {cid: 4};

			var targets = board.allTargets();
			var heroTargets = filters.hero(targets, player1, board);
			expect(heroTargets.length).toBe(1);
			expect(heroTargets[0].card.cid).toBe(3);
		});

		it('should return everything if there are no heroes', function() {
			var board = new Board([player1, player2], 2, 2);
			board.target(1, 0, 0).card = {cid: 1};
			board.target(2, 1, 1).card = {cid: 3};
			board.target(2, 0, 1).card = {cid: 4};

			var targets = board.allTargets();
			var heroTargets = filters.hero(targets, player1, board);
			expect(heroTargets.length).toBe(8);
		});

		it('should return everything if the only heroes belong to you', function() {
			var board = new Board([player1, player2], 2, 2);
			board.target(1, 0, 0).card = {cid: 1, hero: 1};
			board.target(2, 1, 1).card = {cid: 3};
			board.target(2, 0, 1).card = {cid: 4};


			var targets = board.allTargets();
			var heroTargets = filters.hero(targets, player1, board);
			expect(heroTargets.length).toBe(8);
		});
	});


	it('should find male targets', function() {
		var maleTargets = filters.male(targets);
		expect(maleTargets).toContain(targets[33]);
		expect(maleTargets).not.toContain(targets[0]);
	});


	it('should find female targets', function() {
		var femaleTargets = filters.female(targets);
		expect(femaleTargets).toContain(targets[0]);
		expect(femaleTargets).toContain(targets[2]);
		expect(femaleTargets).not.toContain(targets[1]);
	});


	it('should find targets owned by you', function() {
		var myTargets = filters.owned(targets, player3);
		expect(myTargets).toContain(targets[35]);
		expect(myTargets).not.toContain(targets[1]);
	});

});