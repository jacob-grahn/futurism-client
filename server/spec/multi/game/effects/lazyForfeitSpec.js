var lazyForfeit = require('../../../../../server/multi/game/effects/lazyForfeit');
var sinon = require('sinon');

describe('effects/lazyForfeit', function() {


	it('should reset actions performed to 0', function() {
		var player = {_id: 1, actionsPerformed: 45};

		var game = {
			turnOwners: [player]
		};

		lazyForfeit.lazyForfeit(game);

		expect(player.actionsPerformed).toEqual(0);
	});


	it('should set idleTurns to 0 if actionsPerformed is not 0', function() {
		var player = {_id: 1, actionsPerformed: 45};

		var game = {
			turnOwners: [player]
		};

		lazyForfeit.lazyForfeit(game);

		expect(player.idleTurns).toEqual(0);
	});


	it('should increment idleTurns if actionsPerformed is 0', function() {
		var player = {_id: 1, actionsPerformed: 0};

		var game = {
			turnOwners: [player]
		};

		lazyForfeit.lazyForfeit(game);

		expect(player.idleTurns).toEqual(1);
	});


	it('should forfeit for the player if idleTurns reaches 2', function() {
		var player = {_id: 1, idleTurns: 1};

		var game = {
			turnOwners: [player],
			forfeit: sinon.spy()
		};

		lazyForfeit.lazyForfeit(game);

		expect(player.idleTurns).toEqual(2);
		expect(game.forfeit.getCall(0).args[0]).toEqual(player);
	});
});
