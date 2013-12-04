describe('deckPreload', function() {

	var mongoose = require('mongoose');
	var mockgoose = require('mockgoose');
	mockgoose(mongoose);

	var DeckGoose = require('../../models/deck');
	var CardGoose = require('../../models/card');
	var deckPreload = require('../../multi/deckPreload');

	var gameId;
	var account1;
	var account2;
	var accounts;
	var rules;


	beforeEach(function(done) {
		account1 = {
			_id: 1
		};
		account2 = {
			_id: 2
		};
		rules = {
			pride: 10
		};
		gameId = '35';
		accounts = [account1, account2];

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
		deckPreload.clear();
	});


	it("should not to be able to load someone else's deck", function(done) {
		deckPreload.startGroup(gameId, accounts, rules, function(err, loadedAccounts) {});

		var deckId = '2-deck';
		deckPreload.selectDeck(account1, gameId, deckId, function(err, deck) {
			expect(err).toBe('you do not own this deck');
			done();
		});
	});


	it('should not to be able to load more than one deck', function(done) {
		deckPreload.startGroup(gameId, accounts, rules, function(err, loadedAccounts) {});

		var deckId = '1-deck';
		deckPreload.selectDeck(account1, gameId, deckId, function(err, deck) {
			expect(err).toBe(null);
			expect(deck).toBeTruthy();

			deckPreload.selectDeck(account1, gameId, deckId, function(err, deck) {
				expect(err).toBe('a deck was already loaded for you');
				done();
			});
		});
	});


	it('not to be able to load a deck with more pride than is allowed by the rules', function(done) {
		rules.pride = -5;
		deckPreload.startGroup(gameId, accounts, rules, function(err, loadedAccounts) {});

		var deckId = '1-deck';
		deckPreload.selectDeck(account1, gameId, deckId, function(err, deck) {
			expect(err).toBe('this deck is too prideful');
			done();
		});
	});


	it('not to be able to load a deck without starting a group load first', function(done) {
		var deckId = '1-deck';
		gameId = 'sdflaj';
		deckPreload.selectDeck(account1, gameId, deckId, function(err, deck) {
			expect(err).toBe('invalid preload gameId');
			done();
		});
	});


	it('everyone loading their deck to trigger the callback', function(done) {
		deckPreload.startGroup(gameId, accounts, rules, function(err, loadedAccounts) {
			expect(err).toBeNull();
			expect(loadedAccounts.length).toBe(2);
			expect(account1.cards).not.toBeNull();
			done();
		});

		deckPreload.selectDeck(account1, gameId, '1-deck', function(err, deck) {
			expect(err).toBeNull();
		});
		deckPreload.selectDeck(account2, gameId, '2-deck', function(err, deck) {
			expect(err).toBeNull();
		});
	});


	it('deck loading to timeout', function(done) {
		rules.prepTime = .1;

		deckPreload.startGroup(gameId, accounts, rules, function(err, loadedAccounts) {
			expect(err).toBeNull();
			expect(loadedAccounts.length).toBe(0);
			done();
		});
	});
});