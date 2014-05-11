angular.module('futurism')
    .factory('langUrl', function($rootScope, $routeParams, lang) {
        'use strict';
        
        return {
            init: function() {
                $rootScope.$on('$routeChangeSuccess', function() {
                    if($routeParams.lang) {
                        lang.setLang($routeParams.lang);
                    }
                });
            }
        };
    });