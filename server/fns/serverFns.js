'use strict';

var _ = require('lodash');

var servers = process.env.GAME_SERVERS.split(',');

module.exports = {


	nextServerId: function() {
		var id = Math.floor(Math.random()*servers.length) + 1;
		console.log('game server id', id);
		return id;
	},


	isServerId: function(serverId) {
		return _.isNumber(serverId) && serverId >= 1 && serverId <= servers.length;
	}


};