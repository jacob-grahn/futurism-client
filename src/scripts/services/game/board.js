angular.module('futurism')
    .factory('board', function(_, players, shared) {
        'use strict';

        var self = new shared.Board();


        /**
         * Fully set the board state
         * @param {Object} minBoard - compact board data
         */
        self.fullUpdate = function(minBoard) {
            self.clear();
            self.minBoard = minBoard;
            self.inflateStatus(self.minBoard);
        };


        /**
         * Update specific targets
         * @param {Object} boardDiff - changes to the board
         */
        self.partialUpdate = function(boardDiff) {
            _.merge(self.minBoard, boardDiff, function(a, b) {
                return _.isArray(a) ? b : undefined;
            });
            self.inflateStatus(self.minBoard);
        };


        /**
         * Apply a compressed game status from the server
         * This function is careful to reuse old objects where possible so angular doesn't redraw everything
         * @param {Object} minBoard
         */
        self.inflateStatus = function(minBoard) {

            _.each(minBoard.areas, function(minArea, playerId) {

                if(!minArea) {
                    self.areas[playerId] = [];
                    return;
                }

                self.areas[playerId] = self.areas[playerId] || {
                    targets: [],
                    playerId: playerId,
                    player: players.idToPlayer(playerId),
                    team: players.idToPlayer(playerId).team
                };
                
                var area = self.areas[playerId];
                var targets = area.targets;

                _.each(minArea.targets, function(card, xy) {
                    var xyArr = xy.split('-');
                    var x = Number(xyArr[0]);
                    var y = Number(xyArr[1]);
                    
                    if(!targets[x]) {
                        targets[x] = [];
                    }
                    
                    if(!targets[x][y]) {
                        targets[x][y] = {
                            column: x,
                            row: y,
                            playerId: area.playerId,
                            player: area.player,
                            card: null
                        };
                    }
                    
                    targets[x][y].card = card;
                });
            });
        };




        /**
         * returns true if player has a commander on the board
         * @param {ObjectId} playerId
         * @returns {boolean}
         */
        self.playerHasCommander = function(playerId) {
            var hasCommander = false;
            var targets = self.playerTargets(playerId);
            _.each(targets, function(target) {
                if(target.card && target.card.commander) {
                    hasCommander = true;
                }
            });
            return hasCommander;
        };



        /**
         *
         */
        return self;
    });