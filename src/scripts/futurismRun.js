angular.module('futurism')
    .run(function(autoLogin, session, $rootScope, lang, unread, notificationListener, socketErrors) {
        autoLogin.activate();
        session.renew();
        
        lang.loadData('data/abilities.json');
        lang.loadData('data/factions.json');
        lang.loadData('data/fractures.json');
        lang.loadData('data/futures.json');
        lang.loadData('data/goals.json');
        lang.loadData('data/languages.json');
        lang.loadData('data/notifications.json');
        lang.loadData('data/phrases.json');
        $rootScope.lang = lang;
        
        unread.start();
        notificationListener.add('Welcome to Futurism!'); // pretty much a pointless command... this is a dirty way to get notificationListener to be created
        socketErrors();
    });