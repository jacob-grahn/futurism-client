angular.module('futurism')
    .controller('LobbyCtrl', function($scope, socket, matchups, LobbyResource) {
        'use strict';

        $scope.matchups = matchups;
        $scope.chatId = null;

        $scope.model = {
            lobby: {}
        };


        $scope.lobbies = LobbyResource.query({}, function() {
            $scope.model.lobby = $scope.lobbies[0];
        });


        $scope.$watch('model.lobby', function() {
            var lobby = $scope.model.lobby;
            if(lobby.server) {
                var type = lobby.open ? 'open' : 'guild';
                var lobbyId = type + ':lobby:' + lobby._id;
                var chatId = type + ':chat:' + lobby._id;
                socket.connect(lobby.server);
                matchups.subscribe(lobbyId);
                $scope.chatId = chatId;
            }
        }, true);


        $scope.$on('$destroy', function() {
            matchups.unsubscribe();
        });
    });