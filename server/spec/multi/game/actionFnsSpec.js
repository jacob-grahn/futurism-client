describe('table', function() {

	var user1 = {
		_id: 1,
		name: 'Philly',
		team: 1,
		columns: [[null,null,null],[null,null,null],[null,null,null],[null,null,null]]
	};
	//targetId: 3
	user1.columns[1][0] = {
		name: 'Big Bertha',
		abilities: ['bees'],
		health: 15,
		attack: 6
	};

	var user2 = {
		_id: 2,
		name: 'Sue Grafton',
		team: 2,
		columns: [[null,null,null],[null,null,null],[null,null,null],[null,null,null]]
	};
	//targetId: 12
	user2.columns[0][0] = {
		name: 'Wolyump',
		abilities: ['heal'],
		health: 4,
		attack: 2
	};
	//targetId: 13
	user2.columns[0][1] = {
		name: 'raptor',
		abilities: ['sduc'],
		health: 1,
		attack: 9
	};



	var table;


	beforeEach(function() {
		table = require('../../../multi/game/table')([user1, user2]);
	});


	it('should perform a valid action', function() {
		var result = table.doAction(user2, 'heal', [12], 12);
		expect(result).toBe('success');
		expect(user2.columns[0][0].health).toBe(5);
	});


	it('should not perform an action on an invalid target', function() {
		var result = table.doAction(user1, 'attk', [0], 0);
		expect(result).not.toBe('success');
	});


	it('should not let you use a card you do not own', function() {
		var result = table.doAction(user1, 'attk', [13], 12);
		expect(result).toBe('this is not your card');
	});


	it('should not let you use an ability the card does not have', function() {
		var result = table.doAction(user2, 'sduc', [3], 12);
		expect(result).toBe('card does not have this ability');
	});


	it('should perform multi-step validations', function() {
		var result = table.doAction(user2, 'sduc', [3,14], 13);
		expect(result).toBe('success');
	});


	it('should fail bad multi-step validations', function() {
		var result = table.doAction(user2, 'sduc', [3,1], 13);
		expect(result).toBe('that target is not allowed');
	});



});