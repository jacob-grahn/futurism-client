angular.module('futurism')
    .factory('errorHandler', function($location, messager, session) {
        'use strict';

        var message = '';

        var fatal = function(err) {
            err.stack = err.stack;
            message = err;
            if(err.error) {
                message = err.error;
            }
            session.destroy();
            $location.url('/error');
        };

        var show = function(str) {
            messager.addMessage({txt: str, type: 'error'});
        };

        var callback = function(err) {
            if(err) {
                fatal(err);
            }
        };

        var getLastError = function() {
            return message;
        };

        var reset = function() {
            message = null;
        };

        return {
            getLastError: getLastError,
            fatal: fatal,
            callback: callback,
            reset: reset,
            show: show
        };
    });