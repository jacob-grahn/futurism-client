(function() {
	'use strict';

	var _ = require('lodash');
	var lookup = require('../../fns/lookup')();
	var DeckGoose = require('../../models/deck');
	var deckFns = require('../../../shared/deckFns');


	/**
	 * @class Preload player's decks and futures before a game starts
	 */
	var Loadup = {};


	/**
	 * Add listeners to a socket so it can interface with this class
	 * @param socket
	 */
	Loadup.initSocket = function(socket) {
		socket.on('selectDeck', function(data) {
			socket.get('account', function(err, account) {
				Loadup.selectDeck(account, data.gameId, data.deckId, function(err) {
					if(err) {
						return socket.emit('selectDeckStatus', {error: err, status: 'fail'});
					}
					return socket.emit('selectDeckStatus', {status: 'success'});
				});
			});
		});
	};


	/**
	 * Convert id to a stored preload group
	 * @param id
	 * @returns {*}
	 */
	Loadup.idToDp = function(id) {
		return lookup.idToValue(id);
	};


	/**
	 * Load a deck from mongo, then add those cards to the player
	 * @param {Player} player
	 * @param {string} gameId
	 * @param {string} deckId
	 * @param {function} cb
	 * @returns {null}
	 */
	Loadup.selectDeck = function(player, gameId, deckId, cb) {

		DeckGoose
			.findById(deckId)
			.populate('cards')
			.exec(function(err, deck) {
				if(err) {
					return cb(err);
				}

				var dp = Loadup.idToDp(gameId);
				if(!dp) {
					return cb('invalid preload gameId');
				}

				if(!deck) {
					return cb('deck id '+deckId+' not found');
				}

				deck.pride = deckFns.calcPride(deck);
				if(deckFns.calcPride(deck) > dp.rules.pride) {
					return cb('this deck is too prideful');
				}

				if(player.cards.length > 0) {
					return cb('a deck was already loaded for you');
				}

				if(player._id !== deck.userId) {
					return cb('you do not own this deck');
				}

				player.cards = _.cloneDeep(deck.cards);
				dp.nextIfDone();
				return cb(null, deck);
			});
	};


	/**
	 *
	 * @param {string} gameId
	 * @param {[{object}]} players
	 * @param {object} rules
	 * @param {function} callback
	 */
	Loadup.startGroup = function(gameId, players, rules, callback) {

		var self = this;
		self.rules = rules;

		/**
		 * Call next if every account has loaded a deck
		 */
		self.nextIfDone = function() {
			var allLoaded = true;
			_.each(players, function(player) {
				if(!player.cards.length > 0) {
					allLoaded = false;
				}
			});
			if(allLoaded) {
				self.next();
			}
		};


		/**
		 * Callback with every player
		 * @returns {*}
		 */
		self.next = function() {
			clearTimeout(forceStartTimeout);
			return callback(null, players);
		};


		/**
		 * Give people 30 seconds (default) to pick a deck before leaving them behind
		 */
		var forceStartTimeout = setTimeout(self.next, rules.prepTime*1000);


		/**
		 * store this loadup for later usage
		 */
		lookup.store(gameId, self);
	};


	/**
	 * return to empty state
	 */
	Loadup.clear = function() {
		lookup.clear();
	};


	module.exports = Loadup;
}());