(function() {
	'use strict';

	var futures = {
		CAPITALISM: 'capt',
		FREE_LOVE: 'free',
		NORMAL: 'norm',
		Z_VIRUS: 'zvir',
		THUNDERDOME: 'thdr',
		EDEN: 'eden',
		ASSIMILATION: 'assm',
		ARES_RISES: 'ares',
		NUCLEAR_WAR: 'nuke',
		RENAISSANCE: 'rena',
		ANARCHY: 'anar'
	};

	/*var futures = {
		BLOOD_FUED: 'blod',
		COMMUNISM: 'comm',
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