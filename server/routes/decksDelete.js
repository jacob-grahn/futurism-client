(function() {
	'use strict';

	var Deck = require('../models/deck');


	/**
	 * Delete a deck owned by the user
	 * @checkAuth
	 * @body {string} deckId
	 */
	module.exports = function(req, res) {
		var deckId = req.body.deckId || req.body.id || req.body._id;
		var userId = req.session._id;
		Deck.findOneAndRemove({_id: deckId, userId: userId}, function(err, result) {
			return res.apiOut(err, result);
		})
	};

}());