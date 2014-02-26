var Lobby = require('../models/lobby');
var serverFns = require('../fns/serverFns');

var createDefaultLobbies = function() {

	Lobby.findByIdAndUpdate('Brutus', {
			server: serverFns.nextServerId(),
			open: true,
			date: new Date(),
			minElo: 0
		}, {
			upsert: true
		});

	Lobby.findByIdAndUpdate('Masters', {
			server: serverFns.nextServerId(),
			open: true,
			date: new Date(),
			minElo: 300
		}, {
			upsert: true
		});

};

module.exports = createDefaultLobbies;