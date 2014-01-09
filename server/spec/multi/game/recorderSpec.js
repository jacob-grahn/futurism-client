describe('recorder', function() {

	var mongoose = require('mongoose');
	var mockgoose = require('mockgoose');
	mockgoose(mongoose);

	var RecordGoose = require('../../../models/record');
	var Recorder = require('../../../multi/game/recorder');

	var r, gameId;


	beforeEach(function() {
		r = new Recorder();
		gameId = '123';
	});


	afterEach(function() {
		mockgoose.reset();
	});


	describe('save', function() {

		it('should write a record to mongo', function(done) {

			r.users = [
				{
					_id: 1,
					oldElo: 50,
					elo: 52,
					oldFame: 544,
					fame: 545,
					oldFractures: 13,
					fractures: 14,
					deck: [],
					extra: 'hi'
				},
				{
					_id: 2,
					elo: 60,
					fame: 6729,
					deck: [],
					unrelated: 'bla bla bla'
				}
			];
			r.time = new Date();
			r.turns = 83;
			r.actions = [{id: 'tree'}];

			r.save(gameId, function(err, result) {
				expect(err).toBe(null);

				RecordGoose.findById(gameId, function(err, doc) {
					expect(err).toBeFalsy();
					expect(doc).toBeTruthy();
					if(doc) {
						expect(doc.users[0]._id).toBe(1);
						expect(doc.users[0].oldElo).toBe(50);
						expect(doc.turns).toBe(83);
					}
					done();
				});
			});
		});
	});

});