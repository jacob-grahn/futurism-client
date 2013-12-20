describe('game', function() {
	'use strict';

	var Game = require('../../../multi/game/game');
	var DeckGoose = require('../../../models/deck');
	var CardGoose = require('../../../models/card');


	it('should play through a simple game', function(done) {
		DeckGoose.create({
			_id: 'deck1',
			name: 'deck1',
			cards: ['card1'],
			userId: 1,
			pride: 17
		}, function(err) {
			expect(err).toBe(null);

			DeckGoose.create({
				_id: 'deck2',
				name: 'deck2',
				cards: ['card1'],
				userId: 2,
				pride: 17
			}, function(err) {
				expect(err).toBe(null);

				CardGoose.create({
					_id: 'card1',
					name: 'kicker',
					pride: 1,
					abilities: [],
					attack: 5,
					health: 2,
					userId: 123
				}, function(err) {
					expect(err).toBe(null);

					var accounts = [
						{_id:1, name:'phil'},
						{_id:2, name:'paulina'}
					];
					var rules = {};
					var gameId = 'game1';

					var game = new Game(accounts, rules, gameId);
					expect(game.getStatus().state).toBe('loadup');

					var player1 = game.idToPlayer(1);
					var player2 = game.idToPlayer(2);
					expect(player1.name).toBe('phil');
					expect(player2.name).toBe('paulina');

					game.loadup.selectDeck(player1, 'deck1', function(err) {
						expect(err).toBe(null);
						expect(game.getStatus().state).toBe('loadup');

						game.loadup.selectDeck(player2, 'deck2', function(err) {
							expect(err).toBe(null);
							expect(game.getStatus().state).toBe('running');

							done();
						})
					})
				});
			});
		});
	});


	/*it('should sort players by their deck pride, lowest first', function() {
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
	});*/
});