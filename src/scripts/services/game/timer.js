angular.module('futurism')
    .factory('timer', function($timeout) {
        'use strict';
        
        var self = {
            timeLeft: 0
        };
        
        var tick = function() {
            if(self.timeLeft > 0) {
                self.timeLeft--;
            }
            $timeout(tick, 1000);
        };
        
        tick();
        
        return self;
    });