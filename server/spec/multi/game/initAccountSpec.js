describe('initAccount', function() {

	var initAccount = require('../../../multi/game/initAccount');

	it('should set up an account for a game', function() {
		var account = {
			deck: {
				cards: [],
				pride: 0
			}
		};
		var rules = {
			columnCount: 5,
			rowCount: 2
		};

		initAccount(account, rules, 'gameId-100');

		expect(account.columns.length).toBe(5);
		expect(account.columns[0].length).toBe(2);
		expect(account.hand.length).toBe(0);
		expect(account.graveyard.length).toBe(0);
	});
});