angular.module('futurism')
	.factory('GuildResource', function($resource) {
		'use strict';
		return $resource('/globe/guilds/:guildId', {guildId:'@_id'}, {put: {method: 'PUT'}});
	});