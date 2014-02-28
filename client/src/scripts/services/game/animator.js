angular.module('futurism')
	.factory('animator', function($rootScope, $timeout, errorHandler) {
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

					running = true;
					var task = queue.shift();

					$rootScope.$broadcast('event:'+task.name, task.changes);

					$timeout(function() {
						running = false;
						task.callback();
						return animator.run();
					}, animator.eventWaitTime(task.name));
				}
			},


			/**
			 * returns how long to wait for certain animation events
			 * @param {string} name
			 * @returns {number}
			 */
			eventWaitTime: function(name) {
				var wait = 1;
				if(name === 'turn') {
					wait = 2000;
				}
				return wait;
			}
		};

		return animator;
	});