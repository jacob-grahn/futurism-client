/**
 * Cards
 */

(function() {
	'use strict';

	var Card = require('../models/card');


	/**
	 * Retrieve one card if a cardId is provided, or all cards owned by a user if a userId is provided
	 * @checkAuth
	 * @body {string} [id]
	 * @body {int} [userId]
	 * @body {boolean} [canon] include canon cards or not
	 */
	module.exports = function(req, res) {

		//--- import
		var userId = req.body.userId || req.session._id;
		var cardId = req.body._id || req.body.id || req.body.cardId;
		var canon = req.body.canon || false;

		//--- sanity check
		if(!cardId && !userId) {
			throw new Error('cardId or userId should be defined');
		}

		//--- return a single card based on cardId
		if(cardId) {
			Card.findOne({_id: cardId})
				.populate('User')
				.exec(function(err, result) {
					return res.apiOut(err, result);
				});
		}

		//--- return a list of cards owned by a userId
		else if(userId) {
			var query = {userId: userId};
			if(canon) {
				query = {$or: [{userId: userId}, {canon: true}]};
			}
			Card.find(query)
				.sort({updated:-1})
				.exec(function(err, result) {
					return res.apiOut(err, result);
				});
		}
	};


}());