'use strict';

var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer({});
var parseUrl = require('url').parse;

module.exports = function(targetUri) {

	var parsed = parseUrl(targetUri);
	var host = parsed.host;
	var secure = parsed.protocol === 'https:';

	return function(req, res, next) {
		req.headers.host = host;
		proxy.web(req, res, {target: targetUri, secure: secure});
	}
};