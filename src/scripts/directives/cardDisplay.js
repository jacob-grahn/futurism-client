angular.module('futurism')
    .directive('cardDisplay', function(lang) {
        'use strict';

        return {
            restrict: 'E',
            replace: false,
            templateUrl: 'views/card-display.html',

            scope: {
                card: '=',
                size: '@',
                useButtons: '@',
                actionFn: '&'
            },

            link: function (scope) {
                scope.lang = lang;

                scope.doAction = function(abilityId) {
                    scope.actionFn({abilityId: abilityId, card: scope.card});
                }
            }
        };

    });