'use strict';

var anarchy = require('../../../../../server/multi/game/futures/anarchy');
var futures = require('../../../../../shared/futures');
var actions = require('../../../../../shared/actions');
var sinon = require('sinon');


describe('futures/anarchy', function() {

	var cards, game;

	beforeEach(function() {
		game = {
			allCards: function() {
				return cards;
			},
			broadcastChanges: sinon.spy()
		};
	});


	describe('giveMove', function() {
		it('give move to cards without move', function() {
			cards = [
				{abilities: []},
				{abilities: [actions.HEAL]},
				{abilities: [actions.MOVE]}
			];
			anarchy.giveMove(game);
			expect(cards[0]).toEqual({abilities: [actions.MOVE], anarchy: true});
			expect(cards[1]).toEqual({abilities: [actions.HEAL, actions.MOVE], anarchy: true});
			expect(cards[2]).toEqual({abilities: [actions.MOVE]});
			expect(game.broadcastChanges.calledWith(futures.ANARCHY)).toBe(true);
		});
	});


	describe('removeMove', function() {
		it('should remove move only from cards that got that ability from anarchy', function() {
			cards = [
				{abilities: [actions.MOVE], anarchy: true},
				{abilities: [actions.HEAL, actions.MOVE], anarchy: true},
				{abilities: [actions.MOVE]}
			];
			anarchy.removeMove(game);
			expect(cards[0]).toEqual({abilities: []});
			expect(cards[1]).toEqual({abilities: [actions.HEAL]});
			expect(cards[2]).toEqual({abilities: [actions.MOVE]});
		});
	});

});