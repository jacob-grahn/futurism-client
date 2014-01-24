/* global describe, it, expect, afterEach */

'use strict';

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var validatedUpdate = require('../../../../server/fns/mongoose/validatedUpdate');
var _ = require('lodash');


var TestSchema = new mongoose.Schema({
	_id: {
		type: Number
	},
	value: {
		type: Number
	},
	contacts: {
		type: [String],
		validate: function(val) {
			var pass = true;
			_.each(val, function(str) {
				if(str.length > 3) {
					pass = false;
				}
			});
			return pass;
		}
	}
});

var Test = mongoose.model('ValidatedUpdateTest', TestSchema);


afterEach(function() {
	mockgoose.reset();
});


describe('validatedUpdate', function() {


	it('should return an error if validation fails', function(done) {
		validatedUpdate(Test, {_id: 3}, {value: 'I am a string'}, {}, function(err) {
			expect(err).toBeTruthy();
			done();
		});
	});


	// nested validation with arrays doesn't work, write looping validation functions at the root level instead
	it('should return an error if nested validation fails', function(done) {
		validatedUpdate(Test, {_id: 5}, {_id: 5, contacts: ['longname', 'bob']}, {}, function(err) {
			expect(err).toBeTruthy();
			done();
		});
	});


	it('should update a document if validation passes', function(done) {
		Test.create({_id: 55, value: 2}, function(err, doc) {
			expect(err).toBeFalsy();
			expect(doc.value).toBe(2);

			validatedUpdate(Test, {_id: 55}, {value:3}, {}, function(err) {
				expect(err).toBeFalsy();

				Test.findById(55, function(err, doc) {
					expect(doc.value).toBe(3);
					done();
				});
			});
		});
	});


	it('should accept the upsert option', function(done) {
		validatedUpdate(Test, {_id: 5}, {_id: 5, contacts: ['sue', 'bob']}, {upsert: true}, function(err, num) {
			expect(err).toBeFalsy();
			expect(num).toBe(1);

			Test.findById(5, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.toObject()).toEqual({_id: 5, contacts: ['sue', 'bob']});
				done();
			});
			done();
		});
	});


	it('should add shortcut method to model', function(done) {
		validatedUpdate.attach(mongoose);
		Test.validatedUpdate({_id: 5}, {value: 13}, {}, function(err, num) {
			expect(err).toBeFalsy();
			expect(num).toBe(0);
			done();
		});
	});
});