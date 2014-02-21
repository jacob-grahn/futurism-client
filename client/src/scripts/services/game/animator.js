angular.module('futurism')
	.factory('animator', function() {
		'use strict';

		var animator = {

			animationLookup: {},
			queue: [],
			running: false,


			/**
			 * register an animation to be used
			 * @param name
			 * @param animation
			 */
			addAnimation: function(name, animation) {
				animator.animationLookup[name] = animation;
			},


			/**
			 * play an animation for an action or force like heal or poison
			 * @param {String} name
			 * @param {Object} changes
			 * @param {Function} callback
			 */
			animateUpdate: function(name, changes, callback) {
				var animation = animator.animationLookup[name];
				if(!animation) {
					console.log('No animation found for "'+name+'"');
					return callback();
				}
				console.log('Running animation "'+name+'"');
				queue.push({animation: animation, changes: changes, callback: callback});
				animator.run();
			},


			/**
			 * play the next animation in the queue
			 */
			run: function() {
				if(!animator.running && animator.queue.length > 0) {
					animator.running = true;

					var task = queue.shift();
					task.animation.run(task.changes, function(err) {
						task.callback(err);
						animator.running = false;
						return animator.run();
					});
				}
			}
		};

		return animator;
	});