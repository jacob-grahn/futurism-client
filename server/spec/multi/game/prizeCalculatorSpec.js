describe('game/prizeCalculator', function() {

	var mongoose = require('mongoose');
	var mockgoose = require('mockgoose');
	mockgoose(mongoose);

	var UserGoose = require('../../../models/stats');
	var PrizeCalculator = require('../../../multi/game/prizeCalculator');
	var Elo = require('../../../fns/elo');


	var uid1, uid2, uid3;

	beforeEach(function(done) {

		uid1 = mongoose.Types.ObjectId();
		uid2 = mongoose.Types.ObjectId();
		uid3 = mongoose.Types.ObjectId();

		UserGoose.create({
			_id: uid1,
			name: 'Kronk',
			site: 'j',
			group: 'm',
			elo: 150,
			fame: 0,
			fractures: 0
		},
		function(err) {
			if(err) {
				throw err;
			}


			UserGoose.create({
				_id: uid2,
				name: 'Blazer',
				site: 'j',
				group: 'm',
				elo: 549,
				fame: 974256,
				fractures: 52
			},
			function(err) {
				if(err) {
					throw err;
				}


				UserGoose.create({
					_id: uid3,
					name: 'Awful',
					site: 'j',
					group: 'm',
					elo: 13,
					fame: 9765,
					fractures: 2
				},
				function(err) {
					if(err) {
						throw err;
					}
					done();
				});
			});
		});
	});


	afterEach(function() {
		mockgoose.reset();
	});


	it('should callback immediately if no players are passed in', function(done) {
		var players = [];
		var winningTeam = 0;
		var prize = false;
		PrizeCalculator.run(players, winningTeam, prize, function(err, users) {
			expect(err).toBeFalsy();
			expect(users.length).toBe(0);
			done();
		});
	});


	it('should drop players that do not exist in the db', function(done) {
		var players = [{_id:uid3}, {_id:mongoose.Types.ObjectId()}];
		var winningTeam = 0;
		var prize = false;
		PrizeCalculator.run(players, winningTeam, prize, function(err, users) {
			expect(err).toBeFalsy();
			expect(users.length).toBe(1);
			done();
		});
	});


	it('should return the updated UserGooses', function(done) {
		var players = [{_id:uid1}];
		var winningTeam = 0;
		var prize = false;
		PrizeCalculator.run(players, winningTeam, prize, function(err, users) {
			expect(err).toBeFalsy();
			expect(users[0]._id).toEqual(uid1);
			done();
		});
	});


	it('should calculate new elo ratings for 1v1 matches', function(done) {
		var eloA = 13;
		var eloB = 150;
		var winsA = 1;
		var winsB = 0;
		var eloResult = Elo.calcChange(eloA, eloB, winsA, winsB);

		var players = [{_id:uid3, team:1}, {_id:uid1, team:2}];
		var winningTeam = 1;
		var prize = true;
		PrizeCalculator.run(players, winningTeam, prize, function(err, users) {
			expect(err).toBeFalsy();
			expect(players[0].elo).toBe(eloResult.a);
			expect(players[1].elo).toBe(eloResult.b);
			done();
		});
	});


	it('should increase fame', function(done) {
		var eloA = 549;
		var eloB = 150;
		var winsA = 1;
		var winsB = 0;
		var eloResult = Elo.calcChange(eloA, eloB, winsA, winsB);
		var fameA = 974256 + eloResult.a - eloA + PrizeCalculator.BASE_FAME_GAIN;
		var fameB = 0 + PrizeCalculator.BASE_FAME_GAIN;

		var players = [{_id:uid2, team:1}, {_id:uid1, team:2}];
		var winningTeam = 1;
		var prize = true;
		PrizeCalculator.run(players, winningTeam, prize, function(err, users) {
			expect(err).toBeFalsy();
			expect(players[0].fame).toBe(fameA);
			expect(players[1].fame).toBe(fameB);
			done();
		});
	});


	it('should award a fracture to the winners', function(done) {
		var players = [{_id:uid1, team:1}, {_id:uid3, team:1}, {_id:uid2, team:2}];
		var winningTeam = 1;
		var prize = true;
		PrizeCalculator.run(players, winningTeam, prize, function(err, users) {
			expect(err).toBeFalsy();
			expect(users.length).toBe(3);
			expect(players[0].fractures - players[0].oldFractures).toBe(1);
			expect(players[1].fractures - players[1].oldFractures).toBe(1);
			expect(players[2].fractures - players[2].oldFractures).toBe(0);
			done();
		});
	});


	it('should save changes to the db', function(done) {
		var players = [{_id:uid3, team:1}, {_id:uid2, team:2}];
		var winningTeam = 1;
		var prize = true;
		PrizeCalculator.run(players, winningTeam, prize, function(err, users) {
			expect(err).toBeFalsy();
			UserGoose.findById(uid3, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.fractures).toBe(3);
				expect(doc.fame > 9765).toBe(true);
				done();
			});
		});
	});

});