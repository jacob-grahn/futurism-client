angular.module('futurism')
	.run(function(autoLogin, session, errorHandler, $rootScope, lang, unread, notificationListener) {
		autoLogin.activate();
		session.renew(errorHandler.callback);
		lang.init();
		$rootScope.lang = lang;
		unread.start();
		notificationListener.add('Welcome to Futurism!'); // pretty much a pointless command... this is a dirty way to get notificationListener to be created
	});