angular.module('futurism')
	.factory('animator', function(noAnimation, rallyAnimation) {
		'use strict';

		var animationLookup = {
			'rlly': rallyAnimation
		};
		var queue = [];
		var running = false;


		var animator = {

			/**
			 * register an animation to be used
			 * @param name
			 * @param animation
			 */
			addAnimation: function(name, animation) {
				animationLookup[name] = animation;
			},


			/**
			 * play an animation for an action or force like heal or poison
			 * @param {String} name
			 * @param {Object} changes
			 * @param {Function} callback
			 */
			animateUpdate: function(name, changes, callback) {
				var animation = animationLookup[name];
				if(!animation) {
					animation = noAnimation;
				}
				console.log('Running animation "'+name+'"');
				queue.push({animation: animation, changes: changes, callback: callback});
				animator.run();
			},


			/**
			 * play the next animation in the queue
			 */
			run: function() {
				if(!running && queue.length > 0) {
					running = true;

					var task = queue.shift();
					task.animation.run(task.changes, function(err) {
						task.callback(err);
						running = false;
						return animator.run();
					});
				}
			}
		};

		return animator;
	});