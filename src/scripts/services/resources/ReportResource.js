angular.module('futurism')
    .factory('ReportResource', function($resource) {
        'use strict';
        return $resource('/globe/reports/:reportId', {reportId: '@reportId'}, {
            query: {
                method: 'GET',
                array: false
            }
        });
    });