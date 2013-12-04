describe('decks-delete', function() {

	var mongoose = require('mongoose');
	var mockgoose = require('mockgoose');
	mockgoose(mongoose);

	var DeckGoose = require('../../models/deck');
	var decksDelete = require('../../routes/decksDelete');


	beforeEach(function(done) {
		DeckGoose.create({
			_id: '1-deck',
			name: 'Saints',
			cards: ['st.pattrick', 'st.peters', 'thepope'],
			userId: 1,
			pride: 17
		},
		function(err, deck) {
			if(err) {
				console.log('decksDeleteSpec::beforeEach', err);
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
				userId: 1
			},
			body: {
				deckId: '1-deck'
			}
		};
		decksDelete(request, {apiOut: function(err, result) {
			expect(result.name).toBe('Saints');
			done();
		}});
	});


});