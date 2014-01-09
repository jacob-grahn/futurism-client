(function() {
	'use strict';

	var RecordGoose = require('../models/record');

	/**
	 * Return a full game record if gameId is provided
	 * Return list of recent records if no gameId is provided
	 * @param req
	 * @param res
	 */
	module.exports = function(req, res) {

		RecordGoose.findById(req.params.gameId, {_id:1, time:1, turns:1, users:1, cards:1}, res.apiOut);

	};

}());