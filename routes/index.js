var models  = require('../models');
var express = require('express');
var router  = express.Router();

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

router.post('/getdesign', function(req, res) {
	var canvasuuid = req.body.uuid;
	models.Design.findOne({
		where: {
			uuid: canvasuuid
		}
	}).then(function(design) {
		res.json({
			success: true,
			message: 'Here is the design',
			design: design
		});
	});
});

module.exports = router;