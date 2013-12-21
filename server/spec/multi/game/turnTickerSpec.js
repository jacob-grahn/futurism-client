describe('game/turnTicker', function() {

	var TurnTicker = require('../../../multi/game/turnTicker');


	it('should move to the next player when a turn is ended', function() {
		var player1 = {_id:1};
		var player2 = {_id:2};
		var tt = new TurnTicker([player1, player2], 100);
		tt.start();

		tt.endTurn();
		expect(tt.isTheirTurn(player1)).toBe(true);
		expect(tt.isTheirTurn(player2)).toBe(false);

		tt.endTurn();
		expect(tt.isTheirTurn(player1)).toBe(false);
		expect(tt.isTheirTurn(player2)).toBe(true);

		tt.endTurn();
		expect(tt.isTheirTurn(player1)).toBe(true);
		expect(tt.isTheirTurn(player2)).toBe(false);

		tt.stop();
	});


	it('should time out a turn', function(done) {
		var player1 = {_id:1};
		var player2 = {_id:2};
		var tt = new TurnTicker([player1, player2], 1);
		tt.start(function(elapsed) {
			expect(elapsed).toBeTruthy();
			tt.stop();
			done();
		});
	});


	it('should callback when a turn has ended', function(done) {
		var player1 = {_id:1};
		var player2 = {_id:2};
		var tt = new TurnTicker([player1, player2], 30000);
		tt.start(function(elapsed, turnOwners) {
			expect(tt.turn).toBe(1);
			tt.stop();
			done();
		});
		tt.endTurn();
	});
});