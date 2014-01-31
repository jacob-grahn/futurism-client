(function() {
	'use strict';

	var Deck = require('../models/deck');


	var replyWithDeck = function(req, res) {
		var deckId = req.body.deckId;
		var userId = req.session._id;

		Deck.findOne({_id:deckId, userId:userId})
			.populate('cards')
			.exec(function(err, result) {
				return res.apiOut(err, result);
			})
	};


	var replyWidthList = function(req, res) {
		var userId = req.session._id;

		Deck.find({userId:userId})
			.exec(function(err, result) {
				return res.apiOut(err, result);
			})
	};


	/**
	 * Return a deck or a list of decks
	 * @checkAuth
	 * @body {string} [deckId]
	 */
	module.exports = function(req, res) {
		if(req.body && req.body.deckId) {
			replyWithDeck(req, res);
		}
		else {
			replyWidthList(req, res);
		}
	};


}());