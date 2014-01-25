'use strict';

var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer({});

module.exports = function(targetUri) {
	return function(req, res, next) {
		proxy.web(req, res, {target: targetUri});
	}
};