(function() {
	'use strict';

	var futures = {
		stable: {
			FREE_LOVE: "free",
			BLOOD_FUED: "blod",
			RENAISSANCE: "rena"
		},
		unstable: {
			COMMUNISM: "comm",
			THUNDERDOME: "thdr",
			ANARCHY: "anar"
		},
		paradox: {
			MIRACLE: "mira",
			Z_VIRUS: "zvir",
			ARMAGEDDON: "arma"
		}
	};

	if (typeof module !== 'undefined') {
		module.exports = futures;
	}
	else {
		window.futurismShared = window.futurismShared || {};
		window.futurismShared.futures = futures;
	}
}());