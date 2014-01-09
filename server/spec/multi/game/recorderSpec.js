describe('recorder', function() {

	var mongoose = require('mongoose');
	var mockgoose = require('mockgoose');
	mockgoose(mongoose);

	var RecordGoose = require('../../../models/record');
	var Recorder = require('../../../multi/game/recorder');

	var recorder, gameId;


	beforeEach(function() {
		recorder = new Recorder();
		gameId = '123';
	});


	afterEach(function() {
		mockgoose.reset();
	});


	/**
	 *
	 */
	describe('minimizeDeck', function() {

		it('should remove unneeded values and replace cards with their _id', function() {
			var deck = {
				_id: '123',
				name: 'Hello',
				cards: [
					{_id: 'card1', abilities:[]}
				]
			};

			var minDeck = recorder.minimizeDeck(deck);

			expect(minDeck._id).toBe(undefined);
			expect(minDeck.name).toBe('Hello');
			expect(minDeck.cards).toEqual(['card1']);
		});

		it('should return an empty array of cards if none are given', function() {
			var deck = {
				name: 'Hello'
			};

			var minDeck = recorder.minimizeDeck(deck);

			expect(minDeck.cards).toEqual([]);
		});
	});


	/**
	 *
	 */
	describe('minimizeUser', function() {

		it('should pull out unneeded values', function() {
			var user = {
				_id: 123,
				name: 'Sue',
				random: 'Hi gueis',
				deck: {
					_id: '123',
					name: 'Hello',
					cards: [
						{_id: 'card1', abilities:[]}
					]
				}
			};

			var minUser = recorder.minimizeUser(user);

			expect(minUser._id).toBe(123);
			expect(minUser.name).toBe('Sue');
			expect(minUser.random).toBe(undefined);
			expect(minUser.deck._id).toBe(undefined);
		});
	});


	/**
	 *
	 */
	describe('extractCards', function() {

		it('should make an unique array of all of the cards used by all of the players', function() {
			var users = [
				{
					deck: {
						cards: [
							{_id: 'card1', abilities:[]}
						]
					}
				},
				{
					deck: {
						cards: [
							{_id: 'card1', abilities:[]},
							{_id: 'card2', abilities:[]}
						]
					}
				}
			];

			var cards = recorder.extractCards(users);

			expect(cards.length).toBe(2);
			expect(cards[0]._id).toBe('card1');
			expect(cards[1]._id).toBe('card2');
		});
	});


	/**
	 *
	 */
	describe('save', function() {

		it('should write a record to mongo', function(done) {

			recorder.users = [
				{
					_id: 1,
					oldElo: 50,
					elo: 52,
					oldFame: 544,
					fame: 545,
					oldFractures: 13,
					fractures: 14,
					deck: [],
					extra: 'hi'
				},
				{
					_id: 2,
					elo: 60,
					fame: 6729,
					deck: {
						name: 'sandals',
						cards: [
							{_id: 'cardId1', name: 'arrr'}
						]
					},
					unrelated: 'bla bla bla'
				}
			];
			recorder.time = new Date();
			recorder.turns = 83;
			recorder.actions = [{id: 'tree'}];

			recorder.save(gameId, function(err, result) {
				expect(err).toBe(null);

				RecordGoose.findById(gameId, function(err, doc) {
					expect(err).toBeFalsy();
					expect(doc).toBeTruthy();
					if(doc) {
						expect(doc.users[0]._id).toBe(1);
						expect(doc.users[0].oldElo).toBe(50);
						expect(doc.turns).toBe(83);
						expect(doc.cards[0].name).toBe('arrr');
						expect(doc.users[1].deck.cards[0]).toBe('cardId1');
					}
					done();
				});
			});
		});
	});

});