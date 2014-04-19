angular.module('futurism')
    .factory('notificationListener', function(socket, lang, chat, $filter) {
        'use strict';


        /**
         * Replace mustaches {{}} with their value
         * @param txt
         * @param data
         */
        var processTxt = function(txt, data) {
            _.each(data.data, function(value, key) {
                if(key === 'time') {
                    value = $filter('date')(value, 'shortTime');
                }
                txt = txt.replace('{{'+key+'}}', value);
            });
            return txt;
        };


        /**
        * Listen for notifications
        * @param data
        */
        socket.$on('notify', function(data) {
            var txt = lang.notify[data.message];
            if(txt) {
                self.add(processTxt(txt, data));
            }
        });


        /**
         * public interface
         * @type {{add: add}}
         */
        var self = {
            add: function(txt) {
                var msg = {txt: txt};
                chat.add(msg);
            }
        };

        return self;

    });