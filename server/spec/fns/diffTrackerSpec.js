describe('diffTracker', function() {

	var DiffTracker = require('../../fns/diffTracker');


	it('should default to an empty object', function() {
		var tracker = new DiffTracker();
		expect(tracker.state).toEqual({});
	});


	it('should accept an initial value', function() {
		var tracker = new DiffTracker({value: 'test'});
		expect(tracker.state).toEqual({value: 'test'});
	});


	it('should return incremental diffs', function() {
		var obj = {test: 'begin'};
		var tracker = new DiffTracker(obj);
		expect(tracker.diff(obj)).toEqual({});

		obj.test = 'paris';
		expect(tracker.diff(obj)).toEqual({test: 'paris'});

		obj.pandas = [{name: 'sally'}, {name: 'bobo'}];
		expect(tracker.diff(obj)).toEqual({pandas: [{name: 'sally'}, {name: 'bobo'}]});

		obj.pandas[1].name = 'felix';
		expect(tracker.diff(obj)).toEqual({pandas: [undefined, {name: 'felix'}]})
	});
});