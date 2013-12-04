describe('filters', function() {
	'use strict';

	var filters = require('../../../multi/game/filters');
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
			rowNum: 0,
			columnNum: 0,
			account: player1,
			card: femaleCard
		},
		{
			targetId: 1,
			rowNum: 1,
			columnNum: 0,
			account: player1,
			card: basicCard
		},
		{
			targetId: 2,
			rowNum: 2,
			columnNum: 0,
			account: player1,
			card: femaleCard
		},

		// player 1, column 1
		{
			targetId: 3,
			rowNum: 0,
			columnNum: 1,
			account: player1,
			card: null
		},
		{
			targetId: 4,
			rowNum: 1,
			columnNum: 1,
			account: player1,
			card: null
		},
		{
			targetId: 5,
			rowNum: 2,
			columnNum: 1,
			account: player1,
			card: null
		},

		// player 1, column 2
		{
			targetId: 6,
			rowNum: 0,
			columnNum: 2,
			account: player1,
			card: maleCard
		},
		{
			targetId: 7,
			rowNum: 1,
			columnNum: 2,
			account: player1,
			card: basicCard
		},
		{
			targetId: 8,
			rowNum: 2,
			columnNum: 2,
			account: player1,
			card: null
		},

		// player 1, column 3
		{
			targetId: 9,
			rowNum: 0,
			columnNum: 3,
			account: player1,
			card: null
		},
		{
			targetId: 10,
			rowNum: 1,
			columnNum: 3,
			account: player1,
			card: null
		},
		{
			targetId: 11,
			rowNum: 2,
			columnNum: 3,
			account: player1,
			card: null
		},

		//////////////////////////////////////////////////////////////////////////////
		// player 2
		//////////////////////////////////////////////////////////////////////////////

		// player 2, column 0
		{
			targetId: 12,
			rowNum: 0,
			columnNum: 0,
			account: player2,
			card: null
		},
		{
			targetId: 13,
			rowNum: 1,
			columnNum: 0,
			account: player2,
			card: null
		},
		{
			targetId: 14,
			rowNum: 2,
			columnNum: 0,
			account: player2,
			card: null
		},

		// player 2, column 1
		{
			targetId: 15,
			rowNum: 0,
			columnNum: 1,
			account: player2,
			card: null
		},
		{
			targetId: 16,
			rowNum: 1,
			columnNum: 1,
			account: player2,
			card: null
		},
		{
			targetId: 17,
			rowNum: 2,
			columnNum: 1,
			account: player2,
			card: null
		},

		// player 2, column 2
		{
			targetId: 18,
			rowNum: 0,
			columnNum: 2,
			account: player2,
			card: null
		},
		{
			targetId: 19,
			rowNum: 1,
			columnNum: 2,
			account: player2,
			card: null
		},
		{
			targetId: 20,
			rowNum: 2,
			columnNum: 2,
			account: player2,
			card: null
		},

		// player 2, column 3
		{
			targetId: 21,
			rowNum: 0,
			columnNum: 3,
			account: player2,
			card: maleCard
		},
		{
			targetId: 22,
			rowNum: 1,
			columnNum: 3,
			account: player2,
			card: null
		},
		{
			targetId: 23,
			rowNum: 2,
			columnNum: 3,
			account: player2,
			card: null
		},

		//////////////////////////////////////////////////////////////////////////////
		// player 3
		//////////////////////////////////////////////////////////////////////////////

		// player 3, column 0
		{
			targetId: 24,
			rowNum: 0,
			columnNum: 0,
			account: player3,
			card: null
		},
		{
			targetId: 25,
			rowNum: 1,
			columnNum: 0,
			account: player3,
			card: null
		},
		{
			targetId: 26,
			rowNum: 2,
			columnNum: 0,
			account: player3,
			card: null
		},

		// player 3, column 1
		{
			targetId: 27,
			rowNum: 0,
			columnNum: 1,
			account: player3,
			card: null
		},
		{
			targetId: 28,
			rowNum: 1,
			columnNum: 1,
			account: player3,
			card: null
		},
		{
			targetId: 29,
			rowNum: 2,
			columnNum: 1,
			account: player3,
			card: null
		},

		// player 3, column 2
		{
			targetId: 30,
			rowNum: 0,
			columnNum: 2,
			account: player3,
			card: null
		},
		{
			targetId: 31,
			rowNum: 1,
			columnNum: 2,
			account: player3,
			card: null
		},
		{
			targetId: 32,
			rowNum: 2,
			columnNum: 2,
			account: player3,
			card: null
		},

		// player 3, column 3
		{
			targetId: 33,
			rowNum: 0,
			columnNum: 3,
			account: player3,
			card: maleCard
		},
		{
			targetId: 34,
			rowNum: 1,
			columnNum: 3,
			account: player3,
			card: null
		},
		{
			targetId: 35,
			rowNum: 2,
			columnNum: 3,
			account: player3,
			card: null
		}
	];


	// add targets to columns
	(function (targets) {
		var column = [];
		for(var i=0; i<targets.length; i++) {
			var target = targets[i];
			target.column = column;
			column.push(target);
			if(column.length === 3) {
				column = [];
			}
		}
	}(targets));


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


	it('should find targets that have with a space in front of them', function() {
		var spaceTargets = filters.spaceAhead(targets);
		expect(spaceTargets).toContain(targets[24]);
		expect(spaceTargets).not.toContain(targets[2]);
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


	it('should find cards that are on the frontlines', function() {
		var frontTargets = filters.front(targets);
		expect(frontTargets).toContain(targets[2]);
		expect(frontTargets).toContain(targets[33]);
		expect(frontTargets).not.toContain(targets[1]);
		expect(frontTargets).not.toContain(targets[30]);
		expect(frontTargets).not.toContain(targets[34]);
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