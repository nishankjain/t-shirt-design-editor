// var canvas = new fabric.Canvas('active-shirt');

// canvas.controlsAboveOverlay = true;
// canvas.perPixelTargetFind = true;

// canvas.clipTo = function(ctx) {
// 	ctx.rect(180, 120, 240, 400);
// };

// fabric.Image.fromURL('/images/uploads/file-1501334826841.png', function(oImg) {
// 	oImg.set({
// 		class: 'design-overlay',
// 		top: (canvas.getHeight() / 2 - oImg.height / 2),
// 		left: (canvas.getWidth() / 2 - oImg.width / 2)
// 	});
// 	canvas.add(oImg);
// });

// canvas.add(new fabric.Rect({
//   width: 500,
//   height: 500,
//   left: 30,
//   top: 30,
//   fill: 'rgb(255,0,0)',
//   class: 'design-overlay'
// }));

// canvas.on('mouse:up', function(options) {
// 	// var canvasObjects = canvas.getObjects();

// 	// for(var i = 0; i < canvasObjects.length; i++) {
// 	// 	// canvasObjects[i].set('backgroundColor', 'rgb(0, 255, 255)');
// 	// 	canvasObjects[i].set({selectionBackgroundColor: 'rgb(0, 255, 255)'});
// 	// 	// canvasObjects[i].set({opacity: 1});
// 	// }
// 	console.log(JSON.stringify(canvas));
// });