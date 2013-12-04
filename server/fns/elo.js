module.exports = {

	getExpectedScores: function(ratingA, ratingB) {
		var expectedScoreA = 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
		var expectedScoreB = 1 / (1 + Math.pow(10, (ratingA - ratingB) / 400));
		return {
			a: expectedScoreA,
			b: expectedScoreB
		};
	},

	getNewRatings: function(ratingA, ratingB, expectedA, expectedB, scoreA, scoreB, kFactor) {
		var newRatingA = ratingA + (kFactor * (scoreA - expectedA));
		var newRatingB = ratingB + (kFactor * (scoreB - expectedB));
		return {
			a: newRatingA,
			b: newRatingB
		};
	},

	calcChange: function(ratingA, ratingB, scoreA, scoreB) {
		var kFactor = 16;
		var expectedScores = module.exports.getExpectedScores(ratingA, ratingB);
		var newRatings = module.exports.getNewRatings(ratingA, ratingB, expectedScores.a, expectedScores.b, scoreA, scoreB, kFactor);
		return(newRatings);
	}

};


/*
 //--- elo test
 Elo = new require('./fns/elo');
 var results = Elo.calcChange(ratingA, ratingB, winsA, winsB);
 console.log('A: ' + results.a + ' - ' + 'B: ' + results.b);
 */