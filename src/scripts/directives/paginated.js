angular.module('futurism')
    .directive('paginated', function() {
        'use strict';

        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            templateUrl: 'views/paginated.html',

            scope: {
                resource: '=',
                results: '=',
                query: '=',
                refreshOn: '@',
                show: '@'
            },

            link: function (scope) {
                scope.itemsPerPage = 10;
                scope.page = 1;
                scope.pageCount = 1;

                scope.selectPage = function(page) {
                    scope.page = page;
                    scope.query.page = page;
                    
                    scope.resource.query(scope.query, function(data) {
                        scope.results = data.results;
                        scope.pageCount = data.pageCount;
                    });
                };

                scope.refresh = function() {
                    scope.selectPage(scope.page);
                };

                if(scope.refreshOn) {
                    scope.$on(scope.refreshOn, function() {
                        scope.refresh();
                    });
                }

                scope.refresh();
            }
        };

    });