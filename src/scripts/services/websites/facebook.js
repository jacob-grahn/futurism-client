angular.module('futurism')
    .factory('facebook', function (window) {
        'use strict';

        var fcp = window.facebookConnectPlugin;
        var self;
        
        // cordova only
        if(fcp) {
            self = {
                id: 'f',
                name: 'Facebook',

                tryLogin: function(callback) {
                    console.log('fcp: tryLogin');
                    
                    fcp.login(
                        ["basic_info"],
                              
                        function(response) {
                            console.log('fcp: tryLogin response', response);
                            response.authResponse.site = 'f';
                            return callback(null, response.authResponse);
                        },

                        function(err) {
                            console.log('fcp: tryLogin error', err);
                            callback(err);
                        }
                    );
                },

                checkLogin: function (callback) {
                    console.log('fcp: checkLogin');
                    fcp.getLoginStatus(
                        function (status) { 
                            console.log("current status: ", status);
                            return callback(null, status);
                        },
                        function(err) {
                            return callback(err);
                        }
                    );
                },

                logout: function () {
                    console.log('fcp: logout');
                    fcp.logout();
                }
            };
        }
        
        // web only
        else {
            self = {
                id: 'f',
                name: 'Facebook',

                tryLogin: function(callback) {
                    if(!window.FB) {
                        return callback('Facebook API not ready');
                    }

                    window.FB.login(function(response) {
                        if (response.status === 'connected') {
                            response.authResponse.site = 'f';
                            callback(null, response.authResponse);
                        }
                        else {
                            callback(null, null);
                        }
                    });
                },

                checkLogin: function (callback) {
                    if(!window.FB) {
                        return callback('Facebook API not ready');
                    }

                    window.FB.getLoginStatus(function (response) {
                        if (response.status === 'connected') {
                            response.authResponse.site = 'f';
                            callback(null, response.authResponse);
                        }
                        else {
                            callback(null, null);
                        }
                    });
                },

                logout: function () {
                    /*if(!window.FB) {
                        return 'Facebook API not ready';
                    }
                    window.FB.logout();*/
                }
            };
        }
        
        
        return self;
    });