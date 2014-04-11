'use strict';

var death = require('./death');
var deBuf = require('./deBuf');
var drawCards = require('./drawCards');
var lazyForfeit = require('./lazyForfeit');
var poison = require('./poison');
var prideUp = require('./prideUp');
var refresh = require('./refresh');
var shuffleCards = require('./shuffleCards');
var sortPlayers = require('./sortPlayers');

module.exports = function(game) {

	death.activate(game);
	deBuf.activate(game);
	drawCards.activate(game);
	lazyForfeit.activate(game);
	poison.activate(game);
	prideUp.activate(game);
	refresh.activate(game);
	shuffleCards.activate(game);
	sortPlayers.activate(game);

	var Effects = {

	};

	return Effects;

};