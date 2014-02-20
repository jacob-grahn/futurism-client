'use strict';

var request = require('request');


var globe = {

	saveReport: function(userId, report, callback) {
		if(!callback) {
			callback = function() {};
		}

		var options = {
			form: {
				userId: userId,
				report: report,
				key: process.env.GLOBE_KEY
			}
		};
		console.log('sending', options);

		request.post(process.env.GLOBE_URI+'/reports', options, function(err, response, body) {
			if(err) {
				return callback(err);
			}
			if(!body) {
				return callback('no reply from globe');
			}

			body = JSON.parse(body);

			if(body.error) {
				return callback('globe error: ' + JSON.stringify(body.error));
			}

			return callback(null);
		});
	}

};

module.exports = globe;