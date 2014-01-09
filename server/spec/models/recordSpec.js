describe('record', function () {

	var mongoose = require('mongoose');
	var mockgoose = require('mockgoose');
	mockgoose(mongoose);

	var RecordGoose = require('../../models/record');


	beforeEach(function () {

	});

	afterEach(function () {
		mockgoose.reset();
	});


	it('should insert a valid document', function () {
		RecordGoose.create({
			_id: 'Zn5hVVrpX3kj',
			time: new Date(),
			lastSeen: new Date(),
			turns: 11,
			duration: 89000,
			users: [{
				_id: '111',
				name: 'Bob',
				site: 'g',
				group: 'm',
				elo: 100,
				oldElo: 90,
				fame: 2000,
				oldFame: 1000,
				fractures: 1,
				oldFractures: 0,
				deck: {
					name: 'Awesome Deck',
					cards: ['card1', 'card2']
				}
			}],
			cards: [{
				_id: 'card1',
				name: 'Card 1',
				faction: 'en',
				attack: 2,
				health: 3,
				story: 'once upon a time...',
				abilities: ['tree', 'heal']
			}],
			actions: [{
				id: 'attk',
				p: 45641,
				x: 0,
				y: 2
			}]
		}, function(err, result) {
			expect(err).toBe(null);
			expect(result).toBeTruthy();
		});
	});


	it('should not insert an invalid document', function() {
		RecordGoose.create({
			_id: 'Zn5hVVrpX3kj',
			time: new Date(),
			lastSeen: new Date(),
			turns: 11,
			duration: 89000,
			users: [{
				_id: '111',
				name: 'Bob',
				site: 'g',
				group: 'm',
				elo: 100,
				oldElo: 90,
				fame: 2000,
				oldFame: 1000,
				fractures: 1,
				oldFractures: 0,
				deck: {
					name: 'Awesome Deck',
					cards: ['card1', 'card2']
				}
			}],
			cards: 'Hi gues!',
			actions: [{
				id: 'attk',
				p: 45641,
				x: 0,
				y: 2
			}]
		}, function(err) {
			expect(err).not.toBe(null);
		});
	});
});