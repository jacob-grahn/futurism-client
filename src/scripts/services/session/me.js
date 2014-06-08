angular.module('futurism')

    .factory('me', function($rootScope, session, UserResource, ProgressResource) {
        'use strict';



        /**
         * Public interface
         */
        var self = {
            UPDATED: 'event:me:user:updated',
            loggedIn: false,
            userId: '',
            progress: {},
            user: {},

            setUserId: function(userId) {
                self.loggedIn = true;
                self.userId = userId;
                self.reload();
            },

            reload: function() {
                self.progress = ProgressResource.save();
                self.user = UserResource.get({userId: self.userId}, function() {
                    $rootScope.$broadcast(self.UPDATED);
                });
            },

            clear: function() {
                self.loggedIn = false;
                self.userId = null;
                self.progress = {};
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
         * Reload my info whenever my session changes (login/logout)
         */
        $rootScope.$on('event:sessionChanged', function() {
            if(session.data) {
                self.setUserId(session.data._id);
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
         *
         */
        return self;
    });