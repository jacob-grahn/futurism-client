angular.module('futurism')
	.directive('paginated', function() {
		'use strict';

		return {
			restrict: 'E',
			replace: true,
			transclude: true,
			templateUrl: 'views/paginated.html',

			scope: {
				resource: '=',
				results: '=',
				query: '='
			},

			link: function (scope) {
				scope.itemsPerPage = 10;
				scope.page = 1;
				scope.pageCount = 1;
				console.log(scope.results);

				scope.selectPage = function(page) {
					scope.page = page;

					/*var queryObj =
					{
						find: scope.find || {},
						sort: scope.sort || {},
						page: page
					};*/

					scope.query.page = page;
					scope.resource.query(scope.query, function(data) {
						console.log('paginated::loadedData', data);
						scope.results = data.results;
						scope.pageCount = data.pageCount;
					});
					console.log('paginated::selectPage', queryObj);
				};
				scope.selectPage(scope.page);
			}
		};

	});