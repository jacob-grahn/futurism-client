var Lobby = require('../models/lobby');
var selectServer = require('../fns/selectServer');

var createDefaultLobbies = function() {
	Lobby.findByIdAndUpdate('Brutus', {
		server: selectServer(),
		open: true,
		date: new Date(),
		minElo: 0
	}, {
		upsert: true
	},
	function(err, lobby) {
		console.log(err, lobby);
	});

	Lobby.findByIdAndUpdate('Masters', {
		server: selectServer(),
		open: true,
		date: new Date(),
		minElo: 300
	}, {
		upsert: true
	},
	function(err, lobby) {
		console.log(err, lobby);
	});
};

module.exports = createDefaultLobbies;