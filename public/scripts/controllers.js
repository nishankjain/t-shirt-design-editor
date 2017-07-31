// 'use strict';

var fpControllers = angular.module('fpControllers', []);

fpControllers.controller('mainController', ['$http', 'RequestModel', 'Upload', '$scope', function($http, RequestModel, Upload, $scope) {
	var mainCtrl = this;
	mainCtrl.loadedFromJSON = false;
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
				mainCtrl.canvas.clear();
				clearLocalStorage();
				mainCtrl.makeNewDesign = true;
				mainCtrl.designId = response.data.design.uuid;
				if (typeof(Storage) !== "undefined") {
					localStorage.setItem("designId", mainCtrl.designId);
				}
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
		if (localStorage.designId) {
			mainCtrl.designId = localStorage.designId;
		}
	}

	function updateLocalStorage () {
		if (typeof(Storage) !== "undefined") {
			localStorage.setItem("undoArray", JSON.stringify(undoArray));
			localStorage.setItem("redoArray", JSON.stringify(redoArray));
			localStorage.setItem("designId", mainCtrl.designId);
		}
	}

	function clearLocalStorage () {
		undoArray = [];
		redoArray = [];
		if (typeof(Storage) !== "undefined") {
			localStorage.setItem("undoArray", "[]");
			localStorage.setItem("redoArray", "[]");
			localStorage.setItem("designId", "");
		}
	}

	mainCtrl.undo = function () {
		if (undoArray.length > 0) {
			redoArray.push(undoArray.pop());
			updateLocalStorage();
			mainCtrl.canvas.clear();
			mainCtrl.loadedFromJSON = true;
			mainCtrl.canvas.loadFromJSON(undoArray[undoArray.length - 1]);
		}
	};

	mainCtrl.redo = function () {
		if (redoArray.length > 0) {
			undoArray.push(redoArray.pop());
			updateLocalStorage();
			mainCtrl.canvas.clear();
			mainCtrl.loadedFromJSON = true;
			mainCtrl.canvas.loadFromJSON(undoArray[undoArray.length - 1]);
		}
	};

	mainCtrl.save = function () {
		var data = {
			canvasData : JSON.stringify(mainCtrl.canvas),
			designId : mainCtrl.designId,
			imageData: mainCtrl.canvas.toDataURL()
		};
		console.log(mainCtrl.designId);
		RequestModel.saveDesign(data, function (response) {
			if (response.status === 200 && response.data.success) {
				console.log(response);
				mainCtrl.getAllDesigns();
				mainCtrl.makeNewDesign = false;
			}
		});
	};

	mainCtrl.canvas.on('object:modified', function () {
		undoArray.push(JSON.stringify(mainCtrl.canvas));
		redoArray.splice(0);
		updateLocalStorage();
	});

	mainCtrl.canvas.on('object:added', function () {
		if (!mainCtrl.loadedFromJSON) {
			undoArray.push(JSON.stringify(mainCtrl.canvas));
			redoArray.splice(0);
		}
		updateLocalStorage();
	});

	if (undoArray.length < 1 && !mainCtrl.designId) {
		mainCtrl.newDesign();
	}

	mainCtrl.getDesign = function (designId) {
		RequestModel.getDesign(designId, function (response) {
			if (response.status === 200 && response.data.success) {
				var designObj = response.data.design;
				mainCtrl.canvas.clear();
				if (designObj !== null && designObj.canvasData && designObj.canvasData !== null) {
					mainCtrl.loadedFromJSON = true;
					mainCtrl.canvas.loadFromJSON(designObj.canvasData);
					clearLocalStorage();
					mainCtrl.designId = designId;
				}
				else if (undoArray.length > 0 && designId === localStorage.designId) {
					mainCtrl.loadedFromJSON = true;
					mainCtrl.canvas.loadFromJSON(undoArray[undoArray.length - 1]);
				}
			}
		});
	};

	if (typeof(Storage) !== "undefined") {
		if (localStorage.designId) {
			mainCtrl.getDesign(localStorage.designId);
		}
	}

	mainCtrl.getAllDesigns = function () {
		RequestModel.getAllDesigns(function (response) {
			if (response.status === 200 && response.data.success) {
				console.log(response.data.designs);
				mainCtrl.userDesigns = response.data.designs;
			}
		});
	};

	mainCtrl.getAllDesigns();
}]);