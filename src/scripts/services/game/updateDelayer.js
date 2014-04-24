angular.module('futurism')
    .factory('updateDelayer', function($rootScope, $timeout) {
        'use strict';

        var queue = [];
        var running = false;


        var self = {

            delay: 0,


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
             * start delaying the next update in the queue
             */
            run: function() {
                if(!running && queue.length > 0) {
                    var task = queue.shift();
                    running = true;
                    self.preTask(task);
                }
            },


            /**
             * emit pre task event and wait delay ms
             * @param task
             */
            preTask: function(task) {
                self.delay = 0;
                $rootScope.$broadcast('pre:'+task.name, task.changes, self);

                if(self.delay === 0) {
                    self.postTask(task);
                }
                else {
                    $timeout(function() {
                        self.postTask(task);
                    }, self.delay);
                }
            },


            /**
             * do the task, emit post task event, and wait delay ms
             * @param task
             */
            postTask: function(task) {
                task.callback(task);

                self.delay = 0;
                $rootScope.$broadcast('post:'+task.name, task.changes, self);

                if(self.delay === 0) {
                    self.finish();
                }
                else {
                    $timeout(self.finish, self.delay);
                }
            },


            /**
             * the delay is complete, move on to the next one
             */
            finish: function() {
                running = false;
                self.run();
            }

        };


        return self;
    });