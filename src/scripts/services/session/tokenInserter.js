(function() {

    'use strict';

    angular.module('futurism')

        .factory('tokenInserter', function(memory) {
            return {
                request: function(config) {
                    var token = memory.short.get('token');
                    if(token) {
                        config.headers['Session-Token'] = memory.short.get('token');
                    }
                    return config;
                }
            };
        })

        .config(function($httpProvider) {
            $httpProvider.interceptors.push('tokenInserter');
        });

}());