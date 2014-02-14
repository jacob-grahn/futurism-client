describe('cards-post', function() {

	var mongoose = require('mongoose');
	var mockgoose = require('mockgoose');
	mockgoose(mongoose);
	require('../../fns/mongoose/findByIdAndSave').attach(mongoose);

	var cardsPost = require('../../routes/cardsPost');
	var request = {};


	beforeEach(function() {
		request = {
			session: {
				_id: mongoose.Types.ObjectId()
			},
			body: {
				name: 'TestCard',
				abilities: 'tree,bees',
				attack: 1,
				health: 1,
				story: 'This is the best card ever.',
				faction: 'no'
			}
		};
	});


	it('should save a valid card', function(done) {
		cardsPost(request, {apiOut: function(error, result) {
			expect(error).toBe(null);
			expect(result._id).toBeTruthy();
			done();
		}});
	});


	it('xss attacks should be removed from the story', function(done) {
		request.body.story = '<SCRIPT SRC="http://ha.ckers.org/xss.js"></SCRIPT>';
		cardsPost(request, {apiOut: function(error, result) {
			expect(error).toBe(null);
			expect(result.story).toBe('[removed][removed]');
			done();
		}});
	})


	it('should not save invalid name', function(done) {
		request.body.name = 'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW';
		cardsPost(request, {apiOut: function(error, result) {
			expect(error.message).toBe('Validation failed');
			done();
		}});
	});


	it('should not save invalid abilities', function(done) {
		request.body.abilities = JSON.stringify([{bla:true}]);
		cardsPost(request, {apiOut: function(error, result) {
			expect(error.message).toBe('Validation failed');
			done();
		}});
	});


	it('should not save invalid attack', function(done) {
		request.body.attack = 'this is a string';
		cardsPost(request, {apiOut: function(error, result) {
			expect(error.message).toContain('NaN');
			done();
		}});
	});


	 it('should not save invalid health', function(done) {
		request.body.health = -1;
		cardsPost(request, {apiOut: function(error, result) {
			expect(error.message).toBe('Validation failed');
			done();
		}});
	});


	it('should not save invalid story', function(done) {
		request.body.story = 'a really long storyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy';
		cardsPost(request, {apiOut: function(error, result) {
			expect(error.message).toBe('Validation failed');
			done();
		}});
	});


});