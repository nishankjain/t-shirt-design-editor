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
		userLogin: function (data, cb) {
			var url = 'api/login';
			console.log(data);
			$http({
				method: 'POST',
				url: url,
				data: data
			}).then(function (response) {
				cb(response);	// Success callback
			}, function (response) {
				cb(response);	// Failure callback
			});
		}
	};

	return requestMethods;
};