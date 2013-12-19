describe('mongoSession', function() {

	var mongoose = require('mongoose');
	var mockgoose = require('mockgoose');
	mockgoose(mongoose);

	var SessionGoose = require('../../models/session');
	var mongoSession = require('../../fns/mongoSession');


	it('should create a new session', function(done) {
		mongoSession.make({name:'Sue'}, function(err, result) {
			expect(err).toBe(null);
			expect(result.result.name).toBe('Sue');
			done();
		});
	});


	it('should retrieve data from that session', function(done) {
		var token = '11111111111111111111111111111111';

		SessionGoose.create(
			{_id:token, value:{name:'fluffy'}},
			function(err, doc) {

				mongoSession.get(token, function(err, result) {
					expect(err).toBe(null);
					expect(result.name).toBe('fluffy');
					done();
				}
			);
		});
	});


	it('should delete data', function(done) {

		var token = '11111111111111111111111111111111';

		SessionGoose.create(
			{_id:token, value:{name:'doomed'}},
			function(err, doc) {
				expect(doc.value.name).toBe('doomed');

				mongoSession.destroy(token, function(err, result) {
					expect(err).toBe(null);

					SessionGoose.findById(token, function(err, doc) {
						expect(err).toBe(null);
						expect(doc).toBe(null);
						done();
					});
				}
			);
		});
	});
});