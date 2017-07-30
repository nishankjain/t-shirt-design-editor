fp.directive('addHtml', function($compile){
	return {
		restrict: 'AE',
		link: function(scope, element, attrs){
			var html = "<div class='h1' data-ng-h1 draggable>Test</div>",
			compiledElement = $compile(html)(scope);

			element.on('click', function(event){
				var pageElement = angular.element(document.getElementById("page"));
				pageElement.empty();
				pageElement.append(compiledElement);
			});
		}
	};
});

// link: function(scope, element){
// 	 $templateRequest("template.html").then(function(html){
// 			var template = angular.element(html);
// 			element.append(template);
// 			$compile(template)(scope);
// 	 });
// };