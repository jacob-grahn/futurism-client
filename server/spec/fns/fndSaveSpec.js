describe('fndSave', function() {

	var mongoose = require('mongoose');
	var mockgoose = require('mockgoose');
	mockgoose(mongoose);

	var fndSave = require('../../fns/fndSave');
	var TestModel = require('../../models/test');


	it('should create a new test document if none exists', function(done) {
		var data = {_id: 15, value: 'summer'};

		fndSave(TestModel, data, function(err, doc) {
			expect(err).toBe(null);
			expect(doc.value).toBe('summer');
			done();
		})
	});

});