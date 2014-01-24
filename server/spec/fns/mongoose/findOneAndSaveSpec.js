/* global describe, it, expect, afterEach */

'use strict';

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var findOneAndSave = require('../../../../server/fns/mongoose/findOneAndSave');


var TestSchema = new mongoose.Schema({
	_id: {
		type: Number
	},
	value: {
		type: Number
	},
	name: {
		type: String
	}
});

var Test = mongoose.model('findOneSaveTest', TestSchema);



afterEach(function() {
	mockgoose.reset();
});


describe('findOneAndSave', function() {

	it('should return the updated/created document on success', function(done) {
		findOneAndSave(Test, {_id: 7}, {_id: 7, value: 99}, function(err, doc) {
			expect(err).toBeFalsy();
			expect(doc.toObject()).toEqual({__v: 0, _id: 7, value: 99});
			done();
		});
	});


	it('should perform an insert if the document does not exist', function(done) {
		findOneAndSave(Test, {_id: 7}, {_id: 7, value: 99}, function() {
			Test.findOne(7, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.toObject()).toEqual({__v: 0, _id: 7, value: 99});
				done();
			});
		});
	});


	it('should perform an update if the document does exist', function() {
		Test.create({_id: 3, value: 50, name: 'bob'}, function(err, doc) {
			expect(err).toBeFalsy();
			expect(doc.value).toBe(50);
			expect(doc.name).toBe('bob');

			findOneAndSave(Test, {_id:3}, {_id: 3, value: 51}, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.value).toBe(51);
				expect(doc.name).toBe('bob');
			});
		});
	});


	it('should return an error if the document fails to save', function(done) {
		findOneAndSave(Test, {_id: 3}, {_id: 3, value: ['not', 'a', 'number']}, function(err) {
			expect(err).toBeTruthy();
			done();
		});
	});


	it('should extend mongoose model for easy access', function(done) {
		findOneAndSave.attach(mongoose);
		Test.findOneAndSave({_id: 7}, {_id: 7, value: 99}, function(err, doc) {
			expect(err).toBeFalsy();
			expect(doc.toObject()).toEqual({__v: 0, _id: 7, value: 99});
			done();
		});
	});

});