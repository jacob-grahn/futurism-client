angular.module('futurism')
	.factory('modals', function($modal) {
		'use strict';

		return {


			openUser: function(userId) {
				$modal.open({
					templateUrl: 'views/userModal.html',
					controller: 'UserModalCtrl',
					resolve: {
						userId: function () {
							return userId;
						}
					}
				});
			}

		};

	});