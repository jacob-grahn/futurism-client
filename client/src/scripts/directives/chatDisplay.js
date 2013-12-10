angular.module('futurism')
	.directive('chatDisplay', function(Chat, lang) {
		'use strict';

		return {
			restrict: 'E',
			replace: true,
			scope: {
				room: '@'
			},
			templateUrl: 'views/chat-display.html',

			link: function (scope, elem) {

				var chat = new Chat(scope.room);
				var lastScrollTop;

				chat.subscribe();
				scope.chat = chat;
				scope.lang = lang;


				var scrollToBottom = function() {
					var log = elem.find('.chat-log');
					var scrollTop = log[0].scrollTop;
					var scrollHeight = log[0].scrollHeight - log.height() + 50;

					console.log(scrollTop, scrollHeight);

					if(lastScrollTop >= scrollTop) {
						console.log('force scroll');
						log[0].scrollTop -= 15;
					}

					lastScrollTop = scrollTop;

					log.clearQueue();
					log.animate({scrollTop: scrollHeight}, 250);
				};


				scope.sendMessage = function() {
					if(scope.typedMessage) {
						chat.send(scope.typedMessage);
						scope.typedMessage = null;
					}
				};


				scope.$watch('chat.getReceivedCount()', function() {
					scrollToBottom();
				});


				scope.$on('$destroy', function() {
					chat.unsubscribe();
				});
			}
		};

	});