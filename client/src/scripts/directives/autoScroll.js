angular.module('futurism')
	.directive('autoScroll', function($, socket) {
		'use strict';

		return {
			restrict: 'A',
			replace: false,
			scope: {
				watch: '=',
				find: '@',
				target: '@'
			},
			link: function(scope, element) {

				scope.$watch(

					function() {
						return JSON.stringify(scope.watch);
					},

					function() {
						_.delay(function() {

							var possibleTargets = element.find('.'+scope.target);
							var confirmedTarget = null;
							_.each(possibleTargets, function(possibleTarget) {
								var matches = $(possibleTarget).find('.'+scope.find);
								if(matches.length > 0) {
									confirmedTarget = possibleTarget;
								}
							});

							if(confirmedTarget) {
								var trueHeight = $('body').prop('scrollHeight');
								var visibleHeight = $(window).height();
								var maxY = trueHeight - visibleHeight;
								var targetY = +$(confirmedTarget).offset().top;

								console.log('scroll', trueHeight, visibleHeight, maxY, targetY);
								if(targetY > maxY) {
									targetY = maxY;
								}

								$('html, body').animate({
								 scrollTop: targetY
								}, 1000);
							}

						}, 100);
					}
				);


				var onChange = function() {

				}
			}
		};
	});