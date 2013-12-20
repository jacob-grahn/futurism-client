describe('game', function() {
	'use strict';

	var mongoose = require('mongoose');
	var mockgoose = require('mockgoose');
	mockgoose(mongoose);

	var _ = require('lodash');
	var Game = require('../../../multi/game/game');
	var DeckGoose = require('../../../models/deck');
	var CardGoose = require('../../../models/card');
	var UserGoose = require('../../../models/user');


	beforeEach(function(done) {

		UserGoose.create({
			_id: 1,
			name: 'phil',
			site: 'j',
			group: 'm',
			elo: 150,
			fame: 0,
			fractures: 0
		},
		function(err) {
			if(err) {
				console.log(err);
				throw err;
			}


			UserGoose.create({
				_id: 2,
				name: 'paulina',
				site: 'j',
				group: 'm',
				elo: 549,
				fame: 30,
				fractures: 52
			},
			function(err) {
				if(err) {
					console.log(err);
					throw err;
				}


				UserGoose.create({
					_id: 3,
					name: 'jetson',
					site: 'j',
					group: 'm',
					elo: 13,
					fame: 9765,
					fractures: 2
				},
				function(err) {
					if(err) {
						console.log(err);
						throw err;
					}


					DeckGoose.create({
						_id: 'deck1',
						name: 'deck1',
						cards: ['card1'],
						userId: 1,
						pride: 17
					},
					function(err) {
						if(err) {
							console.log(err);
							throw err;
						}


						DeckGoose.create({
							_id: 'deck2',
							name: 'deck2',
							cards: ['card1'],
							userId: 2,
							pride: 17
						},
						function(err) {
							if(err) {
								console.log(err);
								throw err;
							}


							CardGoose.create({
								_id: 'card1',
								name: 'kicker',
								pride: 1,
								abilities: [],
								attack: 5,
								health: 2,
								userId: 123
							},
							function(err) {
								if(err) {
									console.log(err);
									throw err;
								}


								done();
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


	it('should play through a simple game', function(done) {
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

				var r1 = game.playCard(player1, player1.hand[0].cid, 0, 0);
				expect(r1).toBeFalsy();
				expect(game.board.target(1,0,0).card.name).toBe('phil');

				game.endTurn(player1);
				game.endTurn(player2);
				game.endTurn(player1);
				expect(game.getStatus().state).toBe('awarding');

				_.delay(function() {
					expect(game.getStatus().state).toBe('removed');

					UserGoose.findById(1, function(err, doc) {
						expect(err).toBe(null);
						expect(doc.elo > 150).toBe(true);
						expect(doc.fame > 0).toBe(true);

						UserGoose.findById(2, function(err, doc) {
							expect(err).toBe(null);
							expect(doc.elo < 549).toBe(true);
							expect(doc.fame > 30).toBe(true);

							done();
						})
					});
				});
			})
		})
	});
});