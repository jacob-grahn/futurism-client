angular.module('futurism')
    .controller('ReportsCtrl', function($scope, ReportResource) {
        'use strict';

        $scope.ReportResource = ReportResource;
        $scope.query = {};
        $scope.reports = [];

    });