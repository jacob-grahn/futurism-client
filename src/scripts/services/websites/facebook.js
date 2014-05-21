angular.module('futurism')
    .factory('facebook', function (window) {
        'use strict';

        var FB = window.FB;

        return {

            name: 'Facebook',

            checkLogin: function (callback) {
                FB.getLoginStatus(function (response) {
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
                FB.logout();
            }
        };
    });