angular.module('futurism')
    .run(function(autoLogin, session, $rootScope, lang, unread, notificationListener, socketErrors) {
        autoLogin.activate();
        session.renew();
        lang.init();
        $rootScope.lang = lang;
        unread.start();
        notificationListener.add('Welcome to Futurism!'); // pretty much a pointless command... this is a dirty way to get notificationListener to be created
        socketErrors();
    });