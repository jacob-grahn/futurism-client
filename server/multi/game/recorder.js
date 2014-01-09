(function() {
	'use strict';

	var RecordGoose = require('../../models/record');
	var _ = require('lodash');


	var recorder = function() {
		var self = this;

		self.users = [];
		self.actions = [];
		self.turns = 0;
		self.duration = 0;


		self.save = function(gameId, callback) {
			var doc = {
				_id: gameId,
				time: new Date(),
				turns: self.turns,
				users: self.minimizeUsers(self.users),
				actions: self.actions,
				cards: self.extractCards(self.users)
			};

			doc = JSON.parse(JSON.stringify(doc));
			RecordGoose.create(doc, callback);
		};


		self.extractCards = function(users) {
			var cardDict = {};
			_.each(users, function(user) {
				_.each(user.deck.cards, function(card) {
					cardDict[card._id] = card;
				});
			});

			var cardArr = [];
			_.each(cardDict, function(card) {
				cardArr.push(card);
			});

			return cardArr;
		};


		self.minimizeUsers = function(usersOrig) {
			return _.map(usersOrig, function(userOrig) {
				return self.minimizeUser(userOrig);
			});
		};


		self.minimizeUser = function(userOrig) {
			var user = _.pick(userOrig, '_id', 'name', 'site', 'group', 'elo', 'oldElo', 'fame', 'oldFame', 'fractures', 'oldFractures');
			user.deck = self.minimizeDeck(userOrig.deck);
			return user;
		};


		self.minimizeDeck = function(deckOrig) {
			var deck = {
				name: deckOrig.name,
				cards: []
			};

			_.each(deckOrig.cards, function(card) {
				deck.cards.push(card._id);
			});

			return deck;
		};
	};

	module.exports = recorder;

}());