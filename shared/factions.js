(function () {
	'use strict';

	var ent = {
		id: 'en',
		abilities: [
			{id: 'heal'},
			{id: 'tree'},
			{id: 'abom'},
			{id: 'secr'},
			{id: 'clne'},
			{id: 'bees'}
		]
	};

	var machine = {
		id: 'mc',
		abilities: [
			{id: 'rbld'},
			{id: 'shld'},
			{id: 'prci'},
			{id: 'strt'},
			{id: 'netw'},
			{id: 'tran'}
		]
	};


	var elite = {
		id: 'el',
		abilities: [
			{id: 'sduc'},
			{id: 'assn'},
			{id: 'delg'},
			{id: 'posn'},
			{id: 'bagm'},
			{id: 'siph'}
		]
	};


	var zealot = {
		id: 'ze',
		abilities: [
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