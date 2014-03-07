angular.module('futurism')
	.factory('updateDelayer', function($rootScope, $timeout) {
		'use strict';

		var queue = [];
		var running = false;
		var playbackRate = 1000;


		var self = {


			/**
			 * add an update to the queue
			 * @param {String} name
			 * @param {Object} changes
			 * @param {Function} callback
			 */
			add: function(name, changes, callback) {
				var task = {name: name, changes: changes, callback: callback};
				queue.push(task);
				self.run();
			},


			/**
			 * apply the next update in the queue
			 */
			run: function() {

				if(!running && queue.length > 0) {
					var task = queue.shift();
					running = true;

					task.callback(task);

					$rootScope.$broadcast('event:'+task.name, task.changes);

					$timeout(function() {
						running = false;
						self.run();
					}, playbackRate);
				}
			}
		};


		return self;
	});