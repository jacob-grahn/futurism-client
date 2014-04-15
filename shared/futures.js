(function() {
	'use strict';

	var futures = {
		CAPITALISM: 'capt',
		FREE_LOVE: 'free',
		NORMAL: 'norm',
		Z_VIRUS: 'zvir'
	};

	/*var futures = {
		BLOOD_FUED: 'blod',
		RENAISSANCE: 'rena',
		COMMUNISM: 'comm',
		THUNDERDOME: 'thdr',
		ANARCHY: 'anar',
		MIRACLE: 'mira',
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