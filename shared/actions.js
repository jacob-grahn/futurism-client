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
	 * @param {object} src
	 * @param {object} target
	 * @param {boolean} counterAttack
	 */
	var attack = function(src, target, counterAttack) {
		var srcAttack = _.random(0, src.card.attack);
		var targetAttack = _.random(0, target.card.attack);
		var srcDamage = targetAttack;
		var targetDamage = srcAttack;

		if(srcDamage > src.card.health) {
			srcDamage = src.card.health;
		}
		if(targetDamage > target.card.health) {
			targetDamage = target.card.health;
		}

		target.card.health -= targetDamage;

		if(target.card.health > 0 && counterAttack) {
			src.card.health -= srcDamage;
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




	var actions = {

		/////////////////////////////////////////////////////////////////////////////////////////
		// universal
		/////////////////////////////////////////////////////////////////////////////////////////

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
		 * Pride: generate pride
		 */
		PRIDE: 'prde',
		prde: {
			free: true,
			restrict: [
				[filters.owned]
			],
			use: function(src) {
				src.player.pride++;
			}
		},


		/**
		 * Summon: bring a new card into the game at a pride cost
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
				src.player.pride -= target1.card.pride;
				if(target1.card.hasBeenPlayed) {
					src.card.moves++;
					target1.card.moves = 1;
				}
				else {
					target1.card.moves = 0;
					target1.card.hasBeenPlayed = true;
				}
			}
		},


		/**
		 * Change the active future
		 */
		FUTURE: 'futr',
		futr: {
			restrict: [
				false
			],
			use: function(src) {

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
				[filters.enemy, filters.full, filters.front]
			],
			use: function(src, target) {
				var result = attack(src, target, true);
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
					health: 1
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
				var possibleTargets = filters.full( filters.enemy(board.allTargets(), src.player) );
				if(possibleTargets.length === 0) {
					return false;
				}
				var target = _.sample(possibleTargets);
				target.card.health--;
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
					return false;
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
				src.card.shield++;
			}
		},

		/**
		 * Precision: Attack an enemy of your choice regardless of defensive formations.
		 */
		PRECISION: 'prci',
		prci: {
			restrict: [
				[filters.owned],
				[filters.enemy, filters.full]
			],
			use: function(src, target) {
				target.card.health -= src.card.attack;
				src.card.health -= target.card.attack;
			}
		},

		/**
		 * Strategist: Ally can perform an extra action this turn
		 */
		STRATEGIST: 'strt',
		strt: {
			restrict: [
				[filters.owned],
				[filters.friend, filters.full]
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
				[filters.friend, filters.full]
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
		 * Teleporter: All allies gain move ability
		 */
		TELEPORTER: 'tlpt',
		tlpt: {
			restrict: [
				[filters.owned]
			],
			use: function(src, board) {
				var targets = board.playerTargets(src.player._id);
				_.each(targets, function(target) {
					if(target.card && target.card.abilities.indexOf('move') === -1) {
						target.card.abilities.push('move');
					}
				});
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
				[filters.enemy, filters.full, filters.front]
			],
			use: function(src, target) {
				var result = attack(src, target, false);
				result.counterAttack = false;
				return result;
			}
		},

		/**
		 * Delegate: Return this unit to your hand
		 */
		DELEGATE: 'delg',
		delg: {
			restrict: [
				[filters.owned]
			],
			use: function(src) {
				var card = src.card;
				card.hasBeenPlayed = false;
				src.card = null;
				src.player.pride += card.pride;
				src.player.hand.push(card);
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
				card.pride = 0;
				target.player.hand.push(card);
			}
		},

		//////////////////////////////////////////////////////////////////////////////////
		// zealot
		//////////////////////////////////////////////////////////////////////////////////

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
		 * Battlecry: Target unit gains 2 attack for the turn.
		 */
		BATTLECRY: 'btle',
		btle: {
			restrict: [
				[filters.owned],
				[filters.friend, filters.full]
			],
			use: function(src) {
				src.card.attackBuf += 2;
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
		 * Super Serum: Available health points are converted into attack points.
		 */
		SERUM: 'serm',
		serm: {
			restrict: [
				[filters.owned]
			],
			use: function(src) {
				src.card.health -= 1;
				src.card.attack += 2;
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