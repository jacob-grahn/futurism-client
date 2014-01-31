/**
 * Save card data to mongo and card image to s3
 * @param futurismServer
 */

(function() {
	'use strict';

	var _ = require('lodash');
	var async = require('async');
	var mongoose = require('mongoose');
	var Card = require('../models/card');
	var createHashId = require('../fns/createHashId');


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
		image.type = 'image/jpg';
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

		data.userId = req.session._id;
		data._id = createHashId(req.session._id + '-' + data.name, 16);

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
					return saveImage(req.files.image, data._id, callback);
				}
				else {
					return callback();
				}
			},

			//--- save the card
			function(callback) {
				Card.findByIdAndSave(data, callback);
			}
		],

		//--- all done
		function(err, results) {
			res.apiOut(err, results[1]);
		});
	};


}());