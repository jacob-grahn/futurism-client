angular.module('futurism')
    .factory('state', function(turn) {
        'use strict';

        var state = {
            WAITING: 'waiting', // it is not your turn
            THINKING: 'thinking', // the game is not doing anything, you can start an action
            TARGETING: 'targeting', // you are in the middle of selecting targets for an action
            PENDING: 'pending', // you have selected an action and are waiting for a response from the server

            name: 'none',
            data: null,

            /**
             * Update the state
             * @param {string} name
             * @param {*} [data]
             */
            set: function(name, data) {
                state.name = name;
                state.data = data;
            },


            /**
             * Reset to a default
             */
            toDefault: function() {
                if(turn.isMyTurn()) {
                    state.set(state.THINKING);
                }
                else {
                    state.set(state.WAITING);
                }
            }
        };

        return state;
    });