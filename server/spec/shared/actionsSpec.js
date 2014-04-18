describe('shared/actions', function() {
	'use strict';

	var _ = require('lodash');
	var actions = require('../../../shared/actions');
	var Board = require('../../../shared/Board');
	var factions = require('../../../shared/factions');
	var board, player1, player2, player3, weakCard, strongCard, target;


	beforeEach(function() {

		player1 = {
			_id: 1,
			team: 1,
			hand: [],
			graveyard: [],
			cards: [],
			pride: 0
		};


		player2 = {
			_id: 2,
			team: 2,
			hand: [],
			graveyard: [],
			cards: [],
			pride: 0
		};


		player3 = {
			_id: 3,
			team: 2,
			hand: [],
			graveyard: [],
			cards: [],
			pride: 0
		};


		weakCard = {
			_id: 'cssf',
			attack: 1,
			health: 1,
			abilities: ['abom', 'tree'],
			moves: 1,
			shield: 0,
			pride: 1,
			hero: 0,
			attackBuf: 0
		};


		strongCard = {
			_id: 'bloop',
			attack: 9,
			health: 9,
			abilities: ['prci'],
			moves: 1,
			shield: 0,
			pride: 9,
			hero: 0,
			attackBuf: 0
		};


		board = new Board([player1, player2, player3], 4, 3);

		target = board.target;
	});





	//////////////////////////////////////////////////////////////////////////////////
	// global
	//////////////////////////////////////////////////////////////////////////////////

	it('attack should trade blows with another card', function() {
		var target1 = {
			card: {
				health: 1000,
				attack: 1
			}
		};
		var target2 = {
			card: {
				health: 1000,
				attack: 3
			}
		};

		_.times(100, function() {
			actions.prci.use(target1, target2);
		});

		var expectedHealth1 = 1000 - (3 * 100 * 0.66);
		expect(target1.card.health).toBeGreaterThan(expectedHealth1 * 0.9);
		expect(target1.card.health).toBeLessThan(expectedHealth1 * 1.1);

		var expectedHealth2 = 1000 - (1 * 100 * 0.66);
		expect(target2.card.health).toBeGreaterThan(expectedHealth2 * 0.9);
		expect(target2.card.health).toBeLessThan(expectedHealth2 * 1.1);
	});


	it('move should move a card to an empty owned target', function() {
		target(1,0,0).card = strongCard;
		actions.move.use(target(1,0,0), target(1,1,1));
		expect(target(1,0,0).card).toBeFalsy();
		expect(target(1,1,1).card).toBe(strongCard);
	});


	/*it('pride should generate pride fot that cards owner', function() {
		target(1,0,0).card = strongCard;
		actions.prde.use(target(1,0,0), player1);
		expect(player1.pride).toBe(1);
	});*/


	describe('smmn', function() {

		it('should be able to play itself from a hand', function() {
			var commanderTarget = {
				card: {commander: true, abilities: ['smmn']},
				player: player1
			};
			var handTarget = {
				card: strongCard,
				player: player1
			};
			player1.pride = 9;
			actions.smmn.use(commanderTarget, handTarget, target(1,0,0));
			expect(target(1,0,0).card).toBe(strongCard);
		});

		it('should be able to play a card from your hand', function() {
			var handTarget = {
				card: strongCard,
				player: player1
			};
			player1.pride = 9;
			target(1,1,0).card = {commander: true, abilities: ['smmn']}
			actions.smmn.use(target(1,1,0), handTarget, target(1,0,0));
			expect(target(1,0,0).card).toBe(strongCard);
		});
	});


	//////////////////////////////////////////////////////////////////////////////////
	// ent
	//////////////////////////////////////////////////////////////////////////////////

	it('siph should suck health from one card and give it to another', function() {
		var target1 = {
			card: {
				health: 1000,
				attack: 2
			}
		};
		var target2 = {
			card: {
				health: 1000,
				attack: 0
			}
		};

		_.times(100, function() {
			actions.siph.use(target1, target2);
		});

		var expectedHealth = 1000 + (2 / 2 * 0.66);
		expect(target1.card.health).toBeGreaterThan(expectedHealth * 0.9);
		expect(target1.card.health).toBeLessThan(expectedHealth * 1.1);
	});


	describe('heal', function() {

		it('should increase health', function() {
			target(1,1,0).card = {health: 1};
			actions.heal.use(null, target(1,1,0));
			expect(target(1,1,0).card.health).toBe(2);
		});

		it('should cure poison', function() {
			target(1,1,0).card = {health: 1, poison: 1};
			actions.heal.use(null, target(1,1,0));
			expect(target(1,1,0).card.poison).toBe(0);
		});
	});



	it('tree should grow a tree', function() {
		actions.tree.use(target(1,0,0), target(1,1,0));
		expect(target(1,1,0).card.name).toBe('TREE');
	});


	it('abom should join two cards together', function() {
		target(1,0,0).card = strongCard;
		target(1,3,0).card = weakCard;
		actions.abom.use(target(1,0,0), target(1,3,0));
		expect(target(1,3,0).card).toBeFalsy();
		expect(target(1,0,0).card.health).toBe(10);
		expect(target(1,0,0).card.attack).toBe(10);
		expect(target(1,0,0).card.abilities).toContain('abom', 'tree', 'prci')
	});


	it('peap should mark a card as tired', function() {
		strongCard.moves = 1;
		target(1,0,0).card = weakCard;
		target(2,0,0).card = strongCard;
		actions.peap.use(target(1,0,0), target(2,0,0));
		expect(target(2,0,0).card.moves).toBe(0);
	});


	describe('bees', function() {
		it('should hurt a random enemy', function() {
			target(1,0,0).card = strongCard;
			actions.bees.use(board.target(2,0,0), board);
			expect(target(1,0,0).card.health).toBe(8);
		});
	});



	////////////////////////////////////////////////////////////////////////////////////////////
	// machine
	////////////////////////////////////////////////////////////////////////////////////////////

	it('rbld should return a dead card to play with 1 health', function() {
		var machine = {
			name: 'Ratched',
			faction: factions.machine.id,
			health: 0
		};
		player1.graveyard.push(machine);

		target(1,1,0).card = strongCard;

		actions.rbld.use(target(1,1,0), target(1,0,0));

		expect(player1.graveyard.length).toBe(0);
		expect(target(1,0,0).card).toBe(machine);
		expect(target(1,0,0).card.health).toBe(1);
	});


	it('shld should protect a card for a turn', function() {
		target(1,0,0).card = weakCard;
		actions.shld.use(target(1,0,0));
		expect(target(1,0,0).card.shield).toEqual(2);
	});


	it('prci should decrease health', function() {
		var target1 = {
			card: {
				health: 1000,
				attack: 1
			}
		};
		var target2 = {
			card: {
				health: 1000,
				attack: 3
			}
		};

		_.times(100, function() {
			actions.prci.use(target1, target2);
		});

		var expectedHealth1 = 1000 - (3 * 100 * 0.66);
		expect(target1.card.health).toBeGreaterThan(expectedHealth1 * 0.9);
		expect(target1.card.health).toBeLessThan(expectedHealth1 * 1.1);

		var expectedHealth2 = 1000 - (1 * 100 * 0.66);
		expect(target2.card.health).toBeGreaterThan(expectedHealth2 * 0.9);
		expect(target2.card.health).toBeLessThan(expectedHealth2 * 1.1);
	});


	it('recharge should give a card another turn', function() {
		target(1,1,0).card = strongCard;
		target(1,0,0).card = weakCard;
		actions.rech.use(target(1,1,0), target(1,0,0));
		expect(target(1,0,0).card.moves).toBe(2);
	});


	it('netw should copy another targets abilities', function() {
		target(1,0,0).card = weakCard;
		target(1,1,0).card = strongCard;
		actions.netw.use(target(1,0,0), target(1,1,0));
		expect(target(1,0,0).card.abilities).toEqual(['abom', 'tree', 'prci']);
	});


	it('tran should switch health and attack', function() {
		var transCard = {
			attack: 5,
			health: 1
		};
		target(1,0,0).card = transCard;
		actions.tran.use(target(1,0,0));
		expect(target(1,0,0).card.attack).toBe(1);
		expect(target(1,0,0).card.health).toBe(5);
	});


	///////////////////////////////////////////////////////////////////////////////////////////
	// elite
	///////////////////////////////////////////////////////////////////////////////////////////

	describe('sduc', function() {

		it('should pull a card into your control', function() {
			target(1,1,0).card = strongCard;
			target(2,0,0).card = weakCard;
			actions.sduc.use(target(1,1,0), target(2,0,0), target(1,0,0));
			expect(target(2,0,0).card).toBeFalsy();
			expect(target(1,0,0).card).toBe(weakCard);
		});
	});


	it('assn should attack a card without repercussions', function() {
		var target1 = {
			card: {
				health: 1000,
				attack: 5
			}
		};
		var target2 = {
			card: {
				health: 1000,
				attack: 99
			}
		};

		_.times(100, function() {
			actions.assn.use(target1, target2);
		});

		expect(target1.card.health).toBe(1000);

		var expectedHealth = 1000 - (100 * 5 * 0.66);
		expect(target2.card.health).toBeGreaterThan(expectedHealth * 0.9);
		expect(target2.card.health).toBeLessThan(expectedHealth * 1.1);
	});


	it('delg should return a card to your hand and give your commander another action point', function() {
		target(1,0,0).card = weakCard;
		target(1,1,0).card = {commander: true, moves: 0};
		actions.delg.use(target(1,0,0), board);
		expect(player1.hand[0]).toBe(weakCard);
		expect(target(1,0,0).card).toBeFalsy();
		expect(target(1,1,0).card.moves).toBe(1);
	});


	it('posn should damage a card every turn', function() {
		var card = {
			poison: 0
		};
		target(1,0,0).card = strongCard;
		target(2,0,0).card = card;
		_.times(100, function() {
			actions.posn.use(target(1,0,0), target(2,0,0));
		});
		expect(card.poison).toBeLessThan(60);
		expect(card.poison).toBeGreaterThan(40);
	});


	it('bagm should return a card to its owners hand', function() {
		target(1,1,0).card = weakCard;
		target(1,0,0).card = strongCard;
		actions.bagm.use(target(1,1,0), target(1,0,0));
		expect(player1.hand[0]).toBe(strongCard);
		expect(target(1,0,0).card).toBeFalsy();
	});


	describe('teleporter', function() {

		it('should move target card', function() {
			target(1,1,0).card = weakCard;
			actions.tlpt.use({}, target(1,1,0), target(1,1,1));
			expect(target(1,1,0).card).toBe(null);
			expect(target(1,1,1).card).toBe(weakCard);
		});

		it('should cure target card of poison', function() {
			target(1,1,0).card = {poison: 3};
			actions.tlpt.use({}, target(1,1,0), target(1,1,1));
			expect(target(1,1,1).card.poison).toBe(0);
		});
	});



	/////////////////////////////////////////////////////////////////////////////////////////
	// zealot
	/////////////////////////////////////////////////////////////////////////////////////////

	describe('attack [fervent]', function() {
		it('should always hit', function() {
			var target1 = {
				card: {
					health: 1000,
					attack: 5
				}
			};
			var target2 = {
				card: {
					health: 1000,
					attack: 4
				}
			};

			_.times(100, function() {
				actions.frvt.use(target1, target2);
			});

			var expectedHealth1 = 1000 - (4 * 100 * 0.66);
			expect(target1.card.health).toBeGreaterThan(expectedHealth1 * 0.9);
			expect(target1.card.health).toBeLessThan(expectedHealth1 * 1.1);

			var expectedHealth2 = 1000 - (5 * 100);
			expect(target2.card.health).toBe(expectedHealth2);
		});
	});

	it('male should hit up the ladies', function() {
		target(1,0,0).card = strongCard;
		target(1,1,0).card = weakCard;
		actions.male.use(target(1,0,0), target(1,1,0), target(1,0,1));
		expect(target(1,0,1).card.name).toBe('GROW TUBE');
	});


	it('feml should hit up the manlies', function() {
		target(1,0,0).card = strongCard;
		target(1,1,0).card = weakCard;
		actions.feml.use(target(1,0,0), target(1,1,0), target(1,0,1));
		expect(target(1,0,1).card.name).toBe('GROW TUBE');
	});


	it('grow should bring a baby to adulthood', function() {
		target(1,0,0).card = {
			parent: strongCard
		};
		actions.grow.use(target(1,0,0));
		expect(target(1,0,0).card).toEqual(strongCard);
	});


	describe('battlecry', function() {

		it('should buff the attack of all ally zealots', function() {
			board.target(1,1,1).card = {abilities: ['btle']};
			board.target(1,0,0).card = {faction: 'ze'};
			board.target(1,1,0).card = {faction: 'ze', attackBuf: 3};
			board.target(1,2,0).card = {faction: 'no'};
			board.target(2,0,0).card = {faction: 'ze'};

			actions.btle.use(board.target(1,1,1), board);

			expect(board.target(1,1,1).card.attackBuf).toBe(undefined);
			expect(board.target(1,0,0).card.attackBuf).toBe(1);
			expect(board.target(1,1,0).card.attackBuf).toBe(4);
			expect(board.target(1,2,0).card.attackBuf).toBe(undefined);
			expect(board.target(2,0,0).card.attackBuf).toBe(undefined);
		});
	});


	it('detr should take out any enemy while assuring defeat', function() {
		target(1,0,0).card = weakCard;
		target(2,0,0).card = strongCard;
		actions.detr.use(target(1,0,0), target(2,0,0));
		expect(target(1,0,0).card.health).toBe(0);
		expect(target(2,0,0).card.health).toBe(0);
	});


	it('hero should mark a card as the only available target', function() {
		var card = {
			hero: 0
		};
		target(1,0,0).card = card;
		actions.hero.use(target(1,0,0));
		expect(card.hero).toBe(1);
	});


	describe('super serum', function() {
		it('serm should increase attack by three and add 1 poison', function() {
			target(1,0,0).card = strongCard;
			actions.serm.use(target(1,0,0));
			expect(strongCard.attack).toBe(12);
			expect(strongCard.poison).toBe(1);
		});
	});

});