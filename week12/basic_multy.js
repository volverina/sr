//import * as THREE from '../js/three/three.module.js';

var scene, camera, renderer;
var arToolkitSource, arToolkitContext;

initialize();
animate();

function initialize()
{
	scene = new THREE.Scene();

	let ambientLight = new THREE.AmbientLight( 0xcccccc, 0.5 );
	scene.add( ambientLight );
				
	camera = new THREE.Camera();
	scene.add(camera);

	renderer = new THREE.WebGLRenderer({antialias : true, alpha: true });
	renderer.setSize( window.innerWidth, window.innerHeight);
	document.body.appendChild( renderer.domElement );

	arToolkitSource = new THREEx.ArToolkitSource({
		sourceType : 'webcam',
	});

	function onResize()
	{
		arToolkitSource.onResizeElement();
		arToolkitSource.copyElementSizeTo(renderer.domElement);
		if ( arToolkitContext.arController )
		{
			arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas);
		}	
	}

	arToolkitSource.init(() => {
		setTimeout(() => {
			onResize();
		}, 250);
	});
	
	// handle resize event
	window.addEventListener('resize', function(){
		onResize();
	});
	
	// create atToolkitContext
	arToolkitContext = new THREEx.ArToolkitContext({
		cameraParametersUrl: '../assets/camera_para.dat',
		detectionMode: 'mono'
	});
	
	// copy projection matrix to camera when initialization complete
	arToolkitContext.init( () => {
		camera.projectionMatrix.copy( arToolkitContext.getProjectionMatrix() );
	});

	////////////////////////////////////////////////////////////
	// setup markerRoots
	////////////////////////////////////////////////////////////

	let loader = new THREE.TextureLoader();
	let texture = loader.load( '../assets/cube5.png' );
		
	let patternArray = ["pattern-letterA", "pattern-letterB", "pattern-letterC", "pattern-letterD", "pattern-letterF", "pattern-letterG", "pattern-kanji", "pattern-hiro"];
	let colorArray   = [0xff0000, 0xff8800, 0xffff00, 0x00cc00, 0x0000ff, 0xcc00ff, 0xcccccc, 0xffffff];

	for (let i = 0; i < patternArray.length; i++)
	{
		let markerRoot = new THREE.Group();
		scene.add(markerRoot);
		let markerControls = new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
			type : 'pattern', patternUrl : "../assets/" + patternArray[i] + ".patt",
		});
	
		let mesh = new THREE.Mesh( 
			new THREE.BoxGeometry(1,1,1), 
			new THREE.MeshBasicMaterial({color:colorArray[i], map:texture, transparent:true, opacity:0.5}) 
		);
		mesh.position.y = 1.0/2;
		markerRoot.add( mesh );
	}
}


function animate()
{
	requestAnimationFrame(animate);
	// update artoolkit on every frame
	if ( arToolkitSource.ready !== false )
		arToolkitContext.update( arToolkitSource.domElement );
	renderer.render( scene, camera );
}

