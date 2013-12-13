describe('deckPreload', function() {

	var mongoose = require('mongoose');
	var mockgoose = require('mockgoose');
	mockgoose(mongoose);

	var DeckGoose = require('../../../models/deck');
	var CardGoose = require('../../../models/card');
	var Loadup = require('../../../multi/game/loadup');
	var Player = require('../../../multi/game/player');

	var gameId;
	var player1;
	var player2;
	var players;
	var rules;


	beforeEach(function(done) {
		player1 = new Player({_id:1});
		player2 = new Player({_id:2});
		rules = {pride: 10};
		gameId = '35';
		players = [player1, player2];

		DeckGoose.create({_id:'1-deck', userId:1, name:'lotr', cards:['1-card','2-card']}, function(err, deck){
			DeckGoose.create({_id:'2-deck', userId:2, name:'puppies', cards:['1-card', '1-card', '2-card', '2-card']}, function(err, deck){
				CardGoose.create({_id:'1-card', userId:1, name:'Gandalf', attack:1, health:2, abilities:[]}, function(err, deck){
					CardGoose.create({_id:'2-card', userId:1, name:'Frodo', attack:1, health:1, abilities:[]}, function(err, deck){
						done();
					});
				});
			});
		});
	});


	afterEach(function() {
		mockgoose.reset();
		Loadup.clear();
	});


	it("should not to be able to load someone else's deck", function(done) {
		Loadup.startGroup(gameId, players, rules, function(err, loadedplayers) {});

		var deckId = '2-deck';
		Loadup.selectDeck(player1, gameId, deckId, function(err, deck) {
			expect(err).toBe('you do not own this deck');
			done();
		});
	});


	it('should not to be able to load more than one deck', function(done) {
		Loadup.startGroup(gameId, players, rules, function(err, loadedplayers) {});

		var deckId = '1-deck';
		Loadup.selectDeck(player1, gameId, deckId, function(err, deck) {
			expect(err).toBe(null);
			expect(deck).toBeTruthy();

			Loadup.selectDeck(player1, gameId, deckId, function(err, deck) {
				expect(err).toBe('a deck was already loaded for you');
				done();
			});
		});
	});


	it('not to be able to load a deck with more pride than is allowed by the rules', function(done) {
		rules.pride = -5;
		Loadup.startGroup(gameId, players, rules, function(err, loadedplayers) {});

		var deckId = '1-deck';
		Loadup.selectDeck(player1, gameId, deckId, function(err, deck) {
			expect(err).toBe('this deck is too prideful');
			done();
		});
	});


	it('not to be able to load a deck without starting a group load first', function(done) {
		var deckId = '1-deck';
		gameId = 'sdflaj';
		Loadup.selectDeck(player1, gameId, deckId, function(err, deck) {
			expect(err).toBe('invalid preload gameId');
			done();
		});
	});


	it('everyone loading their deck to trigger the callback', function(done) {
		Loadup.startGroup(gameId, players, rules, function(err, loadedplayers) {
			expect(err).toBeNull();
			expect(loadedplayers.length).toBe(2);
			expect(player1.cards).not.toBeNull();
			done();
		});

		Loadup.selectDeck(player1, gameId, '1-deck', function(err, deck) {
			expect(err).toBeNull();
		});
		Loadup.selectDeck(player2, gameId, '2-deck', function(err, deck) {
			expect(err).toBeNull();
		});
	});


	it('deck loading to timeout', function(done) {
		rules.prepTime = .1;

		Loadup.startGroup(gameId, players, rules, function(err, loadedplayers) {
			expect(err).toBeNull();
			expect(loadedplayers.length).toBe(2);
			done();
		});
	});
});