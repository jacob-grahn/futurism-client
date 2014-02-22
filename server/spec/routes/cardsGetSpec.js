describe('cards-get', function() {
	'use strict';

	var mongoose = require('mongoose');
	var mockgoose = require('mockgoose');
	mockgoose(mongoose);
	var factions = require('../../../shared/factions');
	var cards = require('../../routes/cards');
	var CardGoose = require('../../models/card');


	var userId1 = mongoose.Types.ObjectId();
	var userId2 = mongoose.Types.ObjectId();

	beforeEach(function(done) {
		CardGoose.create({
				_id: '1-blah',
				userId: userId1,
				abilities: [],
				name: 'LoadMe',
				attack: 1,
				health: 1,
				faction: factions.machine.id
			},
			function(err, card) {
				if(err) {
					return done(err);
				}

				CardGoose.create({
						_id: '2-canon',
						userId: userId2,
						abilities: [],
						name: 'CanonIAm',
						attack: 1,
						health: 1,
						faction: factions.machine.id,
						canon: true
					},
					function(err, card) {
						if(err) {
							return done(err);
						}
						done();
					});
			});
	});


	afterEach(function() {
		mockgoose.reset();
	});


	it('should load a card', function(done) {
		var request = {
			session: {
				_id: userId1
			},
			params: {
				cardId: '1-blah'
			}
		};
		cards.get(request, {apiOut: function(err, result) {
			if(err) {
				return done(err);
			}
			expect(err).toBe(null);
			expect(result.name).toBe('LoadMe');
			done();
		}});
	});


	// something with pagination idunno
	/*it('should load a list of cards by owner', function(done) {
		var request = {
			session: {
				_id: userId1
			},
			params: {},
			body: {}
		};
		cards.getList(request, {apiOut: function(err, result) {
			if(err) {
				return done(err);
			}
			expect(result.length).toBe(1);
			expect(result[0].name).toBe('LoadMe');
		}});
	});*/



	// mockgoose does not support the $or operator
	/*it('should load a list by owner mixed with a list by canon', function(done) {
		var request = {
			session: {
				_id: userId1
			},
			body: {
				canon: true
			}
		};
		cards.get(request, {apiOut: function(err, result) {
			expect(err).toBe(null);
			expect(result.length).toBe(2);
			done();
		}});
	});*/

});