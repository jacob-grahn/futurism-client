angular.module('futurism')
	.directive('turnAnim', function($, $timeout, players) {
		'use strict';

		return {
			restrict: 'E',
			replace: true,
			template: '<div ng-if="active" id="turn-anim"><h1>{{name}}\'s turn begins!</h1></div>',
			link: function(scope, element) {

				scope.active = false;
				scope.name = '';

				$rootScope.$on('event:turn', function(srcScope, changes) {

					var playerId = changes.turnOwners[0];
					var player = players.idToPlayer(playerId);

					if(player) {
						scope.name = player.name;
						scope.active = true;
						$timeout(function() {
							scope.active = false;
						}, 3000);
					}
				});
			}
		};
	});