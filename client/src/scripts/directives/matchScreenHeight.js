angular.module('futurism')
	.directive('matchScreenHeight', function($, window) {

		return {


			/**
			 * example: <div match-screen-height>bla bla</div>
			 */
			restrict: 'A',


			/**
			 * Allow content inside the div to remain if you add the ng-transclude attribute
			 */
			transclude: true,


			/**
			 * example: <div match-screen-height subtract="20"></div>
			 */
			scope: {
				subtract: '@',
				resizeElement: '@'
			},


			/**
			 * Auto resize the target element to match the height of the screen
			 * example: <div ng-transclude match-screen-height subtract="20">transclude allows these words to appear here</div>
			 * @param {object} scope
			 * @param {jQuery} elem
			 * @param {object} attrs
			 */
			link: function(scope, elem, attrs) {


				/**
				 * wrap window with jquery
				 * @type {jQuery}
				 */
				var jWindow = $(window);


				/**
				 * resize elem to match the height of the screen
				 */
				var resizeHandler = function() {
					var height = jWindow.height();
					var subtract = scope.subtract || 0;

					if(!scope.resizeElement) {
						elem.height(height - subtract);
					}
					else {
						var target = elem.find(scope.resizeElement);
						var elemHeight = elem.height();
						var targetHeight = target.height();
						var diff = elemHeight - targetHeight;
						target.height(height - subtract - diff);
					}
				};
				jWindow.on('resize', resizeHandler);
				resizeHandler();


				/**
				 * Clean up the event listener when this element is removed
				 */
				scope.$on('$destroy', function() {
					jWindow.off('resize', resizeHandler);
				});

			}
		}

	});