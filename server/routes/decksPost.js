/**
 * Save deck
 */

(function() {
	'use strict';

	var fns = require('../fns/fns');
	var Deck = require('../models/deck');
	var _ = require('lodash');
	var fndSave = require('../fns/fndSave');



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
		deck.id = req.session.userId + '-' + fns.createHashId(deck.name);
		deck.userId = req.session.userId;


		//--- save deck to db
		fndSave(Deck, deck, res.apiOut);
	};

}());