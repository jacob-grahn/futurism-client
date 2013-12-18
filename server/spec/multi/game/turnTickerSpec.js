describe('game/turnTicker', function() {

	var TurnTicker = require('../../../multi/game/turnTicker');


	it('should move to the next player when a turn is ended', function() {
		var player1 = {_id:1};
		var player2 = {_id:2};
		var tt = new TurnTicker([player1, player2], 100);

		tt.endTurn();
		expect(tt.isTheirTurn(player1)).toBe(true);
		expect(tt.isTheirTurn(player2)).toBe(false);

		tt.endTurn();
		expect(tt.isTheirTurn(player1)).toBe(false);
		expect(tt.isTheirTurn(player2)).toBe(true);

		tt.endTurn();
		expect(tt.isTheirTurn(player1)).toBe(true);
		expect(tt.isTheirTurn(player2)).toBe(false);
	});


	it('should time out a turn', function(done) {
		var player1 = {_id:1};
		var player2 = {_id:2};
		var tt = new TurnTicker([player1, player2], 1, function(elapsed) {
			expect(elapsed).toBeTruthy();
			done();
		});
	});
});