(function() {
	'use strict';

	var filters = require('./filters');
	var _ = require('lodash');
	var fns = require('../../fns/fns');


	module.exports = {

		/////////////////////////////////////////////////////////////////////////////////////////
		// universal
		/////////////////////////////////////////////////////////////////////////////////////////

		/**
		 * Attack: trade blows with another card
		 */
		attk: {
			targets: [filters.enemy, filters.front],
			use: function(target, src) {
				target.card.health -= src.card.attack;
				src.card.health -= target.card.attack;
			}
		},

		/////////////////////////////////////////////////////////////////////////////////////////
		// ent
		/////////////////////////////////////////////////////////////////////////////////////////

		/**
		 * Heal: Target card gains 1 health.
		 */
		heal: {
			targets: [filters.friend, filters.full],
			use: function(target) {
				target.card.health++;
			}
		},

		/**
		 * Tree Sprout: A 1/1 tree is created.
		 */
		tree: {
			targets: [filters.friend, filters.spaceAhead],
			use: function(target) {
				target.card = {
					title: 'TREE',
					desc: 'Make way for the TREE parade!',
					attack: 1,
					health: 1
				}
			}
		},

		/**
		 * Abomination: Merge this unit with another.
		 */
		abom: {
			targets: [filters.friend, filters.full],
			use: function(target, src) {
				var tCard = target.card;
				var sCard = src.card;
				sCard.health += tCard.health;
				sCard.attack += tCard.attack;
				sCard.abilities = _.uniq(sCard.abilities.concat(tCard.abilities));
				target.card = null;
			}
		},

		/**
		 * Secretions: Target enemy can not attack next turn.
		 */
		secr: {
			targets: [filters.enemy, filters.front],
			use: function(target) {
				target.card.tired++;
			}
		},

		/**
		 * Clone: Sacrifice this unit to produce a duplicate of another unit.
		 */
		clne: {
			targets: [filters.friend, filters.full],
			use: function(target, src) {
				src.card.abilities = _.clone(target.card.abilities);
				src.card.attack = target.card.attack;
				src.card.name = target.card.name;
			}
		},

		/**
		 * Bees: All enemies in target column loose 1 health.
		 */
		bees: {
			targets: [filters.enemy, filters.front],
			use: function(target) {
				_.each(target.column, function(t) {
					if(t.card) {
						t.card.health--;
					}
				});
			}
		},

		///////////////////////////////////////////////////////////////////////
		// machine
		///////////////////////////////////////////////////////////////////////


		/**
		 * Rebuild: Resurrect a dead machine with 1 health.
		 */
		rbld: {
			targets: null,
			targets2: [filters.friend, filters.open],
			use: function(target, src, target2) {
				fns.removeFromArray(target.account.graveyard, target.card);
				target.card.health = 1;
				target2.account.columns[target2.columnNum][target2.rowNum] = target.card;
			}
		},

		/**
		 * Shield: All damage that would be dealt to target card is reduced by 1 for a turn.
		 */
		shld: {
			targets: [filters.friend, filters.full],
			use: function(target) {
				target.card.shield++;
			}
		},

		/**
		 * Presicion: Attack an enemy of your choice regardless of defensive formations.
		 */
		prci: {
			targets: [filters.enemy, filters.full],
			use: function(target, src) {
				target.card.health -= src.card.attack;
				src.card.health -= target.card.attack;
			}
		},

		/**
		 * Strategist: Ally can perform an extra action this turn
		 */
		strt: {
			targets: [filters.friend, filters.full],
			use: function(target) {
				target.card.tired--;
			}
		},

		/**
		 * Network: Gain an allies abilities.
		 */
		netw: {
			targets: [filters.friend, filters.full],
			use: function(target, src) {
				src.card.abilities = _.uniq(src.card.abilities.concat(target.card.abilities));
			}
		},

		/**
		 * Transform: Swap health and attack.
		 */
		tran: {
			targets: null,
			use: function(target) {
				var attack = target.card.attack;
				var health = target.card.health;
				target.card.health = attack;
				target.card.attack = health;
			}
		},

		////////////////////////////////////////////////////////////////////////////
		// elite
		////////////////////////////////////////////////////////////////////////////

		/**
		 * Seduction: Convert an enemy to your side if their health is 1.
		 */
		sduc: {
			targets: [filters.enemy, filters.front],
			targets2: [filters.friend, filters.empty],
			use: function(target, src, target2) {
				target.account.columns[target.columnNum][target.rowNum] = null;
				target2.account.columns[target2.columnNum][target2.rowNum] = target.card;
				//src.account.hand.push(target.card);
			}
		},

		/**
		 * Assassin: Attack without taking damage.
		 */
		assn: {
			targets: [filters.enemy, filters.front],
			use: function(target, src) {
				target.card.health -= src.card.attack;
			}
		},

		/**
		 * Delegate: Trade this unit with another unit in your hand.
		 */
		delg: {
			targets: null,
			use: function(target) {
				target.account.columns[target.columnNum][target.rowNum] = null;
				target.account.hand.push(target.card);
				target.account.cardsToPlay++;
			}
		},

		/**
		 * Poison: Target enemy looses 1 health per turn.
		 */
		posn: {
			targets: [filters.enemy, filters.front],
			use: function(target) {
				target.card.poison += 1;
			}
		},

		/**
		 * Bag'em: Target card is returned to its owners hand.
		 */
		bagm: {
			targets: [filters.enemy, filters.front],
			use: function(target) {
				target.account.columns[target.columnNum][target.rowNum] = null;
				target.account.hand.push(target.card);
			}
		},

		/**
		 * Siphon: Steal 1 health from a card of your choice.
		 */
		siph: {
			targets: [filters.enemy, filters.front],
			use: function(target, src) {
				target.card.health--;
				src.card.health++;
			}
		},

		//////////////////////////////////////////////////////////////////////////////////
		// zealot
		//////////////////////////////////////////////////////////////////////////////////


		/**
		 * Male: Can reproduce with females.
		 */
		male: {
			targets: [filters.friend, filters.female],
			use: function(target) {
				target.account.hand.push({
					name: 'WAR BABY',
					attack: 1,
					health: 1,
					abilities: ['grow']
				});
				target.account.cardsToPlay++;
			}
		},

		/**
		 * Female: Can reproduce with males.
		 */
		feml: {
			targets: [filters.friend, filters.male],
			use: function(target) {
				target.account.hand.push({
					name: 'WAR BABY',
					attack: 1,
					health: 1,
					abilities: ['grow']
				});
				target.account.cardsToPlay++;
			}
		},

		/**
		 * Battlecry: Target unit gains 1 attack for the turn.
		 */
		btle: {
			targets: [filters.friend, filters.filled],
			use: function(target) {
				target.card.attackBuf += 2;
			}
		},

		/**
		 * Determined: Sacrifice this card to deal double damage.
		 */
		detr: {
			targets: [filters.enemy, filters.front],
			use: function(target, src) {
				src.card.health = 0;
				target.card.health -= src.card.attack * 2;
			}
		},

		/**
		 * Sacrifice: All enemy attacks must target this card for one turn.
		 */
		hero: {
			targets: false,
			use: function(target) {
				target.account.hero = target.card;
			}
		},

		/**
		 * Super Serum: Available health points are converted into attack points.
		 */
		serm: {
			targets: false,
			use: function(target) {
				var gain = target.card.health - 1;
				target.card.health -= gain;
				target.card.attack += gain;
			}
		}

	};




}());