describe('game/victoryCondition', function() {

	var VictoryCondition = require('../../../multi/game/victoryCondition');
	var Board = require('../../../multi/game/board');


	describe('commanderRules', function() {


		it('should return no winner if no players are passed in', function() {
			expect(VictoryCondition.commanderRules([]).winner).toBe(false);
		});


		it('should return no winner if more than one team has a living commander', function() {
			var players = [
				{_id:1, team:1, commander: {health: 7}},
				{_id:2, team:2, commander: {health: 14}}
			];

			var board = new Board(players, 2, 2);

			expect(VictoryCondition.commanderRules(players, board).winner).toBe(false);
		});


		it('should return a winner if that team is the only one with a commander left', function() {
			var players = [
				{_id:1, team:1, commander: {health: 1}},
				{_id:2, team:1, commander: {health: 0}},
				{_id:3, team:2, commander: {health: 0}},
				{_id:4, team:2, commander: {health: 0}}
			];

			var board = new Board(players, 2, 2);

			var result = VictoryCondition.commanderRules(players, board);
			expect(result.winner).toBe(true);
			expect(result.team).toBe(1);
		});
	});

});