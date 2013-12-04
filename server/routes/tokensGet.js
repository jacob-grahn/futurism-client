(/**
 * Create a session for a user based on their login status with other sites
 * Returns a token that can be used to continue this session for future requests
 * @param futurismServer
 */

function() {
	'use strict';

	var request = require('request');
	var fns = require('../fns/fns');
	var session = require('../fns/session');
	var fndSave = require('../fns/fndSave');
	var async = require('async');
	var User = require('../models/user');
	var groups = require('../../shared/groups');


	module.exports = function(req, res) {

		var verifiedData;
		var body;


		async.series([


			//--- send credentials to GameHub server to verify they are real
			function(callback) {
				try {
					var data = JSON.parse(req.query.user);
				}
				catch (e) {
					return callback(e);
				}

				data.ip = fns.getIp(req);
				data.game = 'futurism';
				data.pass = process.env.GAMEHUB_KEY;
				data.max_width = 0;
				data.max_height = 0;
				if(data.site == 'g') {
					data.user_id = data.guest_user_id;
					data.user_name = data.guest_user_name;
				}

				var authUrl = 'http://gamehub.jiggmin.com/login.php?' + fns.objToUrlParams(data);
				request(authUrl, function(err, resp, bod) {
					body = bod;
					return callback(err);
				});
			},


			//--- parse the incoming data from GameHub
			function(callback) {
				try {
					verifiedData = JSON.parse(body);
				}
				catch (e){
					return callback(e);
				}

				if(process.env.NODE_ENV === 'staging') {
					if(!params.beta) {
						return callback('You must be a member of our Beta Testers to access this.');
					}
				}

				return callback(null);
			},


			//--- save the user in the db
			function(callback) {
				var v = verifiedData;
				v.group = powerToGroup(v.power);
				fndSave(User, {
					_id: v.user_id,
					name: v.user_name,
					group: v.group,
					site: v.site
				}, callback);
			},


			//--- start the session
			function(callback) {
				var v = verifiedData;
				session.make({userId: v.user_id}, callback);
			}
		],


		//--- tell it to the world
		function(err, results) {
			if(err) {
				return res.apiOut(err, null);
			}

			verifiedData.token = results[3].token;
			return res.apiOut(null, verifiedData);
		});


		/**
		 * Convert power (0-3) to group (g,u,m,a)
		 * The gamehub login system assigns a power to users. Higher power = more moderator privileges
		 * Futurism uses groups to do the same thing, so this function turns gamehub powers into futurism groups
		 * @param {number} power
		 * @returns {string}
		 */
		var powerToGroup = function(power) {
			var group = groups.GUEST;
			if(power === 1) {
				group = groups.USER;
			}
			if(power === 2) {
				group = groups.MOD;
			}
			if(power === 3) {
				group = groups.ADMIN;
			}
			return group;
		};
	};


}());