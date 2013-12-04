(function () {
	'use strict';

	var ent = {
		id: 'en',
		name: 'Ent',
		desc: 'Seeking a bond with nature, the Ents tinkered with their own dna. A wild group of nomads, they say you\'ll never meet the same Ent twice.',
		abilities: [
			{id: 'heal', name: 'healing', desc: 'Target card gains 1 health.'},
			{id: 'tree', name: 'weed trees', desc: 'A 1/1 tree is created'},
			{id: 'abom', name: 'abomination', desc: 'Merge this unit with another.'},
			{id: 'secr', name: 'secretions', desc: 'Target enemy can not attack next turn.'},
			{id: 'clne', name: 'clone', desc: 'Sacrifice this unit to produce a duplicate of another unit.'},
			{id: 'bees', name: 'bees!', desc: 'All enemies in target column loose 1 health.'}
		]
	};

	var machine = {
		id: 'mc',
		name: 'Machine',
		desc: 'The relentless pursuit of knowledge led some to improve their minds with metal. They have become far more than humans ever were, and far less.',
		abilities: [
			{id: 'rbld', name: 'rebuild', desc: 'Resurrect a dead machine.'},
			{id: 'shld', name: 't-shield', desc: 'All damage that would be dealt to target unit is reduced by 1 for a turn.'},
			{id: 'prci', name: 'precise', desc: 'Attack an enemy of your choice regardless of defensive formations.'},
			{id: 'strt', name: 'strategist', desc: 'Ally can perform an extra action this turn'},
			{id: 'netw', name: 'networking', desc: 'Gain an allies abilities.'},
			{id: 'tran', name: 'transformer', desc: 'Swap health and attack.'}
		]
	};


	var elite = {
		id: 'el',
		name: 'Elite',
		desc: 'Taking delight in the pleasures of this world, Elites have dominated the wealthy ruling class. A beautiful people, as long as you don\'t dig too deep.',
		abilities: [
			{id: 'sduc', name: 'seduction', desc: 'Convert an enemy to your side if their health is 1.'},
			{id: 'assn', name: 'assassin', desc: 'Attack without taking damage.'},
			{id: 'delg', name: 'delegate', desc: 'Trade this unit with another unit in your hand.'},
			{id: 'posn', name: 'poison', desc: 'Target enemy looses 1 health per turn.'},
			{id: 'bagm', name: 'bag \'em', desc: 'Target card is returned to its owners hand.'},
			{id: 'siph', name: 'siphon', desc: 'Steal 1 health from a card of your choice.'}
		]
	};


	var zealot = {
		id: 'ze',
		name: 'Zealot',
		desc: 'Always certain of the truth, Zealots are more than willing to fight for it. The fires of constant war have honed their military skills to perfection.',
		abilities: [
			{id: 'male', name: 'male', desc: 'Can reproduce with females.'},
			{id: 'feml', name: 'female', desc: 'Can reproduce with males.'},
			{id: 'btle', name: 'battle cry', desc: 'Target unit gains 2 attack for the turn.'},
			{id: 'detr', name: 'determined', desc: 'Sacrifice this card to deal double damage.'},
			{id: 'hero', name: 'heroic sacrifice', desc: 'All enemy attacks must target this card for one turn.'},
			{id: 'serm', name: 'super serum', desc: 'Available health points are converted into attack points'}
		]
	};


	var factionLookup = {};
	var abilityLookup = {};


	var createLookups = function () {
		var factions = [ent, machine, elite, zealot];

		for (var i = 0; i < factions.length; i++) {
			var fact = factions[i];
			factionLookup[fact.id] = fact;
			for (var j = 0; j < fact.abilities.length; j++) {
				var abil = fact.abilities[j];
				abil.faction = fact.id;
				abilityLookup[abil.id] = abil;
			}
		}
	};
	createLookups();


	var Factions = {
		factionLookup: factionLookup,
		abilityLookup: abilityLookup,
		ent: ent,
		machine: machine,
		elite: elite,
		zealot: zealot
	};

	if (typeof module !== 'undefined') {
		module.exports = Factions;
	}
	else {
		window.futurismShared = window.futurismShared || {};
		window.futurismShared.factions = Factions;
	}
}());