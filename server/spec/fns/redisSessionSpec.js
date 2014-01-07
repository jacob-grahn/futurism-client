describe('redisSession', function() {

	/*var redis = require("redis-mock");
	var redisSession = require('../../fns/redisSession');
	var client = redis.createClient();
	var token;

	client.setex = function(key, life, value, cb) {
		client.set(key, value, cb);
	};
	redisSession.setRedis(client);


	it('should create a new session', function(done) {
		redisSession.make({name:'Sue'}, function(err, result) {
			expect(err).toBe(null);
			expect(result.result).toBe('OK');
			token = result.token;
			done();
		});
	});


	it('should retrieve data from that session', function(done) {
		redisSession.get(token, function(err, result) {
			expect(err).toBe(null);
			expect(result.name).toBe('Sue');
			done();
		});
	});


	it('should delete data', function(done) {
		redisSession.destroy(token, function(err, result) {
			expect(err).toBe(null);
			expect(result).toBe(1);
			done();
		})
	});*/

});