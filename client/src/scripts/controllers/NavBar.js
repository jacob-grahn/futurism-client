angular.module('futurism')
	.controller('navBarCtrl', function($scope, account, $) {
		'use strict';

		$scope.path = '';
		$scope.account = account;


		$scope.$on('$routeChangeSuccess', function(event, current) {
			if(current.$$route) {
				$scope.path = current.$$route.originalPath;
			}
			else {
				$scope.path = '/';
			}
		});


		$scope.atDeckBuilder = function() {
			return $scope.path === '/deck-builder' || $scope.path === '/deck-selector';
		};


		$scope.atCardBuilder = function() {
			return $scope.path === '/card-builder' || $scope.path === '/card-selector';
		};


		$scope.atLobby = function() {
			return $scope.path === '/lobby';
		};


		$scope.atFutures = function() {
			return $scope.path === '/futures';
		};


		$scope.addGuild = function() {
			return $scope.path === '/guild';
		};


		/**
		 * Close the responsive navbar when a link is clicked
		 */
		$(document).on('click','.navbar-collapse.in',function(e) {
			if( $(e.target).is('a') ) {
				$(this).collapse('hide');
			}
		});
	});