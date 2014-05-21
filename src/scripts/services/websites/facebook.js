angular.module('futurism')
    .factory('facebook', function (window) {
        'use strict';

        return {

            id: 'f',
            name: 'Facebook',

            checkLogin: function (callback) {
                if(!window.FB) {
                    return callback('Facebook API not ready');
                }
                
                window.FB.getLoginStatus(function (response) {
                    console.log('response', response);
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
                if(!window.FB) {
                    return 'Facebook API not ready';
                }
                window.FB.logout();
            }
        };
    });