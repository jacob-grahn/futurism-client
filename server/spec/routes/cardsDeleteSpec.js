describe('cards-delete', function() {

	var mongoose = require('mongoose');
	var mockgoose = require('mockgoose');
	mockgoose(mongoose);
	var async = require('async');
	var groups = require('../../../shared/groups');
	var factions = require('../../../shared/factions');
	var CardGoose = require('../../models/card');
	var cardsDelete = require('../../routes/cardsDelete');
	var fns = require('../../fns/fns');

	var cardId;


	beforeEach(function(done) {
		CardGoose.create({
			_id: '35-asdfj',
			userId: 1,
			abilities: [],
			name: 'Gandoki',
			attack: 1,
			health: 1,
			faction: factions.machine.id
		},
		function(err, card) {
			if(err) {
				throw err;
			}
			done();
		});
	});


	afterEach(function() {
		mockgoose.reset();
	});


	it('should delete a card if you own it', function(done) {
		var request = {
			session: {
				userId: 1
			},
			user: {
				group: groups.USER
			},
			body: {
				cardId: '35-asdfj'
			}
		};
		cardsDelete(request, {apiOut: function(err, result) {
			expect(err).toBe(null);
			expect(result.name).toBe('Gandoki');
			done();
		}});
	});


	it('should not delete a card if you are not a mod and you do not own it', function(done) {
		var request = {
			session: {
				userId: 2
			},
			user: {
				group: groups.USER
			},
			body: {
				cardId: '35-asdfj'
			}
		};
		cardsDelete(request, {apiOut: function(err, result) {
			expect(err).toBe('card not found');
			expect(result).toBeFalsy();
			done();
		}});
	});


	it('mods can delete cards they do not own', function(done) {
		var request = {
			session: {
				userId: 5
			},
			user: {
				group: groups.MOD
			},
			body: {
				cardId: '35-asdfj'
			}
		};
		cardsDelete(request, {apiOut: function(err, result) {
			expect(err).toBe(null);
			expect(result.name).toBe('Gandoki');
			done();
		}});
	});

});