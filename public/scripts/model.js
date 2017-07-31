RequestModel = function ($http) {
	var requestMethods = {
		createNewDesign: function (cb) {
			var url = 'api/createnewdesign';
			$http({
				method: 'GET',
				url: url
			}).then(function (response) {
				cb(response);	// Success callback
			}, function (response) {
				cb(response);	// Failure callback
			});
		},
		getDesign: function (data, cb) {
			var url = 'api/getdesign';
			var dataString = {
				uuid : data
			};
			$http({
				method: 'POST',
				url: url,
				data: JSON.stringify(dataString)
			}).then(function (response) {
				cb(response);	// Success callback
			}, function (response) {
				cb(response);	// Failure callback
			});
		},
		saveDesign: function (data, cb) {
			var url = 'api/savedesign';
			var dataString = {
				canvasData : data.canvasData,
				designId : data.designId,
				imageData : data.imageData
			};
			$http({
				method: 'POST',
				url: url,
				data: JSON.stringify(dataString)
			}).then(function (response) {
				cb(response);	// Success callback
			}, function (response) {
				cb(response);	// Failure callback
			});
		},
		getAllDesigns: function (cb) {
			var url = 'api/getalldesigns';
			$http({
				method: 'GET',
				url: url
			}).then(function (response) {
				cb(response);	// Success callback
			}, function (response) {
				cb(response);	// Failure callback
			});
		},
	};

	return requestMethods;
};