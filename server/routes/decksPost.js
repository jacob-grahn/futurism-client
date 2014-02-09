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
	deck._id = createHashId(req.session._id + '-' + deck.name, 16);
	deck.userId = req.session._id;

	//--- save deck to db
	Deck.findByIdAndSave(deck, res.apiOut);
};