angular.module('futurism')
    .directive('chatLog', function() {
        'use strict';

        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'views/chat-log.html',
            scope: {
                msgs: '='
            },

            link: function(scope) {

                scope.filter = function(str) {
                    //zalgo filter
                    str = str.replace(/[\u0300-\u036f\u0483-\u0489\u1dc0-\u1dff\u20d0-\u20ff\ufe20-\ufe2f]/g, '');

                    //newline filter
                    str = str.replace(/\n\r/g, '');

                    //all done!
                    return str;
                };

            }
        };

    });