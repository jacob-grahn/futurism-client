angular.module('futurism')
    .factory('updateDelayer', function($rootScope, $timeout) {
        'use strict';

        var queue = [];
        var running = false;
        var delay = 0;


        /**
         * listen for animations that request more time
         */
        $rootScope.$on('animDelay', function(srcScope, requestedDelay) {
            delay = requestedDelay;
        });


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
                    delay = 0;

                    $rootScope.$broadcast('pre:'+task.name, task.changes);
                    task.callback(task);
                    $rootScope.$broadcast('post:'+task.name, task.changes);

                    $timeout(function() {
                        running = false;
                        self.run();
                    }, delay);
                }
            }



        };


        return self;
    });