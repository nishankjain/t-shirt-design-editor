var models  = require('../models');
var express = require('express');
var router  = express.Router();
var mkdirp = require('mkdirp');
var fs = require('fs');
var uuidv4 = require('uuid/v4');

router.get('/createnewdesign', function(req, res) {
	models.Design.create({
		canvas: ''
	}).then(function(design) {
		res.json({
			success: true,
			message: 'New design created',
			design: design
		});
	});
});

router.get('/getalldesigns', function(req, res) {
	models.Design.findAll({
		attributes: ['designUrl', 'uuid']
	}).then(function(designs) {
		res.json({
			success: true,
			message: 'New design created',
			designs: designs
		});
	});
});

router.post('/getdesign', function(req, res) {
	var canvasuuid = req.body.uuid;
	models.Design.findOne({
		where: {
			uuid: canvasuuid
		}
	}).then(function(design) {
		if (design !== null) {
			res.json({
				success: true,
				message: 'Here is the design',
				design: design
			});
		}
		else {
			res.json({
				success: true,
				message: 'Design not found',
				design: design
			});
		}
	});
});

router.post('/savedesign', function(req, res) {
	var designId = req.body.designId;
	var canvasData = req.body.canvasData;
	var imageData = req.body.imageData;
	saveDesignImage(imageData, designId, function (imageUrl) {
		models.Design.update(
			{
				canvasData: canvasData,
				designUrl: imageUrl
			},
			{
				where: {
					uuid: designId
				}
			}
		).then(function(design) {
			if (design[0]) {
				res.json({
					success: true,
					message: 'Design saved',
					saved: 1,
					designUrl: imageUrl
				});
			}
			else {
				res.json({
					success: true,
					message: 'No design found with this uuid',
					saved: 0
				});
			}
		});
	});
});

function saveDesignImage (imageString, designId, callback) {
	var parts = imageString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
	var imageType = parts[1].split('/')[1];
	var imageData = new Buffer(parts[2], 'base64');
	var folderPath = 'public/images/uploads/' + designId;
	var imagePath = folderPath + '/' + uuidv4() + '.' + imageType;
	mkdirp(folderPath, function (err) {
		if (err) {
			console.error(err);
		}
		else {
			fs.writeFile(imagePath, imageData, function () {
				callback(imagePath);
			});
		} 
	});
}

module.exports = router;