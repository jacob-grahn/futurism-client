angular.module('futurism')
    .run(function(autoLogin, session, $rootScope, lang, unread, notificationListener, socketErrors, _) {
        'use strict';
        
        autoLogin.activate();
        session.renew();
        
        lang.loadData('data/phrases.json');
        $rootScope.lang = lang;
        
        _.delay(function() {
            unread.start();
        }, 4000);
        
        notificationListener.add('Welcome to Futurism!'); // pretty much a pointless command... this is a dirty way to get notificationListener to be created
        socketErrors();
    });