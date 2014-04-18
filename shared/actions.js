(function() {
	'use strict';

	var filters, _;


	/**
	 * import
	 */
	if(typeof require !== 'undefined') {
		_ = require('lodash');
		filters = require('./filters');
	}
	else {
		_ = window._;
		filters = window.futurismShared.filters;
	}


	/**
	 * reproduce (code for male and female abilities)
	 */
	var reproduce = function(src, target1, target2) {
		target1.card.moves -= 1;

		var parent = src.card;
		if(Math.random() > .5) {
			parent = target1.card;
		}

		target2.card = {
			_id: 'tube',
			cid: +new Date(),
			version: 1,
			name: 'GROW TUBE',
			hasImage: true,
			attack: 0,
			health: 1,
			moves: 0,
			faction: 'ze',
			abilities: ['grow'],
			parent: _.clone(parent)
		};
	};


	/**
	 * base attack
	 * @param {Object} src
	 * @param {Object} target
	 * @param {Object} [options]
	 */
	var attack = function(src, target, options) {

		options = options || {};
		options.counterAttack = options.counterAttack || false;
		options.alwaysHit = options.alwaysHit || false;


		// calc attack force
		src.card.attackBuf = src.card.attackBuf || 0;
		target.card.attackBuf = target.card.attackBuf || 0;

		var srcAttack = 0;
		if(options.alwaysHit || Math.random() > 0.33) {
			srcAttack = src.card.attack + src.card.attackBuf;
		}

		var targetAttack = 0;
		if(Math.random() > 0.33) {
			targetAttack = target.card.attack + target.card.attackBuf;
		}


		// calc damage taken
		var srcDamage = targetAttack;
		var targetDamage = srcAttack;

		if(srcDamage > src.card.health + src.card.shield) {
			srcDamage = src.card.health + src.card.shield;
		}
		if(targetDamage > target.card.health + target.card.shield) {
			targetDamage = target.card.health + target.card.shield;
		}


		// apply damage
		takeDamage(target, targetDamage);

		if(target.card.health > 0 && options.counterAttack) {
			takeDamage(src, srcDamage);
		}
		else {
			srcDamage = 0;
		}

		return {
			srcAttack: srcAttack,
			targetAttack: targetAttack,
			srcDamage: srcDamage,
			targetDamage: targetDamage
		}
	};


	/**
	 * apply damage to a card
	 * @param target
	 * @param damage
	 */
	var takeDamage = function(target, damage) {
		if(target.card) {
			while(target.card.shield > 0 && damage > 0) {
				target.card.shield--;
				damage--;
			}
			target.card.health -= damage;
		}
	};




	var actions = {

		/////////////////////////////////////////////////////////////////////////////////////////
		// universal
		/////////////////////////////////////////////////////////////////////////////////////////

		/**
		 * Attack: trade blows with another card
		 */
		ATTACK: 'attk',
		attk: {
			restrict: [
				[filters.owned],
				[filters.enemy, filters.full, filters.front, filters.hero]
			],
			use: function(src, target) {
				var result = attack(src, target, {counterAttack: true});
				return result;
			}
		},


		/**
		 * Move: move a card from one place to another
		 */
		MOVE: 'move',
		move: {
			restrict: [
				[filters.owned],
				[filters.owned, filters.empty]
			],
			use: function(src, target) {
				target.card = src.card;
				src.card = null;
			}
		},


		/**
		 * Summon: play a card from your hand to the board
		 */
		SUMMON: 'smmn',
		smmn: {
			restrict: [
				[filters.owned],
				[filters.inHand, filters.commanderFirst, filters.owned, filters.affordable],
				[filters.owned, filters.empty]
			],
			use: function(src, target1, target2) {
				_.pull(src.player.hand, target1.card);
				target2.card = target1.card;
				target1.card.moves = 0;
			}
		},


		/**
		 * Change the active future
		 */
		FUTURE: 'futr',
		futr: {
			restrict: [
				[filters.owned],
				[filters.future]
			],
			use: function(src, target) {
				var index = src.player.futures.indexOf(target.future);
				if(index !== -1) {
					src.player.futures.splice(index, 1);
					return {future: target.future};
				}
			}
		},


		/////////////////////////////////////////////////////////////////////////////////////////
		// ent
		/////////////////////////////////////////////////////////////////////////////////////////

		/**
		 * Attack [siphon]: trade blows with another card, maybe suck their life-force
		 */
		SIPHON: 'siph',
		siph: {
			restrict: [
				[filters.owned],
				[filters.enemy, filters.full, filters.front, filters.hero]
			],
			use: function(src, target) {
				var result = attack(src, target, {counterAttack: true});
				result.srcHeal = Math.round(result.targetDamage / 2);
				src.card.health += result.srcHeal;
				return result;
			}
		},

		/**
		 * Heal: Target card gains 1 health.
		 */
		HEAL: 'heal',
		heal: {
			restrict: [
				[filters.owned],
				[filters.friend, filters.full]
			],
			use: function(src, target) {
				target.card.health++;
				target.card.poison = 0;
				return {newHealth: target.card.health};
			}
		},

		/**
		 * Tree Sprout: A 0/1 tree is created.
		 */
		TREE: 'tree',
		tree: {
			restrict: [
				[filters.owned],
				[filters.friend, filters.empty]
			],
			use: function(src, target) {
				target.card = {
					_id: 'tree',
					cid: +new Date(),
					hasImage: true,
					name: 'TREE',
					faction: 'en',
					story: 'I just love growing!',
					attack: 0,
					health: 1,
					moves: 0
				}
			}
		},

		/**
		 * Abomination: Merge this unit with another.
		 */
		ABOMINATION: 'abom',
		abom: {
			restrict: [
				[filters.owned],
				[filters.friend, filters.full, filters.notSelf]
			],
			use: function(src, target) {
				var tCard = target.card;
				var sCard = src.card;
				sCard.health += tCard.health;
				sCard.attack += tCard.attack;
				sCard.abilities = _.uniq(sCard.abilities.concat(tCard.abilities));
				sCard.commander = tCard.commander || sCard.commander;
				target.card = null;
			}
		},

		/**
		 * Peace Pipe: Target enemy can not attack next turn.
		 */
		PEACE_PIPE: 'peap',
		peap: {
			restrict: [
				[filters.owned],
				[filters.enemy, filters.full, filters.front]
			],
			use: function(src, target) {
				target.card.moves--;
			}
		},


		/**
		 * Bees: random enemy looses 1 health
		 */
		BEES: 'bees',
		bees: {
			restrict: [
				[filters.owned]
			],
			use: function(src, board) {
				var possibleTargets = filters.hero(
					filters.full(
						filters.enemy(
							board.allTargets(), src.player
						)
					)
				, src.player, board);
				if(possibleTargets.length === 0) {
					return {err: 'no targets'};
				}
				var target = _.sample(possibleTargets);
				takeDamage(target, 1);
			}
		},

		///////////////////////////////////////////////////////////////////////
		// machine
		///////////////////////////////////////////////////////////////////////


		/**
		 * Rebuild: Resurrect a dead machine with 1 health.
		 */
		REBUILD: 'rbld',
		rbld: {
			restrict: [
				[filters.owned],
				[filters.friend, filters.empty]
			],
			use: function(src, target) {

				//find the most recent dead machine
				var card = null;
				_.each(target.player.graveyard, function(deadCard) {
					if(deadCard.faction === 'mc') {
						card = deadCard;
					}
				});
				if(!card) {
					return {err: 'no dead machines'};
				}

				//remove the card from the graveyard
				var index = target.player.graveyard.indexOf(card);
				if(index !== -1) {
					target.player.graveyard.splice(index, 1);
				}

				//add the card back into the game
				card.health = 1;
				card.moves = 0;
				target.card = card;
			}
		},

		/**
		 * Shield: All damage that would be dealt to target card is reduced by 1 for a turn.
		 */
		SHIELD: 'shld',
		shld: {
			restrict: [
				[filters.owned]
			],
			use: function(src) {
				src.card.shield = 2;
			}
		},

		/**
		 * Attack [Precision]: Attack an enemy of your choice regardless of defensive formations.
		 */
		PRECISION: 'prci',
		prci: {
			restrict: [
				[filters.owned],
				[filters.enemy, filters.full, filters.hero]
			],
			use: function(src, target) {
				var result = attack(src, target, {counterAttack: true});
				return result;
			}
		},

		/**
		 * Recharge: Ally can perform an extra action this turn
		 */
		RECHARGE: 'rech',
		rech: {
			restrict: [
				[filters.owned],
				[filters.friend, filters.full, filters.notSelf]
			],
			use: function(src, target) {
				target.card.moves++;
			}
		},

		/**
		 * Network: Gain an allies abilities.
		 */
		NETWORK: 'netw',
		netw: {
			restrict: [
				[filters.owned],
				[filters.friend, filters.full, filters.notSelf]
			],
			use: function(src, target) {
				src.card.abilities = _.uniq(src.card.abilities.concat(target.card.abilities));
			}
		},

		/**
		 * Transform: Swap health and attack.
		 */
		TRANSFORM: 'tran',
		tran: {
			restrict: [
				[filters.owned]
			],
			use: function(src) {
				var attack = src.card.attack;
				var health = src.card.health;
				src.card.health = attack;
				src.card.attack = health;
			}
		},

		////////////////////////////////////////////////////////////////////////////
		// elite
		////////////////////////////////////////////////////////////////////////////

		/**
		 * Teleporter: Move an ally. Also cures poison.
		 */
		TELEPORTER: 'tlpt',
		tlpt: {
			restrict: [
				[filters.owned],
				[filters.full, filters.friend],
				[filters.empty, filters.friend]
			],
			use: function(src, target1, target2) {
				target2.card = target1.card;
				target1.card = null;
				target2.card.poison = 0;
			}
		},

		/**
		 * Seduction: Convert an enemy to your side if their health is 1.
		 */
		SEDUCTION: 'sduc',
		sduc: {
			restrict: [
				[filters.owned],
				[filters.enemy, filters.full, filters.front, filters.weak],
				[filters.friend, filters.empty]
			],
			use: function(src, target, target2) {
				src.card.health--;
				target2.card = target.card;
				target.card = null;
			}
		},

		/**
		 * Assassin: Attack without taking damage.
		 */
		ASSASSIN: 'assn',
		assn: {
			restrict: [
				[filters.owned],
				[filters.enemy, filters.full, filters.front, filters.hero]
			],
			use: function(src, target) {
				var result = attack(src, target, {counterAttack: false});
				result.counterAttack = false;
				return result;
			}
		},

		/**
		 * Delegate: Return this card to your hand and give your commander an extra move point
		 */
		DELEGATE: 'delg',
		delg: {
			restrict: [
				[filters.owned]
			],
			use: function(src, board) {
				var card = src.card;
				card.hasBeenPlayed = false;
				src.card = null;
				src.player.hand.push(card);
				_.each(board.playerTargets(src.player._id), function(target) {
					if(target.card && target.card.commander) {
						target.card.moves++;
					}
				})
			}
		},

		/**
		 * Poison: Target enemy looses 1 health per turn.
		 */
		POISON: 'posn',
		posn: {
			restrict: [
				[filters.owned],
				[filters.enemy, filters.full, filters.front]
			],
			use: function(src, target) {
				if(Math.random() > 0.5) {
					if(target.card.poison) {
						target.card.poison += 1;
					}
					else {
						target.card.poison = 1;
					}
				}
			}
		},

		/**
		 * Bag'em: Target card is returned to its owners hand.
		 */
		BAGEM: 'bagm',
		bagm: {
			restrict: [
				[filters.owned],
				[filters.enemy, filters.full, filters.front]
			],
			use: function(src, target) {
				var card = target.card;
				target.card = null;
				target.player.hand.push(card);

				var card2 = src.card;
				src.card = null;
				src.player.hand.push(card2);
			}
		},


		//////////////////////////////////////////////////////////////////////////////////
		// zealot
		//////////////////////////////////////////////////////////////////////////////////

		/**
		 * Attack [Fervent] an attack that always hits
		 */
		FERVENT: 'frvt',
		frvt: {
			restrict: [
				[filters.owned],
				[filters.enemy, filters.full, filters.front, filters.hero]
			],
			use: function(src, target) {
				var result = attack(src, target, {counterAttack: true, alwaysHit: true});
				return result;
			}
		},

		/**
		 * Male: Can reproduce with females.
		 */
		MALE: 'male',
		male: {
			restrict: [
				[filters.owned],
				[filters.friend, filters.female, filters.hasMoves],
				[filters.owned, filters.empty]
			],
			use: function(src, target1, target2) {
				reproduce(src, target1, target2);
			}
		},

		/**
		 * Female: Can reproduce with males.
		 */
		FEMALE: 'feml',
		feml: {
			restrict: [
				[filters.owned],
				[filters.friend, filters.male, filters.hasMoves],
				[filters.owned, filters.empty]
			],
			use: function(src, target1, target2) {
				reproduce(src, target1, target2);
			}
		},


		/**
		 * Grow: turn a WAR BABY into its parent
		 */
		GROW: 'grow',
		grow: {
			restrict: [
				[filters.owned]
			],
			use: function(src) {
				src.card = src.card.parent;
			}
		},

		/**
		 * Battlecry: Ally zealots get a +1 attack buff
		 */
		BATTLECRY: 'btle',
		btle: {
			restrict: [
				[filters.owned]
			],
			use: function(src, board) {
				var targets = board.playerTargets(src.player._id);
				_.each(targets, function(target) {
					if(target.card && target.card.faction === 'ze') {
						if(target.card.attackBuf) {
							target.card.attackBuf++;
						}
						else {
							target.card.attackBuf = 1;
						}
					}
				});
			}
		},

		/**
		 * Determined: Sacrifice this card to defeat any enemy
		 */
		DETERMINED: 'detr',
		detr: {
			restrict: [
				[filters.owned],
				[filters.enemy, filters.front]
			],
			use: function(src, target) {
				src.card.health = 0;
				target.card.health = 0;
			}
		},

		/**
		 * Sacrifice: All enemy attacks must target this card for one turn.
		 */
		HERO: 'hero',
		hero: {
			restrict: [
				[filters.owned]
			],
			use: function(src) {
				src.card.hero++;
			}
		},

		/**
		 * Super Serum: Increase attack by 3 at the cost of becoming poisoned
		 */
		SERUM: 'serm',
		serm: {
			restrict: [
				[filters.owned]
			],
			use: function(src) {
				if(src.card.poison) {
					src.card.poison++;
				}
				else {
					src.card.poison = 1;
				}
				src.card.attack += 3;
			}
		}

	};


	/**
	 * export
	 */
	if (typeof module !== 'undefined') {
		module.exports = actions;
	}
	else {
		window.futurismShared = window.futurismShared || {};
		window.futurismShared.actions = actions;
	}
}());