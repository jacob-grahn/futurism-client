angular.module('futurism')
	.directive('summonAnim', function(_, $, $timeout, animFns, sound) {
		'use strict';


		return {
			restrict: 'A',
			link: function(scope, boardElement) {


				scope.$on('post:male', function(srcScope, update) {
					sound.play('mate');
					anim(update, 'summon-sex');
				});


				scope.$on('post:feml', function(srcScope, update) {
					sound.play('mate');
					anim(update, 'summon-sex');
				});


				scope.$on('post:smmn', function(srcScope, update) {
					sound.play('summon');
					anim(update, '');
				});


				scope.$on('post:rbld', function(srcScope, update) {
					sound.play('rebuild');
					anim(update, 'summon-rebuild');
				});


				scope.$on('post:tree', function(srcScope, update) {
					sound.play('trees');
					anim(update, 'summon-trees');
				});



				var anim = function(update, cssClass) {


					_.delay(function() {


						// get positions
						var chain = animFns.chainedAnimTargets(update, update.data.targetChain);
						var src;
						var dest;
						if(chain.length === 3) {
							src = chain[0] || chain[2];
							dest = chain[2];
						}
						if(chain.length === 2) {
							src = chain[0];
							dest = chain[1];
						}



						// hide the new card for a bit
						dest.elem.addClass('target-hidden');
						_.delay(function() {
							dest.elem.removeClass('target-hidden');
						}, 1000);


						// make the swirly animation
						var effect = $('<div class="summon-effect '+cssClass+'"><div class="effect"></div><div class="effect"></div></div>');
						effect.css({left: src.center.x, top: src.center.y});
						effect.animate({left: dest.center.x, top: dest.center.y});
						boardElement.append(effect);

						$timeout(function() {
							effect.remove();
						}, 2000);
					});


				};


			}
		};
	});