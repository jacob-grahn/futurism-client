'use strict';

var Stats = require('../models/stats');


module.exports = {


	// create a new stats document if you don't have one
	post: function(req, res) {
		Stats.findByIdAndSave({_id: req.session._id}, function(err, stats) {
			if(err) {
				return res.apiOut(err);
			}
			res.apiOut(null, stats);
		});
	},


	// get a user's stats document
	get: function(req, res) {
		Stats.findById(req.params.userId, function(err, stats) {
			if(err) {
				return res.apiOut(err);
			}
			if(!stats) {
				return res.apiOut({code: 404, message: 'Stats not found'});
			}
			res.apiOut(null, stats);
		});
	}

};