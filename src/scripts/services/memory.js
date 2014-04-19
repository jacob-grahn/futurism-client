angular.module('futurism')
    .factory('memory', function(window) {
        'use strict';

        var shortMem = {};
        var longMem = {};

        return {

            // short term memory will last until the browser is closed
            short: {
                set: function(key, value) {
                    if(typeof window.Storage !== 'undefined') {
                        window.sessionStorage.setItem(key, value);
                    }
                    else {
                        shortMem[key] = value;
                    }
                },
                get: function(key) {
                    if(typeof window.Storage !== 'undefined') {
                        return window.sessionStorage.getItem(key);
                    }
                    else {
                        return shortMem[key];
                    }
                }
            },

            // long term memory will last as long as it can
            long: {
                set: function(key, value) {
                    if(typeof window.Storage !== 'undefined') {
                        window.localStorage.setItem(key, value);
                    }
                    else {
                        longMem[key] = value;
                    }
                },
                get: function(key) {
                    if(typeof window.Storage !== 'undefined') {
                        return window.localStorage.getItem(key);
                    }
                    else {
                        return longMem[key];
                    }
                }
            }
        };
    });