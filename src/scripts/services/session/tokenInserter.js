(function() {

    'use strict';

    angular.module('futurism')

        .factory('tokenInserter', function(memory) {
            return {
                request: function(config) {
                    config.headers['Session-Token'] = memory.short.get('token');;
                    return config;
                }
            };
        })

        .config(function($httpProvider) {
            $httpProvider.interceptors.push('tokenInserter');
        });

}());