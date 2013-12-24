/**
 * Save card data to mongo and card image to s3
 * @param futurismServer
 */

(function() {
	'use strict';

	var _ = require('lodash');
	var async = require('async');
	var fns = require('../fns/fns');
	var fndSave = require('../fns/fndSave');
	var Card = require('../models/card');


	/**
	 * Save an image to s3
	 * @param {buffer} image
	 * @param {string} imageId
	 * @param {function} callback
	 */
	var saveImage = function(image, imageId, callback) {
		var Imager = require('imager'),
			imagerConfig = require('../config/card-image-config.js'),
			imager = new Imager(imagerConfig, 'S3');

		image.name = imageId + '.jpg';
		imager.upload([image], callback, 'cardImage');
	};


	/**
	 * Save a card
	 * image is stored on s3, if there is one
	 * @body {string} name
	 * @body {string} story
	 * @body {string} faction
	 * @body {string[]} abilities
	 * @body {number} attack
	 * @body {number} health
	 */
	module.exports = function(req, res) {

		var data = _.pick(req.body, 'name', 'story', 'faction', 'abilities', 'attack', 'health');

		data.userId = req.session.userId;
		data._id = req.session.userId + '-' + fns.createHashId(data.name);

		if(data.abilities) {
			data.abilities = data.abilities.split(',');
		}
		else {
			data.abilities = [];
		}




		//--- save card and image
		async.series([

			//--- save the image if there is one
			function(callback) {
				if(req.files && req.files.image) {
					data.hasImage = true;
					saveImage(req.files.image, data._id, callback);
				}
				else {
					return callback();
				}
			},

			//--- save the card
			function(callback) {
				fndSave(Card, data, callback);
			}
		],

		//--- all done
		function(err, results) {
			res.apiOut(err, results[1]);
		});
	};


}());