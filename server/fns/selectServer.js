'use strict';

var _ = require('lodash');

var servers;

if(process.env.NODE_ENV === 'development') {
	servers = ['http://localhost:9000'];
}
if(process.env.NODE_ENV === 'staging') {
	servers = ['https://futurismwebstaging-9319.onmodulus.net?x-mod-servo=1'];
}
if(process.env.NODE_ENV === 'production') {
	servers = ['https://futurism/jiggmin.com?x-mod-servo=1'];
}


var selectServer = function() {
	return _.sample(servers);
};

module.exports = selectServer;