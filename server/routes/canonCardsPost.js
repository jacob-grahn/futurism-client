/**
 * Update an existing card to be canon or not
 * @param futurismServer
 */

(function() {
	'use strict';

	var Card = require('../models/card');
	var fndSave = require('../fns/fndSave');


	/**
	 * Save a card
	 * image is stored on s3, if there is one
	 * @body {string} cardId
	 * @body {boolean} canon
	 */
	module.exports = function(req, res) {
		var data = {
			_id: req.body.cardId,
			canon: req.body.canon
		};
		fndSave(Card, data, function(err, card) {
			res.apiOut(err, card);
		});
	};

}());