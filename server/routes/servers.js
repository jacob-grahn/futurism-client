var serverFns = require('../fns/serverFns');

module.exports = {

	get: function(req, res) {
		res.apiOut(null, serverFns.servers);
	}
};