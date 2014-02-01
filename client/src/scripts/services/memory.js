angular.module('futurism')
	.factory('memory', function(window) {
		'use strict';

		var shortMem = {};
		var longMem = {};

		return {

			// short term memory will last until the browser is closed
			short: {
				set: function(key, value) {
					if(typeof window.Storage !== 'undefined') {
						sessionStorage.setItem(key, value);
					}
					else {
						shortMem[key] = value;
					}
				},
				get: function(key) {
					if(typeof window.Storage !== 'undefined') {
						sessionStorage.getItem(key);
					}
					else {
						shortMem[key] = value;
					}
				}
			},

			// long term memory will last as long as it can
			long: {
				set: function(key, value) {
					if(typeof window.Storage !== 'undefined') {
						localStorage.setItem(key, value);
					}
					else {
						longMem[key] = value;
					}
				},
				get: function(key) {
					if(typeof window.Storage !== 'undefined') {
						localStorage.getItem(key);
					}
					else {
						longMem[key] = value;
					}
				}
			}
		};
	});