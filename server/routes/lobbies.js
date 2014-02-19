'use strict';

var Lobby = require('../models/lobby');
var selectServer = require('../fns/selectServer');


module.exports = {


	getList: function(req, res) {
		Lobby.find({$or: [
			{_id: req.session.guild},
			{open: true}
		]}, res.apiOut);
	},


	get: function(req, res) {
		Lobby.findById(req.params.lobbyId, res.apiOut);
	},


	post: function(req, res) {
		var guildId = req.session.guild;
		if(!guildId) {
			return callback('no guildId in session');
		}

		Lobby.create({
			_id: guildId,
			open: false,
			server: selectServer(),
			date: new Date(),
			minElo: 0
		}, res.apiOut);
	}
};