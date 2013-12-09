(function() {
	'use strict';

	var lookup = require('../fns/lookup')();
	var DeckGoose = require('../models/deck');
	var _ = require('lodash');
	var deckFns = require('../../shared/deckFns');


	var DeckPreload = {};


	/**
	 * Add listeners to a socket so it can interface with this class
	 * @param socket
	 */
	DeckPreload.initSocket = function(socket) {
		socket.on('selectDeck', function(data) {
			socket.get('account', function(err, account) {
				DeckPreload.selectDeck(account, data.gameId, data.deckId, function(err) {
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
	DeckPreload.idToDp = function(id) {
		return lookup.idToValue(id);
	};


	/**
	 * Load a deck from mongo, then add those cards to the player's account
	 * @param {object} account
	 * @param {string} gameId
	 * @param {string} deckId
	 * @param {function} cb
	 * @returns {null}
	 */
	DeckPreload.selectDeck = function(account, gameId, deckId, cb) {

		if(account.deck) {
			return cb('a deck was already loaded for you');
		}

		DeckGoose
			.findById(deckId)
			.populate('cards')
			.exec(function(err, deck) {
				if(err) {
					return cb(err);
				}

				var dp = DeckPreload.idToDp(gameId);
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

				if(account.deck) {
					return cb('a deck was already loaded for you');
				}

				if(account._id !== deck.userId) {
					return cb('you do not own this deck');
				}

				account.deck = deck;
				dp.nextIfDone();
				return cb(null, deck);
			});
	};


	/**
	 *
	 * @param {string} gameId
	 * @param {[{object}]} accounts
	 * @param {object} rules
	 * @param {function} callback
	 */
	DeckPreload.startGroup = function(gameId, accounts, rules, callback) {


		/**
		 * Call next if every account has loaded a deck
		 */
		var nextIfDone = function() {
			var allLoaded = true;
			_.each(accounts, function(account) {
				if(!account.deck) {
					allLoaded = false;
				}
			});
			if(allLoaded) {
				next();
			}
		};


		/**
		 * Call the callback with every account that successfully loaded a deck
		 * @returns {*}
		 */
		var next = function() {
			lookup.deleteId(gameId);
			accounts = _.filter(accounts, function(account) {
				return account.deck;
			});
			return callback(null, accounts);
		};


		/**
		 * clean up the timeout on remove
		 */
		var remove = function() {
			clearTimeout(forceStartTimeout);
		};


		/**
		 * Give people 30 seconds to pick a deck before leaving them behind
		 * @type {*}
		 */
		console.log('deckPreload will time out in '+rules.prepTime);
		var forceStartTimeout = setTimeout(next, rules.prepTime*1000);


		/**
		 * public interface
		 */
		var group = {
			nextIfDone: nextIfDone,
			rules: rules
		};

		lookup.store(gameId, group);
	};


	/**
	 * return to empty state
	 */
	DeckPreload.clear = function() {
		lookup.clear();
	};


	module.exports = DeckPreload;
}());