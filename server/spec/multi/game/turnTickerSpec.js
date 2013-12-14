describe('game/turnTicker', function() {

	var TurnTicker = require('../../../multi/game/turnTicker');


	it('should move to the next player when a turn is ended', function() {

		var tt = new TurnTicker([{_id:1}, {_id:2}], 100);

		tt.nextTurn();
		expect(tt.activePlayers[0]._id).toBe(1);

		tt.nextTurn();
		expect(tt.activePlayers[0]._id).toBe(2);

		tt.nextTurn();
		expect(tt.activePlayers[0]._id).toBe(1);
	});


	it('should time out a turn', function(done) {
		var tt = new TurnTicker([{_id:1}, {_id:2}], 1);

		tt.nextTurn(function(elapsed) {
			expect(tt.activePlayers.length).toBe(0);
			expect(elapsed).toBeTruthy();
			done();
		});

		expect(tt.activePlayers.length).toBe(1);
	});
});