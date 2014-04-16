var abilities = require('../../../../../shared/actions');
var eden= require('../../../../multi/game/futures/eden');
var board = require('../../../../../server/multi/game/board');
var sinon = require('sinon');

describe('futures/eden', function() {

	var player1, targets, game;


	beforeEach(function() {
		player1 = {_id: 1};

		targets = [
			{card: {_id: 'tree'}},
			{card: {_id: 'tree', health: 3}},
			{card: {_id: 'pants', health: 1}},
		];

		game = {
			ABILITY_DURING: 'abilityDuring',
			turnOwners: [player1],
			board: {
				playerTargets: function(playerId) {
					if(playerId === 1) {
						return targets;
					}
				}
			},
			broadcastChanges: sinon.spy()
		};
	});


	describe('healTrees', function() {


		it('should give trees +1 health', function() {
			eden.healTrees(game);
			expect(targets[0].card.health).toEqual(1);
			expect(targets[1].card.health).toEqual(4);
			expect(targets[2].card.health).toEqual(1);
		});
	});

});
