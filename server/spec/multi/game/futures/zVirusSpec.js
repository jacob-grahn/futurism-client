var zVirus = require('../../../../../server/multi/game/futures/zVirus');
var Board = require('../../../../../shared/Board');
var sinon = require('sinon');

describe('futures/zVirus', function() {

	var player1, player2, game;


	beforeEach(function() {
		player1 = {
			_id: 1,
			graveyard: [
				{
					cid: 1,
					name: 'bob',
					faction: 'en'
				},
				{
					cid: 2,
					name: 'sally',
					faction: 'no'
				},
				{
					cid: 3,
					name: 'aaaaarrrgg',
					faction: 'aa'
				}
			]
		};

		player2 = {
			_id: 2,
			graveyard: [
				{
					cid: 4,
					name: 'peter',
					faction: 'ze'
				},
				{
					cid: 5,
					name: 'pan',
					faction: 'el'
				}
			]
		};

		game = {
			board: new Board([player1, player2], 3, 2),

			broadcastChanges: sinon.spy(),

			idToPlayer: function(id) {
				if(id === 1) {
					return player1;
				}
				if(id === 2) {
					return player2;
				}
			}
		};
	});


	it('should create a zombie based on a card', function() {
		var zombie = zVirus.makeZombie({cid: 1, name: 'bob', faction: 'en'});
		expect(zombie.cid).toBe(1);
		expect(zombie.name).toBe('zombie bob');
		expect(zombie.faction).toBe('en');
		expect(zombie.zombie).toBe(true);
	});


	it('should remove cards from graveyards', function() {
		var data = {deaths: [
			{playerId: 1, column: 0, row: 0, cid: 1},
			{playerId: 1, column: 1, row: 0, cid: 2},
			{playerId: 2, column: 1, row: 0, cid: 5}
		]};
		zVirus.reanimateDead(game, 'death', null, data);
		expect(player1.graveyard).toEqual([{cid: 3, name: 'aaaaarrrgg', faction: 'aa'}])
		expect(player2.graveyard).toEqual([{cid: 4, name: 'peter', faction: 'ze'}])
	});


	it('should add dead cards back onto the board as zombies', function() {
		var data = {deaths: [
			{playerId: 1, column: 2, row: 0, cid: 2}
		]};
		zVirus.reanimateDead(game, 'death', null, data);
		expect(game.board.target(1, 2, 0).card.zombie).toBe(true);
	});


	it('should let dead zombies stay dead', function() {
		player1.graveyard = [{cid: 1, zombie: true, health: 0}];
		var data = {deaths: [
			{playerId: 1, column: 2, row: 0, cid: 1}
		]};
		zVirus.reanimateDead(game, 'death', null, data);
		expect(game.board.target(1, 2, 0).card).toBe(null);
		expect(player1.graveyard).toEqual([{cid: 1, zombie: true, health: 0}]);
	});
});
