// 'use strict';

var fpControllers = angular.module('fpControllers', []);

fpControllers.controller('mainController', ['$http', 'RequestModel', 'Upload', '$scope', function($http, RequestModel, Upload, $scope) {
	var mainCtrl = this;
	mainCtrl.submit = function() {
		if (mainCtrl.file) {
			mainCtrl.uploadFile(mainCtrl.file);
		}
	};

	mainCtrl.getFile = function (file) {
		if (file) {
			mainCtrl.file = file;
		}
	};

	mainCtrl.uploadFile = function (file) {
		if (file) {
			Upload.upload({
				url: '/api/uploadImage',
				data: {
					folderName: mainCtrl.designId,	// folderName has to be sent first so that Multer catches it before image
					file: file
				}
			})
			.then(function (response) {
				console.log(response);
				mainCtrl.file = '';
			}, function (err) {
				console.log('Error: ' + err);
			});
		}
	};

	mainCtrl.canvas = new fabric.Canvas('active-shirt');

	mainCtrl.canvas.controlsAboveOverlay = true;
	mainCtrl.canvas.perPixelTargetFind = true;

	mainCtrl.canvas.clipTo = function(ctx) {
		ctx.rect(180, 120, 240, 400);
	};

	// fabric.Image.fromURL('/images/uploads/file-1501334826841.png', function(oImg) {
	// 	oImg.set({
	// 		class: 'design-overlay',
	// 		top: (mainCtrl.canvas.getHeight() / 2 - oImg.height / 2),
	// 		left: (mainCtrl.canvas.getWidth() / 2 - oImg.width / 2)
	// 	});
	// 	mainCtrl.canvas.add(oImg);
	// });

	mainCtrl.newDesign = function () {
		RequestModel.createNewDesign(function (response) {
			if (response.status === 200 && response.data.success) {
				console.log(response);
				mainCtrl.canvas.clear();
				mainCtrl.designId = response.data.design.uuid;
			}
		});
	};

	mainCtrl.newDesign();
}]);

fpControllers.controller('loginController', ['$http', 'RequestModel', function($http, RequestModel) {
	var loginCtrl = this;
	
	loginCtrl.signup = function () {
		var signupData = {
			email : this.signup_email,
			first_name : this.signup_first_name,
			last_name : this.signup_last_name,
			contact : this.signup_contact,
			password : this.signup_password
		};
		RequestModel.userSignup(signupData, function (response) {
			if (response.status === 200 && response.data.success) {
				var userToken = response.data.token;
				setCookie('fb_com_ut', userToken, 30);
				// window.location = '/home';
			}
		});
	};

	loginCtrl.login = function () {
		var loginData = {
			email : this.login_email,
			password : this.login_password
		};
		RequestModel.userLogin(loginData, function (response) {
			if (response.status === 200 && response.data.success) {
				var userToken = response.data.token;
				setCookie('fb_com_ut', userToken, 30);
				// window.location = '/home';
			}
		});
	};
}]);

fpControllers.controller('editorController', ['$http', 'RequestModel', function($http, RequestModel) {
	var feedCtrl = this;
	feedCtrl.msg = "I've not been there";
}]);

// mainCtrl.newCanvasId = response.data.design.uuid;
// $scope.$$postDigest(function () {
// 	mainCtrl.canvas = new fabric.Canvas(mainCtrl.newCanvasId);
// });
// mainCtrl.canvas = new fabric.Canvas(mainCtrl.newCanvasId);
// mainCtrl.canvas.controlsAboveOverlay = true;
// mainCtrl.canvas.perPixelTargetFind = true;

// mainCtrl.canvas.clipTo = function(ctx) {
// 	ctx.rect(180, 120, 240, 400);
// };

// fabric.Image.fromURL('/images/uploads/file-1501334826841.png', function(oImg) {
// 	oImg.set({
// 		class: 'design-overlay',
// 		top: (mainCtrl.canvas.getHeight() / 2 - oImg.height / 2),
// 		left: (mainCtrl.canvas.getWidth() / 2 - oImg.width / 2)
// 	});
// 	mainCtrl.canvas.add(oImg);
// });