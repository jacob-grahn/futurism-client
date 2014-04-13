describe('loadup', function() {

	var mongoose = require('mongoose');
	var mockgoose = require('mockgoose');
	mockgoose(mongoose);

	var DeckGoose = require('../../../models/deck');
	var CardGoose = require('../../../models/card');
	var Loadup = require('../../../multi/game/loadup');
	var Player = require('../../../multi/game/Player');

	var player1;
	var player2;
	var players;
	var rules;


	beforeEach(function(done) {
		player1 = new Player({_id:mongoose.Types.ObjectId()});
		player2 = new Player({_id:mongoose.Types.ObjectId()});
		rules = {pride: 10};
		players = [player1, player2];

		DeckGoose.create({_id:'1-deck', userId:player1._id, name:'lotr', cards:['1-card','2-card']}, function(err1, deck){
			DeckGoose.create({_id:'2-deck', userId:player2._id, name:'puppies', cards:['1-card', '1-card', '2-card', '2-card']}, function(err2, deck){
				CardGoose.create({_id:'1-card', userId:player1._id, name:'Gandalf', attack:1, health:2, abilities:[]}, function(err3, deck){
					CardGoose.create({_id:'2-card', userId:player2._id, name:'Frodo', attack:1, health:1, abilities:[]}, function(err4, deck){
						done(err1 || err2 || err3 || err4);
					});
				});
			});
		});
	});


	afterEach(function() {
		mockgoose.reset();
	});


	describe('prepareCard', function() {

		var loadup;

		beforeEach(function() {
			loadup = new Loadup(players, rules, function(err, loadedplayers) {});
		});

		it('should remove duplicate abilities', function() {
			var card = {faction: 'en', abilities: ['siph', 'siph']};
			var gameCard = loadup.prepareCard(card);
			expect(gameCard.abilities).toEqual(['siph']);
		});

		it('should remove abilities that do not belong to that cards faction', function() {
			var card = {faction: 'en', abilities: ['assn', 'tree']};
			var gameCard = loadup.prepareCard(card);
			expect(gameCard.abilities).toEqual(['tree']);
		});

		it('should give the card a cid', function() {
			var card = {faction: 'en', abilities: ['assn', 'tree']};
			var gameCard = loadup.prepareCard(card);
			expect(gameCard.cid).toBeGreaterThan(0);
		});

		it('should set the cards pride cost', function() {
			var card = {faction: 'en', abilities: ['assn', 'tree'], attack: 1, health: 1};
			var gameCard = loadup.prepareCard(card);
			console.log('gameCard', gameCard);
			expect(gameCard.pride).toBe(3);
		});

	});


	it("should not to be able to load someone else's deck", function(done) {
		var loadup = new Loadup(players, rules, function(err, loadedplayers) {});

		var deckId = '2-deck';
		loadup.selectDeck(player1, deckId, function(err, deck) {
			expect(err).toBe('you do not own this deck');
			done();
		});
	});


	it('should not to be able to load more than one deck', function(done) {
		var loadup = new Loadup(players, rules, function(err, loadedplayers) {});

		var deckId = '1-deck';
		loadup.selectDeck(player1, deckId, function(err, deck) {
			expect(err).toBe(null);
			expect(deck).toBeTruthy();

			loadup.selectDeck(player1, deckId, function(err, deck) {
				expect(err).toBe('a deck was already loaded for you');
				done();
			});
		});
	});


	it('should not be able to load a deck with more cards than is allowed by the rules', function(done) {
		rules.deckSize = -5;
		var loadup = new Loadup( players, rules, function(err, loadedplayers) {});

		var deckId = '1-deck';
		loadup.selectDeck(player1, deckId, function(err, deck) {
			expect(err).toBe('this deck has too many cards');
			done();
		});
	});


	it('everyone loading their deck to trigger the callback', function(done) {
		var loadup = new Loadup(players, rules, function(err, loadedplayers) {
			expect(err).toBeNull();
			expect(loadedplayers.length).toBe(2);
			expect(player1.cards).not.toBeNull();
			done();
		});

		loadup.selectDeck(player1, '1-deck', function(err, deck) {
			expect(err).toBeNull();
		});
		loadup.selectDeck(player2, '2-deck', function(err, deck) {
			expect(err).toBeNull();
		});
	});


	it('deck loading to timeout', function(done) {
		rules.prepTime = .1;
		var loadup = new Loadup(players, rules, function(err, loadedplayers) {
			expect(err).toBeNull();
			expect(loadedplayers.length).toBe(2);
			done();
		});
	});
});