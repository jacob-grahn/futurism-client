var aresRises = require('../../../../../server/multi/game/futures/aresRises');
var factions = require('../../../../../shared/factions');
var sinon = require('sinon');

describe('futures/aresRises', function() {

	var game, targets;


	beforeEach(function() {

		targets = [
			{card: {faction: factions.zealot.id}},
			{card: {faction: factions.machine.id}}
		];

		game = {
			board: {
				allTargets: function() {
					return targets;
				}
			},

			broadcastChanges: sinon.spy()
		};
	});


	it('buf zealots based on how many deaths there are', function() {
		var data = {
			deaths: [{},{}]
		};

		aresRises.rallyDead(game, 'death', null, data);

		expect(targets[0].card.attackBuf).toBe(2);
		expect(targets[1].card.attackBuf).toBe(undefined);
	});
});
