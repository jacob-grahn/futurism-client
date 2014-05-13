angular.module('futurism')

    .factory('me', function($rootScope, session, UserResource, StatsResource) {
        'use strict';


        /**
         * Reload my info whenever my session changes (login/logout)
         */
        $rootScope.$on('event:sessionChanged', function(srcScope, session) {
            if(session && session._id) {
                self.setUserId(session._id);
            }
            else {
                self.clear();
            }
        });


        /**
         * Reload my info whenever it changes
         */
        $rootScope.$on('event:accountChanged', function() {
            self.reload();
        });


        /**
         * Public interface
         */
        var self = {
            UPDATED: 'event:me:user:updated',
            targetSite: 'j',
            loggedIn: false,
            userId: '',
            stats: {},
            user: {},

            setUserId: function(userId) {
                self.loggedIn = true;
                self.userId = userId;
                self.reload();
            },

            reload: function() {
                self.stats = StatsResource.save();
                self.user = UserResource.get({userId: self.userId}, function() {
                    $rootScope.$broadcast(self.UPDATED);
                });
            },

            clear: function() {
                self.loggedIn = false;
                self.stats = {};
                self.user = {};
            }
        };


        /**
         * The session may already be set up
         */
        if(session.active) {
            self.setUserId(session.data._id);
        }


        /**
         *
         */
        return self;
    });