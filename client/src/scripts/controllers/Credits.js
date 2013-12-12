angular.module('futurism')
	.controller('CreditsCtrl', function($scope) {
		'use strict';

		$scope.services = [
			'AngularJS',
			'Node',
			'Socket.io',
			'Modulus',
			'WebStorm',
			'GitHub',
			'SauceLabs',
			'jQuery'
		]
	});