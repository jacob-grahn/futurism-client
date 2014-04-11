describe('deckFns', function() {

	var deckFns = require('../../../shared/deckFns');
	var cardFns = require('../../../shared/cardFns');


	it('should tally a deck pride', function() {
		var deck = {
			cards: [
				{attack: 0, health: 1, abilities: []},
				{attack: 1, health: 1, abilities: ['tree']}
			]
		};
		expect(deckFns.calcPride(deck)).toBe(4);
	});


	it('should sum how many times an ability is used in a deck', function() {
		var deck = {
			cards: [
				{
					attack: 5,
					health: 3,
					abilities: ['abom'],
					faction: 'en'
				},
				{
					attack: 2,
					health: 1,
					abilities: ['tree', 'abom'],
					faction: 'el'
				}
			]
		};

		var desc = deckFns.analyze(deck);

		expect(desc.stats.attack).toBe(7);
		expect(desc.stats.health).toBe(4);
		expect(desc.stats.pride).toBe(deckFns.calcPride(deck));
		expect(desc.abilities.abom.count).toBe(2);
		expect(desc.factions.en.count).toBe(1);
		expect(desc.factions.en.perc).toBe(0.5);
		expect(desc.factions.me).toBe(undefined);
	});
});