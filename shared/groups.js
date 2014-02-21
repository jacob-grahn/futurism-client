(function() {
	'use strict';

	var groups = {
		GUEST: 'g',
		USER: 'u',
		APPRENTICE: 'p',
		MOD: 'm',
		ADMIN: 'a'
	};

	if (typeof module !== 'undefined') {
		module.exports = groups;
	}
	else {
		window.futurismShared = window.futurismShared || {};
		window.futurismShared.groups = groups;
	}
}());