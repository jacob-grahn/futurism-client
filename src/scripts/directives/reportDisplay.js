angular.module('futurism')
    .directive('reportDisplay', function(modals, ReportResource, $rootScope) {
        'use strict';

        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'views/report-display.html',
            scope: {
                report: '='
            },

            link: function(scope) {

                scope.openUser = function(userId) {
                    modals.openUser(userId);
                };

                scope.archive = function(report) {
                    var updatedReport = ReportResource.save({reportId: report._id, read: true}, function() {
                        $rootScope.$broadcast('event:reportUpdated');
                    });
                    return updatedReport.$promise;
                };
            }
        };

    });