'use strict';

module.exports = function(req, res, next) {
	res.setHeader('Cache-Control', 'no-cache, no-store, max-age=0');
	next();
};

