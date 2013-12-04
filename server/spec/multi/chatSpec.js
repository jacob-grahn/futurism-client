describe('lobby', function() {

	var Chat = require('../../multi/chat');

	var lastMessage = '';
	var ioMock = {
		sockets: {
			in: function(roomName) {
				return {
					emit: function(eventName) {
						lastMessage = roomName + ':' + eventName;
					}
				}
			}
		}
	};

	Chat.init(ioMock);


	beforeEach(function() {
		Chat.clear();
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
			room.add({name:'feilix'}, i);
		}
		expect(room.getHistory().length).toBe(20);
	});

});