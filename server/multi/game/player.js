'use strict';

/**
 * @class Represents a player in a game
 * @param {object} account
 */
var Player = function(account) {
	var self = this;
	self._id = account._id;
	self.team = self._id;
	self.name = account.name;
	self.site = account.site;
	self.hand = [];
	self.graveyard = [];
	self.cards = [];
	self.futures = [];
	self.pride = 3;
	self.deckPride = 0;
	self.deck = {};
};

module.exports = Player;