(function() {
	'use strict';

	var Card = require('../models/card');
	var groups = require('../../shared/groups');


	/**
	 * Delete a card by id. User must be owner of the card or a moderator to do so
	 * @body {string} [cardId] the card to be deleted
	 */
	module.exports = function(req, res) {
		var cardId = req.body.cardId || req.body.id || req.body._id;
		var userId = req.session._id;

		var query = {_id: cardId, userId: userId};
		if(req.user.group === groups.MOD || req.user.group === groups.ADMIN) {
			query = {_id: cardId};
		}

		Card.findOneAndRemove(query, function(err, result) {
			if(err) {
				return res.apiOut(err);
			}
			if(!result) {
				return res.apiOut('card not found');
			}
			return res.apiOut(err, result);
		});
	};

}());