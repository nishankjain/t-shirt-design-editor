// 'use strict';

var fpControllers = angular.module('fpControllers', []);

fpControllers.controller('mainController', ['$http', 'RequestModel', 'Upload', '$scope', function($http, RequestModel, Upload, $scope) {
	var mainCtrl = this;
	mainCtrl.canvasLoaded = false;
	mainCtrl.makeNewDesign = false;
	mainCtrl.canvas = new fabric.Canvas('active-shirt');
	mainCtrl.canvas.controlsAboveOverlay = true;
	mainCtrl.canvas.perPixelTargetFind = true;
	mainCtrl.placeholderText = "Space Pirate";
	mainCtrl.canvas.clipTo = function(ctx) {
		ctx.rect(180, 120, 240, 400);
	};

	var undoArray = [];
	var redoArray = [];

	function setLocalVariables () {
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
		mainCtrl.designId = "";
		updateLocalStorage();
	}

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

	mainCtrl.addImage = function (url) {
		fabric.Image.fromURL(url, function(oImg) {
			oImg.set({
				class: 'image-overlay',
				top: (mainCtrl.canvas.getHeight() / 2 - oImg.height / 2),
				left: (mainCtrl.canvas.getWidth() / 2 - oImg.width / 2)
			});
			mainCtrl.canvasLoaded = false;
			mainCtrl.canvas.add(oImg);
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
		mainCtrl.canvasLoaded = false;
		mainCtrl.canvas.add(text);
	};

	mainCtrl.getDesign = function (designId) {
		RequestModel.getDesign(designId, function (response) {
			if (response.status === 200 && response.data.success) {
				var designObj = response.data.design;
				clearLocalStorage();
				mainCtrl.canvas.clear();
				mainCtrl.canvasLoaded = true;
				mainCtrl.canvas.loadFromJSON(designObj.canvasData);
				mainCtrl.designId = designId;
				if (designObj.canvasData !== null) {
					undoArray.push(designObj.canvasData);
				}
				updateLocalStorage();
			}
		});
	};

	mainCtrl.getAllDesigns = function () {
		RequestModel.getAllDesigns(function (response) {
			if (response.status === 200 && response.data.success) {
				mainCtrl.userDesigns = response.data.designs;
				if (response.data.designs.length < 1) {
					mainCtrl.newDesign();
				}
				else {
					mainCtrl.makeNewDesign = false;
				}
				
				if (!mainCtrl.saveDesign) {
					mainCtrl.getDesign(mainCtrl.userDesigns[0].uuid);
				}
			}
		});
	};

	mainCtrl.newDesign = function () {
		RequestModel.createNewDesign(function (response) {
			if (response.status === 200 && response.data.success) {
				clearLocalStorage();
				mainCtrl.canvas.clear();
				mainCtrl.designId = response.data.design.uuid;
				mainCtrl.makeNewDesign = true;
				updateLocalStorage();
			}
		});
	};

	mainCtrl.undo = function () {
		if (undoArray.length > 0) {
			redoArray.push(undoArray.pop());
			updateLocalStorage();
			mainCtrl.canvas.clear();
			mainCtrl.canvasLoaded = true;
			mainCtrl.canvas.loadFromJSON(undoArray[undoArray.length - 1]);
		}
	};

	mainCtrl.redo = function () {
		if (redoArray.length > 0) {
			undoArray.push(redoArray.pop());
			updateLocalStorage();
			mainCtrl.canvas.clear();
			mainCtrl.canvasLoaded = true;
			mainCtrl.canvas.loadFromJSON(undoArray[undoArray.length - 1]);
		}
	};

	mainCtrl.save = function () {
		var data = {
			canvasData : JSON.stringify(mainCtrl.canvas),
			designId : mainCtrl.designId,
			imageData: mainCtrl.canvas.toDataURL()
		};
		mainCtrl.saveDesign = true;
		RequestModel.saveDesign(data, function (response) {
			if (response.status === 200 && response.data.success) {
				mainCtrl.getAllDesigns();
			}
		});
	};

	mainCtrl.canvas.on('object:modified', function () {
		undoArray.push(JSON.stringify(mainCtrl.canvas));
		redoArray.splice(0);
		updateLocalStorage();
	});

	mainCtrl.canvas.on('object:added', function () {
		if (!mainCtrl.canvasLoaded) {
			undoArray.push(JSON.stringify(mainCtrl.canvas));
			redoArray.splice(0);
			updateLocalStorage();
		}
	});

	mainCtrl.getAllDesigns();
}]);