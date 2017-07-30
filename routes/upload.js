var express = require('express');
var router = express.Router();
var multer  = require('multer');
var path = require('path');
var mkdirp = require('mkdirp');

var storage = multer.diskStorage({
	destination: function(req, file, callback) {
		var destPath = 'public/images/uploads/' + req.body.folderName;
		mkdirp(destPath, function (err) {
			if (err) console.error(err);
			else callback(null, destPath);
		});
	},
	filename: function(req, file, callback) {
		callback(null, Date.now() + path.extname(file.originalname));
	}
});

var upload = multer({
	storage: storage,
	fileFilter: function(req, file, callback) {
		var ext = path.extname(file.originalname);
		if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
			return callback(res.end('Only images are allowed'), null);
		}
		callback(null, true);
	}
});

router.post('/uploadImage', upload.single('file'), function(req, res) {
	res.json({
		success: true,
		message: 'Image uploaded',
		url: req.file.destination,
		fileName: req.file.filename
	});
});

module.exports = router;