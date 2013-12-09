describe('game', function() {
	'use strict';

	var Game = require('../../../multi/game/game');

	var lastMessage;
	var game;
	var account1;
	var account2;
	var accounts;
	var rules;
	var gameId = '123';


	beforeEach(function() {
		lastMessage = '';
		account1 = {
			_id: 1,
			deck: {
				pride: 8,
				cards: [{}, {}]
			},
			hand: []
		};
		account2 = {
			_id: 2,
			deck: {
				pride: 10,
				cards: [{}, {}]
			},
			hand: []
		};
		accounts = [account1, account2];
		rules = {};
	});


	afterEach(function() {
		if(game) {
			game.remove();
			game = null;
		}
	});


	it('should sort players by their deck pride, lowest first', function() {
		account1.deck.pride = 13;
		account2.deck.pride = 10;
		new Game(accounts, rules, gameId);
		expect(accounts[0]._id).toBe(account2._id);
		expect(accounts[1]._id).toBe(account1._id);

		account1.deck.pride = 5;
		account2.deck.pride = 7;
		new Game(accounts, rules, gameId);
		expect(accounts[0]._id).toBe(account1._id);
		expect(accounts[1]._id).toBe(account2._id);
	});


	it('gameState should get a complete overview of the game', function() {
		game = new Game(accounts, rules, gameId);
		var status = game.getStatus();
		expect(status.turn).toBe(1);
		expect(status.accounts[0]).toBe(accounts[0]);
		expect(status.activeAccountId).toBe(accounts[0]._id);
	});


	it('should move to the next player when a turn is ended', function() {
		game = new Game(accounts, rules, gameId);
		expect(game.getStatus().activeAccountId).toBe(account1._id);

		game.endTurn(account1);
		expect(game.getStatus().activeAccountId).toBe(account2._id);

		game.endTurn(account2);
		expect(game.getStatus().activeAccountId).toBe(account1._id);
	});


	it('should do nothing if the wrong player tries to end the turn', function() {
		game = new Game(accounts, rules, gameId);
		game.endTurn(account2);
		expect(game.getStatus().activeAccountId).toBe(account1._id);
	});


	it("should transfer cards from player's decks to their hands", function() {
		rules.handSize = 3;
		account1.deck = {
			cards: [{},{},{},{},{}],
			pride: 5
		};

		game = new Game(accounts, rules, gameId);
		expect(account1.cards.length).toBe(2);
		expect(account1.hand.length).toBe(3);
		expect(account2.cards.length).toBe(0);
		expect(account2.hand.length).toBe(2);

		account1.hand.pop();
		game.drawCards();
		expect(account1.cards.length).toBe(1);
		expect(account1.hand.length).toBe(3);
	});
});