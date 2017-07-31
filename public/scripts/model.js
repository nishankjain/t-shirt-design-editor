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
		}
	};

	return requestMethods;
};