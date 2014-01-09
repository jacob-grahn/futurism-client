describe('rankCalc', function() {

	var rankCalc;

	beforeEach(function() {
		//load the module
		module('futurism');

		//inject
		inject(function(_rankCalc_) {
			rankCalc = _rankCalc_;
		});
	});



	describe('expToRank', function() {

		it('should return a lower number', function() {
			var rankExp = 123;
			var rankRank = rankCalc.expToRank(rankExp);
			expect(rankRank).toBeLessThan(rankExp);
		});

		it('should return 0 for invalid or negative inputs', function() {
			expect(rankCalc.expToRank(0)).toBe(0);
			expect(rankCalc.expToRank(null)).toBe(0);
			expect(rankCalc.expToRank(undefined)).toBe(0);
			expect(rankCalc.expToRank(-145)).toBe(0);
			expect(rankCalc.expToRank(NaN)).toBe(0);
			expect(rankCalc.expToRank('hello!')).toBe(0);
		});

		it('should reverse rankToExp', function() {
			var rank = 10;
			var exp = rankCalc.rankToExp(rank);
			var rank2 = rankCalc.expToRank(exp);
			expect(rank).toBeCloseTo(rank2, 0);
		});
	});


	describe('rankToExp', function() {

		it('should return a higher number', function() {
			var rankRank = 13;
			var rankExp = rankCalc.rankToExp(rankRank);
			expect(rankRank).toBeLessThan(rankExp);
		});

		it('should return 0 for invalid or negative inputs', function() {
			expect(rankCalc.rankToExp(0)).toBe(0);
			expect(rankCalc.rankToExp(null)).toBe(0);
			expect(rankCalc.rankToExp(undefined)).toBe(0);
			expect(rankCalc.rankToExp(-145)).toBe(0);
			expect(rankCalc.rankToExp(NaN)).toBe(0);
			expect(rankCalc.rankToExp('hello!')).toBe(0);
		});

		it('should reverse expToRank', function() {
			var exp = 15976;
			var rank = rankCalc.expToRank(exp);
			var baseExp = rankCalc.rankToExp(rank);
			var rank2 = rankCalc.expToRank(baseExp);
			var exp3 = rankCalc.rankToExp(rank2);
			expect(baseExp).toBeCloseTo(exp3, 0);
		});
	});


	describe('expNeeded', function() {

		it('should return a positive number', function() {
			expect(rankCalc.expNeeded(5)).toBeGreaterThan(0);
		});

		it('should produce larger results when given larger numbers', function() {
			expect(rankCalc.expNeeded(45)).toBeLessThan(rankCalc.expNeeded(46));
		});

		it('should return how much exp is needed to rank up', function() {
			var exp = 976539;
			var rank = rankCalc.expToRank(exp);
			var expBase = rankCalc.rankToExp(rank);
			var expNeeded = rankCalc.expNeeded(rank);
			expect(rankCalc.expToRank(expBase + expNeeded)).toEqual(rank+1);
			expect(rankCalc.expToRank(expBase + expNeeded + 1)).toEqual(rank+1);
			expect(rankCalc.expToRank(expBase + expNeeded - 1)).toEqual(rank);
		});

		it('should return 0 for invalid or negative inputs', function() {
			expect(rankCalc.expNeeded(0)).toBe(0);
			expect(rankCalc.expNeeded(null)).toBe(0);
			expect(rankCalc.expNeeded(undefined)).toBe(0);
			expect(rankCalc.expNeeded(-145)).toBe(0);
			expect(rankCalc.expNeeded(NaN)).toBe(0);
			expect(rankCalc.expNeeded('hello!')).toBe(0);
			expect(rankCalc.expNeeded({})).toBe(0);
		});
	});


	describe('expRemainder', function() {

		it('should return 0 if you have exactly enough exp to be on a new rank', function() {
			expect(rankCalc.expRemainder(9)).toBe(9);
			expect(rankCalc.expRemainder(10)).toBe(0);
			expect(rankCalc.expRemainder(11)).toBe(1);
		});

		it('should return 0 for invalid or negative inputs', function() {
			expect(rankCalc.expRemainder(0)).toBe(0);
			expect(rankCalc.expRemainder(null)).toBe(0);
			expect(rankCalc.expRemainder(undefined)).toBe(0);
			expect(rankCalc.expRemainder(-145)).toBe(0);
			expect(rankCalc.expRemainder(NaN)).toBe(0);
			expect(rankCalc.expRemainder('hello!')).toBe(0);
			expect(rankCalc.expRemainder({})).toBe(0);
		});
	});
});