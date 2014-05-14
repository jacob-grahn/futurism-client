angular.module('futurism')
    .controller('LobbyCtrl', function($scope, socket, matchups, LobbyResource, _, me, modals) {
        'use strict';

        $scope.matchups = matchups;
        $scope.chatId = null;
        $scope.curLobby = {};
        $scope.modals = modals;


        $scope.lobbies = LobbyResource.query({}, function() {
            $scope.setLobby($scope.lobbies[0]);
        });
        
        
        $scope.imInMatchup = function(matchup) {
            var ret = false;
            _.each(matchup.accounts, function(member) {
                if(member._id === me.userId) {
                    ret = true;
                }
            });
            return ret;
        };


        $scope.setLobby = function(lobby) {
            if(lobby.server) {
                var type = lobby.open ? 'open' : 'guild';
                var lobbyId = type + ':lobby:' + lobby._id;
                var chatId = type + ':chat:' + lobby._id;
                socket.connect(lobby.server);
                matchups.subscribe(lobbyId);
                $scope.chatId = chatId;
            }
            $scope.curLobby = lobby;
        };


        $scope.$on('$destroy', function() {
            matchups.unsubscribe();
        });
    });