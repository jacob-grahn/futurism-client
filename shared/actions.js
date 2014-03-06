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
				[filters.enemy, filters.full, filters.front]
			],
			use: function(src, target) {
				target.card.health -= _.random(0, src.card.attack);
				if(target.card.health > 0) {
					src.card.health -= _.random(0, target.card.attack);
				}
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
		 * Rally: generate pride
		 */
		RALLY: 'rlly',
		rlly: {
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
				src.player.pride -= target1.card.pride;
				target2.card = target1.card;
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


		/**
		 * Enter: join the game at a pride cost
		 */
		/*entr: {
			restrict: [
				[filters.playable, filters.owned, filters.affordable],
				[filters.owned, filters.empty]
			],
			use: function(src, target) {
				_.pull(src.player.hand, src.card);
				src.player.pride -= src.card.pride;
				target.card = src.card;
			}
		},*/


		/////////////////////////////////////////////////////////////////////////////////////////
		// ent
		/////////////////////////////////////////////////////////////////////////////////////////

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
		 * Tree Sprout: A 1/1 tree is created.
		 */
		TREE: 'tree',
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
		 * Secretions: Target enemy can not attack next turn.
		 */
		SECRETIONS: 'secr',
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
		CLONE: 'clne',
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
		BEES: 'bees',
		bees: {
			restrict: [
				[filters.owned],
				[filters.enemy, filters.front]
			],
			use: function(src, target, board) {
				var column = target.column;
				var row = 0;
				while(board.target(target.player._id, column, row)) {
					var t = board.target(target.player._id, column, row);
					if(t.card) {
						t.card.health--;
					}
					row++;
				}
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
				[filters.friend, filters.open]
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
				target.card.health -= src.card.attack;
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
				[filters.enemy, filters.front]
			],
			use: function(src, target) {
				target.card.poison += 1;
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

		/**
		 * Siphon: Steal 1 health from a card of your choice.
		 */
		SIPHON: 'siph',
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
		MALE: 'male',
		male: {
			restrict: [
				[filters.owned],
				[filters.friend, filters.female],
				[filters.owned, filters.empty]
			],
			use: function(src, target1, target2) {
				target2.card = {
					_id: '389222-fvzT8A04',
					version: 1,
					name: 'GROW TUBE',
					hasImage: true,
					attack: 0,
					health: 1,
					moves: 0,
					abilities: ['grow'],
					parent: _.clone(src.card)
				};
			}
		},

		/**
		 * Female: Can reproduce with males.
		 */
		FEMALE: 'feml',
		feml: {
			restrict: [
				[filters.owned],
				[filters.friend, filters.male],
				[filters.owned, filters.empty]
			],
			use: function(src, target1, target2) {
				target2.card = {
					_id: '389222-fvzT8A04',
					version: 1,
					name: 'GROW TUBE',
					hasImage: true,
					attack: 0,
					health: 1,
					moves: 0,
					abilities: ['grow'],
					parent: _.clone(src.card)
				};
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