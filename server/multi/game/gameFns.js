(function() {
	'use strict';

	module.exports = function() {
		var self = this;


		/**
		 * Sort players by their deck pride. Lowest pride goes first
		 * Shuffle first so that equal pride players will be randomized
		 */
		self.sortPlayers = function(players) {
			_.shuffle(players);
			players.sort(function(a, b) {
				return a.deck.pride - b.deck.pride;
			});
			return players;
		};


		/**
		 * Shuffle all the decks!
		 */
		self.shuffleDecks = function(players) {
			_.each(players, function(player) {
				player.cards = _.shuffle(player.cards);
			});
		};


		/**
		 * fill all player's hands if they still have cards in their deck
		 */
		self.drawCards = function(players, handSize) {
			_.each(players, function(player) {
				while(player.hand.length < handSize && player.cards.length > 0) {
					player.hand.push(player.cards.pop());
				}
			});
		};


	}();


}());