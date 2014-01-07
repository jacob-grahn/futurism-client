describe('records - get', function() {

	var mongoose = require('mongoose');
	var mockgoose = require('mockgoose');
	mockgoose(mongoose);

	var recordsGet = require('../../routes/recordsGet');
	var RecordGoose = require('../../models/record');



	beforeEach(function(done) {


		RecordGoose.create({
			_id: '123',
			time: new Date(1000),
			turns: 7,
			players: [
				{_id: 1, name: 'Sally', deck: []},
				{_id: 2, name: 'Biff', deck: []}
			],
			actions: [
				{id: 'tree', pos: '3743,1,0'},
				{id: 'tree', pos: '2,1,0'}
			]
		}, function(err) {
			if(err) {
				throw err;
			}


			RecordGoose.create({
				_id: '124',
				time: new Date(8000),
				turns: 96,
				players: [
					{_id: 3, name: 'Waldo', deck: []},
					{_id: 4, name: 'Zakaa', deck: []}
				],
				actions: [
					{id: 'tree', pos: '3743,1,0'},
					{id: 'tree', pos: '2,1,0'}
				]
			}, function(err) {
				if(err) {
					throw err;
				}
				done();
			});
		});
	});


	afterEach(function() {
		mockgoose.reset();
	});


	it('should return a list of most recent records', function(done) {
		var request = {
			body: {}
		};
		recordsGet(request, {apiOut: function(err, result) {
			expect(err).toBeFalsy();
			expect(result[0]._id).toBe('124');
			expect(result[1]._id).toBe('123');
			done();
		}});
	});


	it('should return a specific record', function(done) {
		var request = {
			body: {
				gameId: '123'
			}
		};
		recordsGet(request, {apiOut: function(err, result) {
			expect(err).toBeFalsy();
			expect(result._id).toBe('123');
			done();
		}});
	});


});