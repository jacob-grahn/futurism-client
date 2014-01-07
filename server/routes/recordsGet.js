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

		if(req.body.gameId) {
			RecordGoose.findById(req.body.gameId, res.apiOut);
		}

		else {
			RecordGoose.find({}, {}, {sort: {time: -1}}).limit(10).exec(res.apiOut);
		}

	};

}());