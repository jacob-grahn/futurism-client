angular.module('futurism')
    .factory('messager', function($timeout) {
        'use strict';
        var self = this;
        var messages = [];
        self.cur = null;


        self.addMessage = function(message) {
            message.txt = message.txt || '';
            message.type = message.type || 'normal';
            message.interrupt = message.interrupt || false;
            message.duration = message.duration || 4000;

            if(message.interrupt) {
                self.cur = null;
                messages = [message];
            }
            else {
                messages.push(message);
            }
            self.showNext();
        };


        self.showNext = function() {
            if(!self.cur && messages.length > 0) {
                self.cur = messages.shift();
                $timeout(self.endShow, self.cur.duration);
            }
        };


        self.endShow = function() {
            self.cur = null;
            self.showNext();
        };


        self.clear = function() {
            self.cur = null;
            messages = [];
        };

        return self;

    });