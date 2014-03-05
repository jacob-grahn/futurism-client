angular.module('futurism')
	.factory('animator', function($rootScope, $timeout) {
		'use strict';

		var queue = [];
		var running = false;


		var animator = {


			/**
			 * play an animation for an action or force like heal or poison
			 * @param {String} name
			 * @param {Object} changes
			 * @param {Function} callback
			 */
			animateUpdate: function(name, changes, callback) {
				var task = {name: name, changes: changes, callback: callback};
				queue.push(task);
				animator.run();
			},


			/**
			 * play the next animation in the queue
			 */
			run: function() {
				if(!running && queue.length > 0) {
					var task = queue[0];
					running = true;
					if(task.name) {
						console.log('*** begin animating '+task.name+' ***', task.changes);
						$rootScope.$broadcast('event:'+task.name, task.changes);
						$timeout(onAnimationComplete, 2500); //fallback timeout...
					}
					else {
						onAnimationComplete();
					}
				}
			}
		};


		/**
		 * Listen for when animations are finished
		 * animations are expected to broadcast this event whenever it is ok to continue
		 */
		$rootScope.$on('event:animationComplete', function() {
			onAnimationComplete();
		});


		var onAnimationComplete = function() {
			if(queue.length > 0) {
				console.log('*** animation complete ***');
				var task = queue.shift();
				running = false;
				task.callback();
				animator.run();
			}
		};


		return animator;
	});