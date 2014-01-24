/**
 * Save deck
 */

(function() {
	'use strict';

	var createHashId = require('../fns/createHashId');
	var Deck = require('../models/deck');
	var _ = require('lodash');



	/**
	 * Save a deck
	 * @body {string} name
	 * @body {string[]} cards
	 * @body {number} pride
	 */
	module.exports = function(req, res) {

		//--- bring in user input
		var deck = _.pick(req.body, 'name', 'cards', 'pride');


		//--- server defined properties
		deck.id = req.session.userId + '-' + createHashId(deck.name);
		deck.userId = req.session.userId;


		//--- save deck to db
		Deck.findByIdAndSave(deck, res.apiOut);
	};

}());