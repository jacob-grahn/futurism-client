(function() {
	'use strict';

	var futures = {
		CAPITALISM: 'capt',
		NORMAL: 'norm'
	};

	/*var futures = {
		FREE_LOVE: 'free',
		BLOOD_FUED: 'blod',
		RENAISSANCE: 'rena',
		COMMUNISM: 'comm',
		THUNDERDOME: 'thdr',
		ANARCHY: 'anar',
		MIRACLE: 'mira',
		Z_VIRUS: 'zvir',
		ARMAGEDDON: 'arma'
	};*/

	if (typeof module !== 'undefined') {
		module.exports = futures;
	}
	else {
		window.futurismShared = window.futurismShared || {};
		window.futurismShared.futures = futures;
	}
}());