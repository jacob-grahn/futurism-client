describe('records - get', function() {

	var mongoose = require('mongoose');
	var mockgoose = require('mockgoose');
	mockgoose(mongoose);

	var summariesGet = require('../../routes/summariesGet');
	var RecordGoose = require('../../models/record');



	beforeEach(function(done) {
		RecordGoose.create({
			_id: '123',
			time: new Date(1000),
			turns: 7,
			users: [
				{_id: mongoose.Types.ObjectId(), name: 'Sally', deck: []},
				{_id: mongoose.Types.ObjectId(), name: 'Biff', deck: []}
			],
			actions: [
				{id: 'tree', pos: '3743,1,0'},
				{id: 'tree', pos: '2,1,0'}
			]
		}, function(err) {
			done(err);
		});
	});


	afterEach(function() {
		mockgoose.reset();
	});


	it('should return a specific summary', function(done) {
		var request = {
			params: {
				gameId: '123'
			}
		};
		summariesGet(request, {apiOut: function(err, result) {
			expect(err).toBeFalsy();
			expect(result._id).toBe('123');
			expect(result.users[0].name).toBe('Sally');
			expect(result.actions).toBeFalsy();
			done();
		}});
	});


});