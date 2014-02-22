describe('cards-delete', function() {

	var mongoose = require('mongoose');
	var mockgoose = require('mockgoose');
	mockgoose(mongoose);
	var groups = require('../../../shared/groups');
	var factions = require('../../../shared/factions');
	var CardGoose = require('../../models/card');
	var cards = require('../../routes/cards');


	var userId1;

	beforeEach(function(done) {
		userId1 = mongoose.Types.ObjectId();
		CardGoose.create({
			_id: '35-asdfj',
			userId: userId1,
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
				_id: userId1
			},
			user: {
				group: groups.USER
			},
			params: {
				cardId: '35-asdfj'
			}
		};
		cards.del(request, {apiOut: function(err, result) {
			expect(err).toBe(null);
			expect(result.name).toBe('Gandoki');
			done();
		}});
	});


	it('should not delete a card if you are not a mod and you do not own it', function(done) {
		var request = {
			session: {
				_id: mongoose.Types.ObjectId()
			},
			user: {
				group: groups.USER
			},
			params: {
				cardId: '35-asdfj'
			}
		};
		cards.del(request, {apiOut: function(err, result) {
			expect(err).toBe('card not found');
			expect(result).toBeFalsy();
			done();
		}});
	});


	it('mods can delete cards they do not own', function(done) {
		var request = {
			session: {
				_id: mongoose.Types.ObjectId(),
				group: groups.MOD
			},
			params: {
				cardId: '35-asdfj'
			}
		};
		cards.del(request, {apiOut: function(err, result) {
			expect(err).toBe(null);
			expect(result.name).toBe('Gandoki');
			done();
		}});
	});

});