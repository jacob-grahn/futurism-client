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
			restrict: [
				[filters.owned],
				[filters.enemy, filters.front]
			],
			use: function(src, target) {
				target.card.health -= src.card.attack;
				src.card.health -= target.card.attack;
			},
			free: true
		},


		/**
		 * Move: move a card from one place to another
		 */
		move: {
			restrict: [
				[filters.owned],
				[filters.owned, filters.empty]
			],
			use: function(src, target) {
				target.card = src.card;
				src.card = null;
			},
			free: true
		},


		/**
		 * Rally: generate pride
		 */
		rlly: {
			restrict: [
				false
			],
			use: function(src) {
				src.player.pride++;
			},
			free: true
		},


		/////////////////////////////////////////////////////////////////////////////////////////
		// ent
		/////////////////////////////////////////////////////////////////////////////////////////

		/**
		 * Heal: Target card gains 1 health.
		 */
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
		 * Tree Sprout: A 1/1 tree is created.
		 */
		tree: {
			restrict: [
				[filters.owned],
				[filters.friend, filters.empty]
			],
			use: function(src, target) {
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
			restrict: [
				[filters.owned],
				[filters.friend, filters.full]
			],
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
			restrict: [
				[filters.owned],
				[filters.enemy, filters.front]
			],
			use: function(src, target) {
				target.card.moves--;
			}
		},

		/**
		 * Clone: Sacrifice this unit to produce a duplicate of another unit.
		 */
		clne: {
			restrict: [
				[filters.owned],
				[filters.friend, filters.full]
			],
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
			restrict: [
				[filters.owned],
				[filters.enemy, filters.front]
			],
			use: function(src, target) {
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
			restrict: [
				[filters.owned],
				[filters.friend, filters.open],
				false
			],
			use: function(src, target, graveyard, cardId) {

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
			restrict: [
				[filters.owned],
				[filters.friend, filters.full]
			],
			use: function(src, target) {
				target.card.shield++;
			}
		},

		/**
		 * Presicion: Attack an enemy of your choice regardless of defensive formations.
		 */
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
		 * Seduction: Convert an enemy to your side if their health is 1.
		 */
		sduc: {
			restrict: [
				[filters.owned],
				[filters.enemy, filters.front],
				[filters.friend, filters.empty]
			],
			use: function(src, target, target2) {
				target2.card = target.card;
				target.card = null;
			}
		},

		/**
		 * Assassin: Attack without taking damage.
		 */
		assn: {
			restrict: [
				[filters.owned],
				[filters.enemy, filters.front]
			],
			use: function(src, target) {
				target.card.health -= src.card.attack;
			}
		},

		/**
		 * Delegate: Return this unit to your hand
		 */
		delg: {
			restrict: [
				[filters.owned]
			],
			use: function(src) {
				var card = src.card;
				src.card = null;
				src.player.pride += card.pride;
				src.player.hand.push(card);
			}
		},

		/**
		 * Poison: Target enemy looses 1 health per turn.
		 */
		posn: {
			restrict: [
				[filters.owned],
				[filters.enemy, filters.front]
			],
			use: function(src, target) {
				target.card.poison += 1;
			}
		},

		/**
		 * Bag'em: Target card is returned to its owners hand.
		 */
		bagm: {
			restrict: [
				[filters.owned],
				[filters.enemy, filters.front]
			],
			use: function(src, target) {
				var card = target.card;
				target.card = null;
				target.player.hand.push(card);
			}
		},

		/**
		 * Siphon: Steal 1 health from a card of your choice.
		 */
		siph: {
			restrict: [
				[filters.owned],
				[filters.enemy, filters.front]
			],
			use: function(src, target) {
				src.card.health++;
				target.card.health--;
			}
		},

		//////////////////////////////////////////////////////////////////////////////////
		// zealot
		//////////////////////////////////////////////////////////////////////////////////

		/**
		 * Male: Can reproduce with females.
		 */
		male: {
			restrict: [
				[filters.owned],
				[filters.friend, filters.female],
				[filters.owned, filters.empty]
			],
			use: function(src, target1, target2) {
				target2.card = {
					name: 'WAR BABY',
					attack: 1,
					health: 1,
					abilities: ['grow'],
					parent: _.clone(src.card)
				};
			}
		},

		/**
		 * Female: Can reproduce with males.
		 */
		feml: {
			restrict: [
				[filters.owned],
				[filters.friend, filters.male],
				[filters.owned, filters.empty]
			],
			use: function(src, target1, target2) {
				target2.card = {
					name: 'WAR BABY',
					attack: 1,
					health: 1,
					abilities: ['grow'],
					parent: _.clone(src.card)
				};
			}
		},

		/**
		 * Grow: turn a WAR BABY into its parent
		 */
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




}());