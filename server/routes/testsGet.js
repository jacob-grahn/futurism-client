(function() {
	'use strict';

	//var redis = require('../fns/redisCache').store;

	module.exports = function(req, res) {

		var async = require('async');
		var startTime = +new Date();


		var getElapsed = function() {
			var curTime = +new Date();
			var elapsed = curTime - startTime;
			return(elapsed + 'ms');
		};


		var redisTest = function(callback) {
			redis.set('testkey', 'pass!');
			redis.get('testkey', function(err, result) {
				return callback(err, result + ' ' + getElapsed());
			});
		};


		var mongoTest = function(callback) {
			var collection;
			async.waterfall([
				function(callback) {
					require('../fns/mongoConnect').connect(callback);
				},
				function(db, callback) {
					collection = db.collection('testdb');
					collection.update({_id:1}, {_id:1, val:'pass!'}, {upsert:true}, callback);
				},
				function(result, extra, callback) {
					collection.findOne({_id:1}, callback);
				}
			],
				function(err, result) {
					if(err) { return callback(err); }
					if(!result) { return callback('no mongo result'); }
					return callback(null, result.val + ' ' + getElapsed());
				});
		};


		var s3Test = function(callback) {
			var s3 = require('../fns/s3Connect')();
			async.series([
				function(callback) {
					s3.putObject({Key: 'test/file', Body: 'pass!', ContentType:'text/plain'}, callback);
				},
				function(callback) {
					s3.getObject({Key: 'test/file'}, callback);
				}
			],
				function(err, result) {
					if(err) { return callback(err); }
					var str = result[1].Body.toString();
					return callback(null, str + ' ' + getElapsed());
				});
		};


		async.parallel([redisTest, mongoTest, s3Test], function(err, results) {
			if(err) {
				res.apiOut(err, null);
			}

			var obj = {
				redis: results[0],
				mongo: results[1],
				s3: results[2]
			};

			res.apiOut(null, obj);
		});
	};

}());