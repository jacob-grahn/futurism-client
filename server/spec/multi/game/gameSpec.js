describe('game', function() {
	'use strict';

	var mongoose = require('mongoose');
	var mockgoose = require('mockgoose');
	mockgoose(mongoose);

	var _ = require('lodash');
	var Game = require('../../../multi/game/game');
	var DeckGoose = require('../../../models/deck');
	var CardGoose = require('../../../models/card');
	var UserGoose = require('../../../models/stats');
	var broadcast = require('../../../multi/broadcast');


	var uid1 = mongoose.Types.ObjectId();
	var uid2 = mongoose.Types.ObjectId();
	var uid3 = mongoose.Types.ObjectId();

	beforeEach(function(done) {

		UserGoose.create({
			_id: uid1,
			name: 'phil',
			site: 'j',
			group: 'm',
			elo: 150,
			fame: 0,
			fractures: 0
		},
		function(err1) {

			UserGoose.create({
				_id: uid2,
				name: 'paulina',
				site: 'j',
				group: 'm',
				elo: 549,
				fame: 30,
				fractures: 52
			},
			function(err2) {

				UserGoose.create({
					_id: uid3,
					name: 'jetson',
					site: 'j',
					group: 'm',
					elo: 13,
					fame: 9765,
					fractures: 2
				},
				function(err3) {

					DeckGoose.create({
						_id: 'deck1',
						name: 'deck1',
						cards: ['card1'],
						userId: uid1,
						pride: 17
					},
					function(err4) {

						DeckGoose.create({
							_id: 'deck2',
							name: 'deck2',
							cards: ['card1', 'card1'],
							userId: uid2,
							pride: 17
						},
						function(err5) {

							CardGoose.create({
								_id: 'card1',
								name: 'kicker',
								pride: 1,
								abilities: [],
								attack: 5,
								health: 2,
								userId: mongoose.Types.ObjectId()
							},
							function(err6) {

								done(err1 || err2 || err3 || err4 || err5 || err6);
							});
						});
					});
				});
			});
		});
	});


	afterEach(function() {
		mockgoose.reset();
	});


	/*it('should play through a simple game', function(done) {
		var accounts = [
			{_id:uid1, name:'phil'},
			{_id:uid2, name:'paulina'}
		];
		var rules = {};
		var gameId = 'game1';

		var game = new Game(accounts, rules, gameId);
		expect(game.getStatus().state).toBe('loadup');

		var player1 = game.idToPlayer(uid1);
		var player2 = game.idToPlayer(uid2);
		expect(player1.name).toBe('phil');
		expect(player2.name).toBe('paulina');
		expect(player1.pride).toBe(0);
		expect(player2.pride).toBe(0);

		game.loadup.selectDeck(player1, 'deck1', function(err) {
			expect(err).toBe(null);
			expect(game.getStatus().state).toBe('loadup');

			game.loadup.selectDeck(player2, 'deck2', function(err) {
				expect(err).toBe(null);
				expect(game.getStatus().state).toBe('running');
				expect(game.players[0]._id).toBe(uid1);
				expect(game.players[1]._id).toBe(uid2);


				////////////////////////////////////////////////////////
				// play the commander card for player1's hand
				////////////////////////////////////////////////////////
				var actionResult = game.doAction(player1, 'smmn', [
					{
						playerId: uid1,
						cid: player1.hand[0].cid
					},
					{
						playerId: uid1,
						cid: player1.hand[0].cid
					},
					{
						playerId: uid1,
						column: 0,
						row: 0
					}
				]);

				if(actionResult !== 'ok') {
					return done(actionResult);
				}

				expect(game.board.target(uid1,0,0).card.name).toBe('phil');
				expect(game.board.target(uid1,0,0).card.moves).toBe(0);

				game.endTurn(player1);


				/////////////////////////////////////////////////////////
				// play the commander card from player2's hand
				/////////////////////////////////////////////////////////
				expect(
					game.doAction(player2, 'smmn', [
						{
							playerId: uid2,
							cid: player2.hand[0].cid
						},
						{
							playerId: uid2,
							cid: player2.hand[0].cid
						},
						{
							playerId: uid2,
							column: 0,
							row: 0
						}
					])
				).toBe('ok');

				game.endTurn(player2);

				expect(game.board.target(uid1,0,0).card.moves).toBe(1);
				expect( game.doAction(player1, 'rlly', [{playerId:uid1, column:0, row:0}]) ).toBe('ok');
				expect(game.board.target(uid1,0,0).card.moves).toBe(0);
				expect(player1.pride).toBe(3);
				game.endTurn(player1);

				game.board.target(uid2,0,0).card.health = -4;
				game.endTurn(player2);

				expect(game.getStatus().state).toBe('awarding');

				_.delay(function() {
					expect(game.getStatus().state).toBe('removed');
					expect(broadcast.lastMessage.event).toBe('gameOver');

					UserGoose.findById(uid1, function(err, doc) {
						expect(err).toBe(null);
						expect(doc.elo > 150).toBe(true);
						expect(doc.fame > 0).toBe(true);

						UserGoose.findById(uid2, function(err, doc) {
							expect(err).toBe(null);
							expect(doc.elo < 549).toBe(true);
							expect(doc.fame > 30).toBe(true);

							done();
						})
					});
				});
			})
		})
	});*/
});