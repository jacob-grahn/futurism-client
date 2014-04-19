angular.module('futurism')
    .directive('username', function(modals) {
        'use strict';

        return {
            restrict: 'E',
            replace: true,
            scope: {
                link: '@',
                size: '@',
                user: '='
            },
            templateUrl: 'views/username.html',
            link: function(scope) {

                scope.displaySize = scope.size || 'small';

                if(scope.displaySize === 'small') {
                    scope.avatarWidth = 16;
                    scope.avatarHeight = 16;
                }
                if(scope.displaySize === 'large') {
                    scope.avatarWidth = 48;
                    scope.avatarHeight = 48;
                }

                scope.showUser = function (userId) {
                    var link = scope.link || 'true';
                    if(link === 'true') {
                        modals.openUser(userId);
                    }
                };
            }
        };

    });

