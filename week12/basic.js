document.addEventListener("DOMContentLoaded", () => {
	var renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});

	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	var arToolkitContext, arMarkerControlsHiro, arMarkerControlsKanji;

	// init scene and camera
	var scene = new THREE.Scene();
	scene.visible = false;

	//////////////////////////////////////////////////////////////////////////////////
	//		Initialize a basic camera
	//////////////////////////////////////////////////////////////////////////////////

	// Create a camera
	var camera = new THREE.Camera();
	scene.add(camera);


	//////////////////////////////////////////////////////////////////////////////////
	//		add an object in the scene
	//////////////////////////////////////////////////////////////////////////////////

	// add a torus knot
	var geometryBox = new THREE.BoxGeometry(1, 1, 1);
	var materialBox = new THREE.MeshNormalMaterial({
		transparent: true,
		opacity: 0.5,
		side: THREE.DoubleSide
	});
	var meshBox = new THREE.Mesh(geometryBox, materialBox);
	meshBox.position.y = geometryBox.parameters.height / 2;
	scene.add(meshBox);

	var geometry = new THREE.TorusKnotGeometry(0.3, 0.1, 64, 16);
	var material = new THREE.MeshNormalMaterial();
	var mesh = new THREE.Mesh(geometry, material);
	mesh.position.y = 0.5;
	scene.add(mesh);


	////////////////////////////////////////////////////////////////////////////////
	//          handle arToolkitSource
	////////////////////////////////////////////////////////////////////////////////

	var arToolkitSource = new THREEx.ArToolkitSource({
			sourceType: 'webcam', // type of source - ['webcam', 'image', 'video']
			// url of the source - valid if sourceType = image|video
    			sourceUrl: null,
			sourceWidth: window.innerWidth > window.innerHeight ? 640 : 480,
			sourceHeight: window.innerWidth > window.innerHeight ? 480 : 640,
	});

	arToolkitSource.init(() => {
		arToolkitSource.domElement.addEventListener('canplay', () => {
			// create atToolkitContext
			arToolkitContext = new THREEx.ArToolkitContext({
				cameraParametersUrl: '../assets/camera_para.dat',
				detectionMode: 'mono'
			});
			// initialize it
			arToolkitContext.init(() => { // copy projection matrix to camera
				camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
				arToolkitContext.arController.orientation = getSourceOrientation();
				arToolkitContext.arController.options.orientation = getSourceOrientation();
			});

			// MARKER
			arMarkerControlsHiro = new THREEx.ArMarkerControls(arToolkitContext, camera, {
				type: 'pattern',
				patternUrl: '../assets/pattern-hiro.patt',
				// as we controls the camera, set changeMatrixMode: 'cameraTransformMatrix'
				changeMatrixMode: 'cameraTransformMatrix'
			});
		});
		setTimeout(() => {
			onResize();
		}, 250);
	})

	// handle resize
	window.addEventListener('resize', () => {
		onResize();
	});

	function onResize() {
		arToolkitSource.onResizeElement();
		arToolkitSource.copyElementSizeTo(renderer.domElement);
		if (arToolkitContext && arToolkitContext.arController !== null) 
			arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas)
	}


	function getSourceOrientation() {
		if (!arToolkitSource) 
			return null;

		if (arToolkitSource.domElement.videoWidth > arToolkitSource.domElement.videoHeight) 
			return 'landscape';
		else
			return 'portrait';
	}


	//////////////////////////////////////////////////////////////////////////////////
	//		render the whole thing on the page
	//////////////////////////////////////////////////////////////////////////////////

	let timer = new THREE.Clock();

	function animate(nowMsec) {
		// keep looping
		requestAnimationFrame(animate);

		if (!arToolkitContext || !arToolkitSource || !arToolkitSource.ready) 
			return;
		
		arToolkitContext.update(arToolkitSource.domElement);

		// update scene.visible if the marker is seen
		scene.visible = camera.visible;

		mesh.rotation.x += Math.PI * timer.getDelta();
		renderer.render(scene, camera);
	}

	requestAnimationFrame(animate);
});

