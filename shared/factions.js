(function () {
	'use strict';

	var commander = {
		id: 'no',
		abilities: [
			{id: 'sumn'},
			{id: 'move'},
			{id: 'attk'},
			{id: 'futr'}
		]
	};

	var ent = {
		id: 'en',
		abilities: [
			{id: 'siph'},
			{id: 'move'},
			{id: 'heal'},
			{id: 'tree'},
			{id: 'abom'},
			{id: 'peap'},
			{id: 'bees'}
		]
	};

	var machine = {
		id: 'mc',
		abilities: [
			{id: 'prci'},
			{id: 'move'},
			{id: 'rbld'},
			{id: 'shld'},
			{id: 'rech'},
			{id: 'netw'},
			{id: 'tran'}
		]
	};


	var elite = {
		id: 'el',
		abilities: [
			{id: 'assn'},
			{id: 'move'},
			{id: 'sduc'},
			{id: 'delg'},
			{id: 'posn'},
			{id: 'bagm'},
			{id: 'tlpt'}
		]
	};


	var zealot = {
		id: 'ze',
		abilities: [
			{id: 'frvt'},
			{id: 'move'},
			{id: 'male'},
			{id: 'feml'},
			{id: 'btle'},
			{id: 'detr'},
			{id: 'hero'},
			{id: 'serm'}
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
		zealot: zealot,
		ENT: ent.id,
		MACHINE: machine.id,
		ELITE: elite.id,
		ZEALOT: zealot.id
	};

	if (typeof module !== 'undefined') {
		module.exports = Factions;
	}
	else {
		window.futurismShared = window.futurismShared || {};
		window.futurismShared.factions = Factions;
	}
}());