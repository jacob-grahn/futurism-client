angular.module('futurism')
	.factory('matchups', function(socket, $rootScope, shared, $location, account, _) {
		'use strict';

		var lobbyName = 'brutus';
		var matchups = [];


		/**
		 * start listening to lobby events
		 */
		var subscribe = function() {
			socket.authEmit('allMatchups', {lobbyName: lobbyName});
			socket.authEmit('subscribe', lobbyName);
		};


		/**
		 * stop listening to lobby events
		 */
		var unsubscribe = function() {
			socket.authEmit('unsubscribe', lobbyName);
			leave();
			clear();
		};


		/**
		 * create a new matchup
		 * @param rules
		 */
		var create = function(rules) {
			socket.authEmit('createMatchup', {lobbyName: lobbyName, rules: rules});
		};


		/**
		 * join an existing matchup
		 * @param matchup
		 */
		var join = function(matchupId) {
			socket.authEmit('joinMatchup', {lobbyName: lobbyName, matchupId: matchupId});
		};


		/**
		 * Leave whatever matchup you may be in
		 */
		var leave = function() {
			socket.authEmit('leaveMatchup', {lobbyName: lobbyName});
		};


		/**
		 * remove all matchups
		 */
		var clear = function() {
			matchups.splice(0, matchups.length);
		};


		/**
		 * return a matchup with matchupId
		 * @param {number} id
		 * @returns {*}
		 */
		var idToMatchup = function(id) {
			for(var i=0; i<matchups.length; i++) {
				var matchup = matchups[i];
				if(matchup.id === id) {
					return matchup;
				}
			}
		};


		/**
		 * Remove a user from a matchup
		 * @param matchup
		 * @param userToRemove
		 */
		var removeUserFromMatchup = function(matchup, userToRemove) {
			shared.fns.removeFromArrayFunc(matchup.accounts, function(user) {
				return user._id === userToRemove._id;
			});
		};


		/**
		 * Remove a matchup from the matchups array
		 * @param matchupToRemove
		 */
		var removeMatchup = function(matchupToRemove) {
			shared.fns.removeFromArrayFunc(matchups, function(matchup) {
				return matchup.id === matchupToRemove.id;
			});
		};


		/**
		 * If you are in provided matchup, start the game
		 */
		var goIfMember = function(matchup, gameId) {
			_.each(matchup.accounts, function(user) {
				console.log(user, account);
				if(+user._id === +account._id) { // + casts to number
					return gotoGamePage(gameId, matchup.rules.pride);
				}
			});
		};


		/**
		 * Change url
		 * @param {string} gameId
		 * @param {number} maxPride
		 */
		var gotoGamePage = function(gameId, maxPride) {
			$location.url('/loadup/'+gameId+'/'+maxPride);
		};


		/**
		 * when a user creates a new matchup
		 */
		socket.on('createMatchup', function(matchup) {
			$rootScope.$apply(function() {
				matchups.push(matchup);
			});
		});


		/**
		 * when a user joins a matchup
		 */
		socket.on('joinMatchup', function(data) {
			$rootScope.$apply(function() {
				var matchup = idToMatchup(data.id);
				matchup.accounts.push(data.user);
			});
		});


		/**
		 * when a user leaves a matchup
		 */
		socket.on('leaveMatchup', function(data) {
			$rootScope.$apply(function() {
				var matchup = idToMatchup(data.id);
				removeUserFromMatchup(matchup, data.user);
			});
		});


		/**
		 * when a matchup is complete and a game begins
		 */
		socket.on('startMatchup', function(data) {
			$rootScope.$apply(function() {
				var matchup = idToMatchup(data.id);
				if(matchup) {
					matchup.starting = true;
					removeMatchup(matchup);
					goIfMember(matchup, data.gameId);
				}
			});
		});


		/**
		 * when a matchup is closed
		 */
		socket.on('removeMatchup', function(id) {
			$rootScope.$apply(function() {
				var matchup = idToMatchup(id);
				removeMatchup(matchup);
			});
		});


		/**
		 * when first connecting, receive a full list of matchups
		 */
		socket.on('allMatchups', function(all) {
			$rootScope.$apply(function() {
				clear();
				_.extend(matchups, all);
			});
		});


		/**
		 * public interface
		 */
		return {
			create: create,
			join: join,
			leave: leave,
			subscribe: subscribe,
			unsubscribe: unsubscribe,
			clear: clear,
			list: matchups
		};
	});