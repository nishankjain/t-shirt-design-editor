var models  = require('../models');
var express = require('express');
var router  = express.Router();

// router.get('/', function(req, res) {
// 	models.User.findAll({
// 		include: [ models.Task ]
// 	}).then(function(users) {
// 		res.render('index', {
// 			title: 'Sequelize: Express Example',
// 			users: users
// 		});
// 	});
// });

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

module.exports = router;