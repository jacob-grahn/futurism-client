'use strict';

var death = require('./death');
var deBuf = require('./deBuf');
var drawCards = require('./drawCards');
var futureChange = require('./futureChange');
var lazyForfeit = require('./lazyForfeit');
var poison = require('./poison');
var prideUp = require('./prideUp');
var prizes = require('./prizes');
var recorder = require('./recorder');
var refresh = require('./refresh');
var shuffleCards = require('./shuffleCards');
var sortPlayers = require('./sortPlayers');
var victory = require('./victory');

module.exports = function(game) {

	death.activate(game);
	deBuf.activate(game);
	drawCards.activate(game);
	futureChange.activate(game);
	lazyForfeit.activate(game);
	poison.activate(game);
	prideUp.activate(game);
	prizes.activate(game);
	recorder.activate(game);
	refresh.activate(game);
	shuffleCards.activate(game);
	sortPlayers.activate(game);
	victory.activate(game);

	var Effects = {

	};

	return Effects;

};