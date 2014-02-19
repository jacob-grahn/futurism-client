describe('game/victoryCondition', function() {

	var VictoryCondition = require('../../../multi/game/victoryCondition');
	var Board = require('../../../multi/game/board');


	describe('commanderRules', function() {


		it('should return no winner if no players are passed in', function() {
			expect(VictoryCondition.commanderRules([]).winner).toBe(false);
		});


		it('should return no winner if more than one team has a living commander', function() {
			var players = [
				{_id:1, team:1, hand: [{commander: true}]},
				{_id:2, team:2, hand: [{commander: true}]}
			];

			var board = new Board(players, 2, 2);

			expect(VictoryCondition.commanderRules(players, board).winner).toBe(false);
		});


		it('should count commanders on the board or in the hand', function() {
			var players = [
				{_id:1, team:1, hand: []},
				{_id:2, team:2, hand: []}
			];

			var board = new Board(players, 2, 2);
			board.target(1,0,0).card = {commander: true};

			var result = VictoryCondition.commanderRules(players, board);
			expect(result.winner).toBe(true);
			expect(result.team).toBe(1);
		});


		it('should return a winner if that team is the only one with a commander left', function() {
			var players = [
				{_id:1, team:1, hand: [{commander: true}]},
				{_id:2, team:1, hand: []},
				{_id:3, team:2, hand: []},
				{_id:4, team:2, hand: []}
			];

			var board = new Board(players, 2, 2);

			var result = VictoryCondition.commanderRules(players, board);
			expect(result.winner).toBe(true);
			expect(result.team).toBe(1);
		});
	});

});