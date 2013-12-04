describe('filters', function() {
	'use strict';

	var _ = require('lodash');
	var actions = require('../../../multi/game/actions.js');
	var target;
	var srcTarget;
	var emptyTarget;


	var user1 = {
		_id: 1,
		hand: [],
		graveyard: [],
		cardsToPlay: 0
	};

	var user2 = {
		_id: 2,
		hand: [],
		graveyard: [],
		cardsToPlay: 0
	};


	beforeEach(function() {
		target = {
			account: user1,
			columnNum: 0,
			rowNum: 0,
			card: {
				name: 'Bertha',
				_id: 1,
				abilities: ['zzzz', 'blah'],
				health: 2,
				attack: 3,
				tired: 0,
				shield: 0,
				poison: 0,
				attackBuf: 0
			}
		};
		srcTarget = {
			account: user2,
			columnNum: 0,
			rowNum: 1,
			card: {
				name: 'Sulu',
				_id: 1,
				abilities: ['piza', 'zzzz'],
				health: 3,
				attack: 1,
				tired: 0,
				shield: 0,
				poison: 0,
				attackBuf: 0
			}
		};
		emptyTarget = {
			card: null
		};

		var column = [target, srcTarget, emptyTarget];
		target.column = column;
		srcTarget.column = column;
		emptyTarget.column = column;
		user1.columns = [_.clone(column)];
		user2.columns = [_.clone(column)];
		user1.hand = [];
		user2.hand = [];
		user1.graveyard = user2.graveyard = [];
		user1.cardsToPlay = user2.cardsToPlay = 0;
	});


	//////////////////////////////////////////////////////////////////////////////////
	// ent
	//////////////////////////////////////////////////////////////////////////////////


	it('heal should increase health', function() {
		actions.heal.use(target);
		expect(target.card.health).toBe(3);
	});


	it('tree should grow a tree', function() {
		actions.tree.use(target);
		expect(target.card.title).toBe('TREE');
	});


	it('abom should join two cards together', function() {
		actions.abom.use(target, srcTarget);
		expect(target.card).toBe(null);
		expect(srcTarget.card.health).toBe(5);
		expect(srcTarget.card.attack).toBe(4);
		expect(srcTarget.card.abilities).toContain('zzzz', 'blah', 'piza')
	});


	it('secr should mark a card as tired', function() {
		actions.secr.use(target);
		expect(target.card.tired).toBe(1);
	});


	it('clne should clone another card', function() {
		actions.clne.use(target, srcTarget);
		expect(target.card.abilities).toEqual(srcTarget.card.abilities);
		expect(target.card.attack).toEqual(srcTarget.card.attack);
		expect(srcTarget.card.health).toEqual(3);
	});


	it('bees should hurt entire column', function() {
		actions.bees.use(target);
		expect(target.card.health).toBe(1);
		expect(srcTarget.card.health).toBe(2);
	});

	////////////////////////////////////////////////////////////////////////////////////////////
	// machine
	////////////////////////////////////////////////////////////////////////////////////////////

	it('rbld should return a dead to play with 1 health', function() {
		var card = {
			name: 'somecard'
		};
		user1.graveyard.push(card);
		var target = {
			account: user1,
			card: user1.graveyard[0]
		};
		var target2 = {
			account: user2,
			columnNum: 0,
			rowNum: 0
		};
		actions.rbld.use(target, null, target2);
		expect(user1.graveyard.length).toBe(0);
		expect(user2.columns[0][0]).toBe(card);
	});

	it('shld should protect a card for a turn', function() {
		actions.shld.use(target);
		expect(target.card.shield).toEqual(1);
	});


	it('prci should decrease health', function() {
		actions.prci.use(target, srcTarget);
		expect(target.card.health).toBe(1);
	});


	it('strt should git a card another turn', function() {
		actions.strt.use(target);
		expect(target.card.tired).toBe(-1);
	});


	it('netw should copy another targets abilities', function() {
		actions.netw.use(target, srcTarget);
		expect(srcTarget.card.abilities).toContain('zzzz', 'blah', 'piza');
	});


	it('tran should switch health and attack', function() {
		actions.tran.use(target);
		expect(target.card.attack).toBe(2);
		expect(target.card.health).toBe(3);
	});

	///////////////////////////////////////////////////////////////////////////////////////////
	// elite
	///////////////////////////////////////////////////////////////////////////////////////////

	it('sduc should pull into your control', function() {
		srcTarget.columnNum = 0;
		srcTarget.rowNum = 0;
		actions.sduc.use(target, null, srcTarget);
		expect(user1.columns[0][0]).toBe(null);
		expect(user2.columns[0][0]).toBe(target.card);
	});


	it('assn should attack a card without reprocussions', function() {
		actions.assn.use(target, srcTarget);
		expect(target.card.health).toBe(1);
	});


	it('delg should return a card to your hand and allow you to play another', function() {
		actions.delg.use(target);
		expect(user1.hand[0]).toBe(target.card);
		expect(user1.cardsToPlay).toBe(1);
		expect(user1.columns[0][0]).toBe(null);
	});


	it('posn should damage a card every turn', function() {
		actions.posn.use(target);
		expect(target.card.poison).toBe(1);
		actions.posn.use(target);
		expect(target.card.poison).toBe(2);
	});


	it('bagm should return a card to its owners hand', function() {
		actions.bagm.use(target);
		expect(user1.hand[0]).toBe(target.card);
		expect(user1.columns[0][0]).toBe(null);
	});


	it('siph should suck health from one card and give it to another', function() {
		actions.siph.use(target, srcTarget);
		expect(target.card.health).toBe(1);
		expect(srcTarget.card.health).toBe(4);
	});


	/////////////////////////////////////////////////////////////////////////////////////////
	// zealot
	/////////////////////////////////////////////////////////////////////////////////////////

	it('male should hit up the ladies', function() {
		actions.male.use(target);
		expect(user1.hand[0].name).toBe('WAR BABY');
		expect(user1.cardsToPlay).toBe(1);
	});

	it('feml should hit up the manlies', function() {
		actions.feml.use(target);
		expect(user1.hand[0].name).toBe('WAR BABY');
		expect(user1.cardsToPlay).toBe(1);
	});

	it('btle should buff a cards attack', function() {
		actions.btle.use(target);
		expect(target.card.attackBuf).toBe(2);
	});

	it('detr should doulbe attack while assuring defeat', function() {
		actions.detr.use(target, srcTarget);
		expect(target.card.health).toBe(0);
		expect(srcTarget.card.health).toBe(0);
	});

	it('hero should mark a card as the only available target', function() {
		actions.hero.use(target);
		expect(user1.hero).toBe(target.card);
	});

	it('serm should turn health into attack', function() {
		actions.serm.use(target);
		expect(target.card.attack).toBe(4);
		expect(target.card.health).toBe(1);
	});


});