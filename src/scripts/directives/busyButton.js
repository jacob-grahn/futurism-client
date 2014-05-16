angular.module('futurism')
    .directive('busyButton', function($timeout) {
        'use strict';

        return {
            restrict: 'E',
            replace: true,
            scope: {
                onClick: '&'
            },
            template: '<button class="btn btn-default" type="submit" ng-click="startClick()" ng-disabled="{{!!promise}}">{{label}}</button>',
            link: function(scope, element, attr) {
                scope.defaultLabel = attr.label || 'Save';
                scope.label = scope.defaultLabel;
                scope.class = attr.class;
                scope.startClick = function() {
                    if(!scope.promise) {
                        scope.label = 'Working...';
                        scope.promise = scope.onClick();
                        scope.promise.then(
                            function() {
                                scope.label = 'Success!';
                                $timeout(function() {
                                    scope.label = scope.defaultLabel;
                                }, 1000);
                                delete scope.promise;
                            },
                            function() {
                                scope.label = 'Error!';
                                $timeout(function() {
                                    scope.label = scope.defaultLabel;
                                }, 1000);
                                delete scope.promise;
                            }
                        );
                    }
                };
            }
        };
    });