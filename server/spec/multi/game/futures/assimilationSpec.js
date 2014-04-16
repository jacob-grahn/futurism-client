var abilities = require('../../../../../shared/actions');
var factions = require('../../../../../shared/factions');
var assimilation = require('../../../../../server/multi/game/futures/assimilation');
var sinon = require('sinon');

describe('futures/assimilation', function() {

	var player1, targets, game;


	beforeEach(function() {
		player1 = {_id: 1};

		targets = [
			{card: {}},
			{card: {faction: factions.machine.id}},
			{card: {faction: factions.elite.id}}
		];

		game = {
			TURN_END: 'turnEnd',
			board: {
				allTargets: function() {
					return targets;
				}
			},
			broadcastChanges: sinon.spy()
		};
	});


	describe('assimilate', function() {

		it('should turn all cards into machines', function() {
			assimilation.assimilate(game);
			expect(targets[0].card).toEqual({faction: factions.machine.id, assimilated: true, originalFaction: undefined});
			expect(targets[1].card).toEqual({faction: factions.machine.id});
			expect(targets[2].card).toEqual({faction: factions.machine.id, assimilated: true, originalFaction: factions.elite.id});
		});
	});


	describe('unassimilate', function() {

		it('should restore assimilated cards to their original faction', function() {
			assimilation.assimilate(game);
			assimilation.unassimilate(game);
			expect(targets[0].card).toEqual({faction: undefined});
			expect(targets[1].card).toEqual({faction: factions.machine.id});
			expect(targets[2].card).toEqual({faction: factions.elite.id});
		});
	});
});
