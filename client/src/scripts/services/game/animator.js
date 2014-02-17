angular.module('futurism')
	.factory('animator', function(socket, errorHandler) {
		'use strict';

		var animator = {

			queue: [],
			running: false,

			addAnimation: function(eventName, animation) {
				socket.$on(eventName, function(data) {
					animator.queue.push({event: eventName, data: data, animation: animation});
					animator.run();
				});
			},

			run: function() {
				if(!animator.running && animator.queue.length > 0) {
					animator.running = true;
					var task = queue.shift();
					animator.animateEvent(task, function(err) {
						if(err) {
							errorHandler.show(err);
						}
						animator.running = false;
						return animator.run();
					});
				}
			},

			animateEvent: function(task, callback) {
				task.animation.run(task.data, callback);
			}

		};

		animator.addAnimation('gameStatus', function(data, callback) {

		});

		animator.addAnimation('turn', function(data, callback) {

		});

		animator.addAnimation('gameUpdate', function(data, callback) {

		});

		animator.addAnimation('gameOver', function(data, callback) {

		});

		return animator;
	});