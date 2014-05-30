angular.module('futurism')
    .factory('animFns', function($, _, board) {
        'use strict';

        var self = {

            cardWidth: 65,
            cardHeight: 93,
            halfCardWidth: Math.round(65/2),
            halfCardHeight: Math.round(93/2),


            updatedAnimTargets: function(update) {
                var animTargets = [];
                if(update.board && update.board.areas) {
                    _.each(update.board.areas, function(area, index) {
                        var playerId = index;
                        _.each(area.targets, function(targetData, index) {
                            var xy = index.split('-');
                            var column = xy[0];
                            var row = xy[1];

                            var animTarget = self.makeAnimTarget(update, {playerId: playerId, column: column, row: row});

                            animTargets.push(animTarget);
                        });
                    });
                }
                return animTargets;
            },



            chainedAnimTargets: function(update, targetChain) {
                var animTargets = _.map(targetChain, function(targetPos) {
                    return self.makeAnimTarget(update, targetPos);
                });
                return animTargets;
            },



            makeAnimTarget: function(update, targetPos) {
                if(_.isUndefined(targetPos.column)) {
                    return null;
                }

                var target = board.targetPos(targetPos);
                var elem = self.targetElem(target);
                var boardElem = $('#board');

                var newData = null;
                if(update.board && update.board.areas && update.board.areas[targetPos.playerId]) {
                    newData = update.board.areas[targetPos.playerId].targets[targetPos.column+'-'+targetPos.row];
                }

                var animTarget = {
                    target: target,
                    newData: newData,
                    elem: elem,
                    center: self.targetCenter(target, boardElem),
                    offset: self.relativeOffset(elem, boardElem)
                };

                return animTarget;
            },



            targetCenter: function(target, boardElem) {
                var elem = self.targetElem(target);
                var offset = self.relativeOffset(elem, boardElem);
                offset.left += self.halfCardWidth;
                offset.top += self.halfCardHeight;
                offset.x = offset.left;
                offset.y = offset.top;
                return offset;
            },



            relativeOffset: function(elem, boardElem) {
                var elemOffset = elem.offset();
                var boardOffset = boardElem.offset();
                return({
                    left: elemOffset.left - boardOffset.left,
                    top: elemOffset.top - boardOffset.top
                });
            },



            targetSelector: function(pos) {
                var playerId = pos.playerId || pos.player._id;
                var selector = "." + playerId + "-" + pos.column + "-" + pos.row;
                return selector;
            },



            targetElem: function(pos) {
                var selector = self.targetSelector(pos);
                return $(selector);
            },


            animNotif: function(elem, point, txt, classStr) {
                classStr = classStr || '';
                var effect = $('<div class="card-notif '+classStr+'">'+txt+'</div>');

                effect.css({left: point.x, top: point.y - 100})
                    .delay(600)
                    .animate({opacity: 0}, 'slow', function() {
                        this.remove();
                    });

                elem.append(effect);

                return effect;
            },


            animFlasher: function(elem, point, classStr) {
                var effect = $('<div class="card-flasher '+classStr+'"><div class="card-flasher-inner"></div></div>');

                effect.css({
                    left: point.x,
                    top: point.y
                });

                elem.append(effect);

                // cleanup
                _.delay(function() {
                    effect.remove();
                }, 4000);

                return effect;
            },


            animMove: function(holderElem, startPos, endPos) {
                startPos.elem.removeClass('target-valid');
                var cardElem = startPos.elem.find('.card-small');

                cardElem.css({
                    position: 'absolute',
                    top: startPos.offset.top,
                    left: startPos.offset.left,
                    'z-index': 50
                });

                cardElem.animate({
                    top: endPos.offset.top,
                    left: endPos.offset.left
                }, 600);

                _.delay(function() {
                    cardElem.remove();
                }, 1100);

                holderElem.append(cardElem);
            },


            cloneCardElem: function(holderElem, animTarget) {
                var cloneElem = animTarget.elem.find('.card-small').clone();
                cloneElem.css({
                    position: 'absolute',
                    top: animTarget.offset.top,
                    left: animTarget.offset.left,
                    'z-index': 48
                });
                holderElem.append(cloneElem);
                return cloneElem;
            },


            makeGrabber: function(holderElem, p1, p2, classStr) {
                var distX = p1.x - p2.x;
                var distY = p1.y - p2.y;
                var distTot = Math.sqrt(distX*distX + distY*distY);
                var angleRad = Math.atan2(distY, distX) + Math.PI;

                var grabber = $('<div class="grabber-effect '+classStr+'"></div>')
                    .css({
                        left: p1.x,
                        top: p1.y,
                        width: 1,
                        transform: 'rotate('+angleRad+'rad)'
                    })
                    .animate({
                        width: distTot
                    })
                    .delay(1000)
                    .animate({
                        opacity: 0
                    }, function() {
                        grabber.remove();
                    });

                holderElem.append(grabber);
                return grabber;
            }

        };

        return self;

    });