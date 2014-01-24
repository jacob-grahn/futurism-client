'use strict';

var isName = require('../../../server/validators/isName');

describe('isNameDisplay', function() {

	it('should accept a string of one character', function() {
		expect(isName('a')).toBe(true);
	});

	it('should accept a string of 40 characters', function() {
		expect(isName('0000000000111111111122222222223333333333')).toBe(true);
	});

	it('should not accept anything else', function() {
		expect(isName(['hi'])).toBe(false);
		expect(isName('')).toBe(false);
		expect(isName(true)).toBe(false);
		expect(isName({hi:true})).toBe(false);
		expect(isName('00000000001111111111222222222233333333334')).toBe(false);
	});
});