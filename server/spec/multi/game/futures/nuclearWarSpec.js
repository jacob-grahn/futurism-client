'use strict';

var nuclearWar = require('../../../../../server/multi/game/futures/nuclearWar');
var futures = require('../../../../../shared/futures');
var actions = require('../../../../../shared/actions');
var sinon = require('sinon');
var _ = require('lodash');


describe('futures/nuclearWar', function() {

	var targets, game;

	beforeEach(function() {
		targets = [
			{card: {health: 5}},
			{card: {health: -1}}
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


	describe('nuke', function() {
		it('should do 1 damage to every card and broadcast an event', function() {
			nuclearWar.nuke(game);
			expect(targets[0].card.health).toBe(4);
			expect(targets[1].card.health).toBe(-2);
			expect(game.broadcastChanges.calledWith(futures.NUCLEAR_WAR)).toBe(true);
		});
	});


	describe('onChange', function() {

		beforeEach(function() {
			sinon.stub(nuclearWar, 'nuke');
		});

		afterEach(function() {
			nuclearWar.nuke.restore();
		});

		it('should call nuke if the event is an attack', function() {
			var game = {};
			var actionList = [actions.ATTACK, actions.ASSASSIN, actions.FERVENT, actions.SIPHON, actions.PRECISION];
			_.each(actionList, function(action) {
				nuclearWar.onChange(game, action);
				expect(nuclearWar.nuke.calledWith(game)).toBe(true);
				nuclearWar.nuke.reset();
			});
		});

		it('should not do anything if the event is not an attack', function() {
			var game = {};
			var actionList = [actions.HEAL, 1, -1, null, undefined, 'stringzz', [1,2,3], {object: true}];
			_.each(actionList, function(action) {
				nuclearWar.onChange(game, action);
				expect(nuclearWar.nuke.callCount).toBe(0);
				nuclearWar.nuke.reset();
			});
		});
	});

});