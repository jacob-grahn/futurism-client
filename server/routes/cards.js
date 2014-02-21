'use strict';

var Card = require('../models/card');
var groups = require('../../shared/groups');
var globe = require('../fns/globe');


module.exports = {



	/**
	 * return a single card
	 */
	get: function(req, res) {
		var cardId = req.params.cardId;

		Card.findOne({_id: cardId})
			.populate('User')
			.exec(function(err, result) {
				return res.apiOut(err, result);
			});
	},


	/**
	 * report a card
	 */
	edit: function(req, res) {

		var action = req.param('action');
		var cardId = req.param('cardId');

		if(action === 'report') {
			Card.findById(cardId)
				.populate('User')
				.exec(function(err, card) {
					if(err) {
						return res.apiOut(err);
					}

					card = card.toObject();

					var report = {
						note: null,
						type: 'card',
						publicData: card
					};

					globe.saveReport(req.session._id, report, function(err) {
						card.reported = true;
						return res.apiOut(err, card);
					});
				});
		}
		else {
			return res.apiOut('Action "'+action+'" not found');
		}
	},


	/**
	 * output a list of cards owned by userId
	 */
	getList: function(req, res) {
		var userId = req.params.userId || req.session._id;
		var canon = req.body.canon || false;
		var page = req.body.page || 1;
		var count = 10;

		var query = {userId: userId};
		if(canon) {
			query = {$or: [{userId: userId}, {canon: true}]};
		}

		Card.paginate(query, page, count, function(err, pageCount, results) {
			return res.apiOut(err, {pageCount: pageCount, results: results, page: page});
		}, {sortBy: {updated:-1}});
	},


	/**
	 * update if card is cannon or not
	 */
	putCanon: function(req, res) {
		var data = {
			_id: req.body.cardId,
			canon: req.body.canon
		};
		Card.findByIdAndSave(data, function(err, card) {
			res.apiOut(err, card);
		});
	},



	/**
	 * Delete a card by id. User must be owner of the card or a moderator to do so
	 * @body {string} [cardId] the card to be deleted
	 */
	del: function(req, res) {
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
	}
};