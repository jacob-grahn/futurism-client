var mongoose = require('mongoose');

var lobbySchema = new mongoose.Schema({
	_id: {
		type: String,
		index: true
	},
	server: {
		type: String
	},
	open: {
		type: Boolean
	},
	date: {
		type: Date
	},
	minElo: {
		type: Number
	}
});

var Lobby = mongoose.model('Lobby', lobbySchema);
module.exports = Lobby;