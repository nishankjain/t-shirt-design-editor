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
				mainCtrl.addImage(response.data.url.slice(6) + '/' + response.data.fileName);
			}, function (err) {
				console.log('Error: ' + err);
			});
		}
	};

	mainCtrl.placeholderText = "Space Pirate";
	// mainCtrl.textBoxes = [];

	mainCtrl.addImage = function (url) {
		fabric.Image.fromURL(url, function(oImg) {
			oImg.set({
				class: 'image-overlay',
				top: (mainCtrl.canvas.getHeight() / 2 - oImg.height / 2),
				left: (mainCtrl.canvas.getWidth() / 2 - oImg.width / 2)
			});
			mainCtrl.canvas.add(oImg);
			console.log(JSON.stringify(mainCtrl.canvas));
		});
	};

	mainCtrl.addText = function () {
		var text = new fabric.IText(mainCtrl.placeholderText, {
			fontSize: 20,
			fontFamily: 'Roboto'
		});
		text.set({
			class: 'text-overlay',
			top: (mainCtrl.canvas.getHeight() / 2 - text.height / 2),
			left: (mainCtrl.canvas.getWidth() / 2 - text.width / 2)
		});
		// mainCtrl.textBoxes.push({
		// 	content: mainCtrl.placeholderText
		// });
		mainCtrl.canvas.add(text);
	};

	// mainCtrl.updateDesignText = function (textBox) {
	// 	console.log(textBox.content);
	// };

	mainCtrl.canvas = new fabric.Canvas('active-shirt');

	mainCtrl.canvas.controlsAboveOverlay = true;
	mainCtrl.canvas.perPixelTargetFind = true;

	mainCtrl.canvas.clipTo = function(ctx) {
		ctx.rect(180, 120, 240, 400);
	};

	mainCtrl.newDesign = function () {
		RequestModel.createNewDesign(function (response) {
			if (response.status === 200 && response.data.success) {
				console.log(response);
				mainCtrl.canvas.clear();
				mainCtrl.designId = response.data.design.uuid;
				if (typeof(Storage) !== "undefined") {
					localStorage.setItem("designId", mainCtrl.designId);
				}
				clearLocalStorage();
			}
		});
	};

	var undoArray = [];
	var redoArray = [];

	if (typeof(Storage) !== "undefined") {
		if (localStorage.undoArray) {
			undoArray = JSON.parse(localStorage.undoArray);
		}
		if (localStorage.redoArray) {
			redoArray = JSON.parse(localStorage.redoArray);
		}
	}

	function updateLocalStorage () {
		if (typeof(Storage) !== "undefined") {
			localStorage.setItem("undoArray", JSON.stringify(undoArray));
			localStorage.setItem("redoArray", JSON.stringify(redoArray));
		}
		console.log(localStorage);
	}

	function clearLocalStorage () {
		if (typeof(Storage) !== "undefined") {
			localStorage.setItem("undoArray", "[]");
			localStorage.setItem("redoArray", "[]");
		}
		console.log(localStorage);
	}

	mainCtrl.undo = function () {
		redoArray.push(undoArray.pop());
		updateLocalStorage();
	};

	mainCtrl.redo = function () {
		undoArray.push(redoArray.pop());
		updateLocalStorage();
	};

	mainCtrl.canvas.on('object:modified', function () {
		undoArray.push(JSON.stringify(mainCtrl.canvas));
		redoArray.splice(0);
		updateLocalStorage();
	});

	mainCtrl.canvas.on('object:added', function () {
		undoArray.push(JSON.stringify(mainCtrl.canvas));
		redoArray.splice(0);
		updateLocalStorage();
	});

	if (undoArray.length < 1 || typeof(Storage) === "undefined") {
		mainCtrl.newDesign();
	}

	if (typeof(Storage) !== "undefined") {
		if (localStorage.designId) {
			RequestModel.getDesign(localStorage.designId, function (response) {
				if (response.status === 200 && response.data.success) {
					console.log(response);
					var designObj = response.data.design;
					if (designObj.canvasData && designObj.canvasData !== null) {
						mainCtrl.canvas.loadFromJSON(designObj.canvasData);
					}
				}
			});
		}
	}
}]);