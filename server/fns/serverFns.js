'use strict';

var _ = require('lodash');

var servers = _.map(process.env.GAME_SERVERS.split(','), function(serverUri, index){
	return {id: index + 1, uri: serverUri};
});

module.exports = {

	servers: servers,


	nextServerId: function() {
		var server = _.sample(servers);
		return server.id;
	},


	isServerId: function(serverId) {
		return _.isNumber(serverId) && serverId >= 1 && serverId <= servers.length;
	}


};