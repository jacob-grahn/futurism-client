/* global describe, beforeEach, module, inject, it, expect, sinon, _ */

describe('GameSummary', function () {
    
    'use strict';

    var $scope, $httpBackend, SummaryResource;

    beforeEach(function() {

        module('futurism');

        inject(function($injector) {
            $httpBackend = $injector.get('$httpBackend');
            SummaryResource = {get: sinon.stub().returns({})};
            var $rootScope = $injector.get('$rootScope');
            var $controller = $injector.get('$controller');

            $scope = $rootScope.$new();
            $controller('GameSummaryCtrl', {
                $scope: $scope,
                $routeParams: {gameId:'123'},
                SummaryResource: SummaryResource,
                me: {user: {_id:1}},
                rankCalc: {},
                _: _
            });
        });
    });


    describe('init', function () {

        it('should add gameId to scope', function() {
            expect($scope.gameId).toBe('123');
        });

        it('should add account to scope', function() {
            expect($scope.me.user._id).toBe(1);
        });

        it('should create a summ object', function() {
            expect($scope.summ).toBeTruthy();
        });

        it('should request data from server', function () {
            expect(SummaryResource.get.callCount).toBe(1);
        });
    });
});