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
                refreshOn: '@'
            },

            link: function (scope) {
                scope.itemsPerPage = 10;
                scope.page = 1;
                scope.pageCount = 1;

                scope.selectPage = function(page) {
                    scope.page = page;
                    scope.query.page = page;
                    
                    /*var data = {};
                    
                    if(scope.query.page) {
                        data.page = scope.query.page;
                    }
                    if(scope.itemsPerPage) {
                        data.count = scope.itemsPerPage;
                    }
                    if(scope.query.find) {
                        data.find = JSON.stringify(scope.query.find);
                    }
                    if(scope.query.sort) {
                        data.sort = JSON.stringify(scope.query.sort);
                    }*/
                    
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