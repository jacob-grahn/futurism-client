angular.module('futurism')
	.run(function(autoLogin, session, errorHandler, $rootScope, lang) {
		autoLogin.activate();
		session.renew(errorHandler.callback);
		lang.init();
		$rootScope.lang = lang;
	});