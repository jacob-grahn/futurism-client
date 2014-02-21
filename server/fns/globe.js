'use strict';

var request = require('request');


var globe = {

	saveReport: function(userId, report, callback) {
		if(!callback) {
			callback = function() {};
		}

		var options = {
			form: {
				app: process.env.APP_NAME,
				userId: userId,
				report: report,
				key: process.env.GLOBE_KEY
			}
		};

		request.post(process.env.GLOBE_URI+'/reports', options, function(err, response, body) {
			if(err) {
				return callback(err);
			}
			if(!body) {
				return callback('no reply from globe');
			}

			body = JSON.parse(body);

			if(body.error) {
				return callback('globe error: ' + JSON.stringify(body));
			}

			return callback(null);
		});
	}

};

module.exports = globe;