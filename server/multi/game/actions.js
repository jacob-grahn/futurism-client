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


		/**
		 * Move: move a card from one place to another
		 */
		move: {
			targets: [filters.owned, filters.empty],
			use: function(target1, target2) {
				target2.card = target1.card;
				target1.card = null;
			}
		},


		/**
		 * Rally: generate pride
		 */
		rlly: {
			targets: null,
			use: function(target, player) {
				player.pride++;
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
			use: function(src, target) {
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
				target.card.moves--;
			}
		},

		/**
		 * Clone: Sacrifice this unit to produce a duplicate of another unit.
		 */
		clne: {
			targets: [filters.friend, filters.full],
			use: function(src, target) {
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
				_.each(arguments, function(target) {
					if(target.card) {
						target.card.health--;
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
			use: function(target, graveyard, cardId) {

				//find the card
				var card = null;
				_.each(graveyard, function(deadCard) {
					if(deadCard._id === cardId) {
						card = deadCard;
					}
				});
				if(!card) {
					return false;
				}

				//remove the card from the graveyard
				fns.removeFromArray(graveyard, card);

				//add the card back into the game
				card.health = 1;
				target.card = card;
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
			use: function(src, target) {
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
				target.card.moves++;
			}
		},

		/**
		 * Network: Gain an allies abilities.
		 */
		netw: {
			targets: [filters.friend, filters.full],
			use: function(src, target) {
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
			use: function(target, target2) {
				target2.card = target.card;
				target.card = null;
			}
		},

		/**
		 * Assassin: Attack without taking damage.
		 */
		assn: {
			targets: [filters.enemy, filters.front],
			use: function(src, target) {
				target.card.health -= src.card.attack;
			}
		},

		/**
		 * Delegate: Trade this unit with another unit in your hand.
		 */
		delg: {
			targets: null,
			use: function(target, player) {
				var card = target.card;
				target.card = null;
				player.pride += card.pride;
				player.hand.push(card);
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
			use: function(target, player) {
				var card = target.card;
				target.card = null;
				player.hand.push(card);
			}
		},

		/**
		 * Siphon: Steal 1 health from a card of your choice.
		 */
		siph: {
			targets: [filters.enemy, filters.front],
			use: function(src, target) {
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
			use: function(target1, target2) {
				target2.card = {
					name: 'WAR BABY',
					attack: 1,
					health: 1,
					abilities: ['grow'],
					parent: _.clone(target1.card)
				};
			}
		},

		/**
		 * Female: Can reproduce with males.
		 */
		feml: {
			targets: [filters.friend, filters.male],
			use: function(target1, target2) {
				target2.card = {
					name: 'WAR BABY',
					attack: 1,
					health: 1,
					abilities: ['grow'],
					parent: _.clone(target1.card)
				};
			}
		},

		/**
		 * Grow: turn a WAR BABY into its parent
		 */
		grow: {
			targets: null,
			use: function(target) {
				target.card = target.card.parent;
			}
		},

		/**
		 * Battlecry: Target unit gains 2 attack for the turn.
		 */
		btle: {
			targets: [filters.friend, filters.filled],
			use: function(target) {
				target.card.attackBuf += 2;
			}
		},

		/**
		 * Determined: Sacrifice this card to defeat any enemy
		 */
		detr: {
			targets: [filters.enemy, filters.front],
			use: function(src, target) {
				src.card.health = 0;
				target.card.health = 0;
			}
		},

		/**
		 * Sacrifice: All enemy attacks must target this card for one turn.
		 */
		hero: {
			targets: false,
			use: function(target) {
				target.card.hero++;
			}
		},

		/**
		 * Super Serum: Available health points are converted into attack points.
		 */
		serm: {
			targets: false,
			use: function(target) {
				target.card.health -= 1;
				target.card.attack += 2;
			}
		}

	};




}());