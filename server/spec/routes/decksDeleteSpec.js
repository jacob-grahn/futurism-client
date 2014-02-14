describe('decks-delete', function() {

	var mongoose = require('mongoose');
	var mockgoose = require('mockgoose');
	mockgoose(mongoose);

	var DeckGoose = require('../../models/deck');
	var decksDelete = require('../../routes/decksDelete');


	var userId1 = mongoose.Types.ObjectId();
	beforeEach(function(done) {
		DeckGoose.create({
			_id: '1-deck',
			name: 'Saints',
			cards: ['st.pattrick', 'st.peters', 'thepope'],
			userId: userId1,
			pride: 17
		},
		function(err, deck) {
			if(err) {
				throw err;
			}
			done();
		});
	});


	afterEach(function() {
		mockgoose.reset();
	});


	it('should delete an existing deck', function(done) {
		var request = {
			session: {
				userId: userId1
			},
			body: {
				deckId: '1-deck'
			}
		};
		decksDelete(request, {apiOut: function(err, result) {
			done(err);
		}});
	});


});