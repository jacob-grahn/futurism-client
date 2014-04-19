(function() {

    'use strict';

    var message = '';

    var handle = function(str) {
        message = str;
    };

    var callback = function(err) {
        if(err) {
            handle(err);
        }
    };

    var getLastError = function() {
        return message;
    };

    var reset = function() {
        message = null;
    };

    window.errorHandlerMock = {
        getLastError: getLastError,
        handle: handle,
        callback: callback,
        reset: reset
    };

}());