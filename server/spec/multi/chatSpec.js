describe('lobby', function() {

	var Chat = require('../../multi/chat');
	var broadcast = require('../../multi/broadcast');

	var lastMessage = '';


	beforeEach(function() {
		Chat.clear();
	});


	it('should filter xss attacks', function() {
		var room = new Chat('room');
		room.add({}, '<SCRIPT SRC=http://ha.ckers.org/xss.js></SCRIPT>');
		expect(broadcast.lastMessage.data.txt).toBe('[removed][removed]');
	});


	it('should limit messages to 100 chars', function() {
		var room = new Chat('room');
		var txt = '!!!!!!!!!! !!!!!!!!!! !!!!!!!!!! !!!!!!!!!! !!!!!!!!!! !!!!!!!!!! !!!!!!!!!! !!!!!!!!!! !!!!!!!!!! !!!!!!!!!! !!!!!!!!!!'; //something like 120 characters
		room.add({}, txt);
		expect(broadcast.lastMessage.data.txt.length).toBe(100);
	});


	it('should create new rooms', function() {
		var room1 = new Chat('room1');
		var room2 = new Chat('room2');
		expect(room1.roomName).toBe('room1');
		expect(Chat.getChat('room2')).toBe(room2);
	});


	it('should store messages', function() {
		var room = new Chat('room1');
		Chat.safeAdd({name:'bob'}, 'hi', 'room1');
		Chat.safeAdd({name:'bob'}, 'well', 'room1');
		expect(room.getHistory().length).toBe(2);
	});


	it('should prune old messages', function() {
		var room = new Chat('batman');
		for(var i=0; i<25; i++) {
			room.add({name:'feilix'}, 'str'+i);
		}
		expect(room.getHistory().length).toBe(20);
	});

});