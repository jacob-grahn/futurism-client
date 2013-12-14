describe('game/victoryCondition', function() {

	var VictoryCondition = require('../../../multi/game/victoryCondition');
	var Board = require('../../../multi/game/board');


	describe('commanderRules', function() {


		it('should return no winner if no players are passed in', function() {
			expect(VictoryCondition.commanderRules([]).winner).toBe(false);
		});


		it('should return no winner if there is not yet a winner', function() {
			var players = [{_id:1, team:1},{_id:2, team:2}];
			var rules = {columns: 2, rows: 2};

			var board = new Board(players, rules);
			board.target(1,0,0).card = {commander: true};
			board.target(2,0,0).card = {commander: true};

			expect(VictoryCondition.commanderRules(players, board).winner).toBe(false);
		});


		it('should return a winner if that team is the only one with a commander left', function() {
			var players = [
				{_id:1, team:1},
				{_id:2, team:1},
				{_id:3, team:2},
				{_id:4, team:2}
			];
			var rules = {columns: 2, rows: 2};

			var board = new Board(players, rules);
			board.target(1,0,0).card = {commander: true};
			board.target(2,0,0).card = {commander: false};
			board.target(4,0,0).card = {commander: false};

			var result = VictoryCondition.commanderRules(players, board);
			expect(result.winner).toBe(true);
			expect(result.team).toBe(1);
		});
	});

});