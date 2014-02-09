'use strict';

var Card = require('../models/card');
var groups = require('../../shared/groups');


/**
 * Delete a card by id. User must be owner of the card or a moderator to do so
 * @body {string} [cardId] the card to be deleted
 */
module.exports = function(req, res) {
	var cardId = req.params.cardId;
	var userId = req.session._id;

	// users can only delete their own cards
	var query = {_id: cardId, userId: userId};

	// mods and admins can delete any cards
	if(req.session.group === groups.MOD || req.session.group === groups.ADMIN) {
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