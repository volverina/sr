
// 0. Підключення б-ки Three.js
//import * as THREE from '../js/three/three.module.js';
//import * from "../js/arjs/ar.js";

//import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
//import { OrbitControls } from '../js/three/OrbitControls.js';


var cube, lightTwo, torus, renderer, scene, camera, controls;

//const button = document.getElementById( 'start' );

//button.addEventListener("click", start);

function start()
{
	//button.style.display="none";
	// Our Javascript will go here.

	// let scene = new THREE.Scene();
	// var scene = new THREE.Scene();
	// scene = new THREE.Scene();

	// 1. Створення сцени
	scene = new THREE.Scene();

	// 2. Створення перспективної камери
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

	// 3. Створення рендереру (полотно) з параметрами за замовчанням
	renderer = new THREE.WebGLRenderer({antialias: true});

	// 4. Розтягування полотна до розміру вікна
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor(0xeeeeee,1);

	// 5. Додавання полотна до тіла документа
	document.body.appendChild( renderer.domElement );

	//controls = new OrbitControls( camera, renderer.domElement );
	//controls.autoRotate = true;
	//controls.autoRotateSpeed = 0.20;

	// https://dev.to/pahund/resizing-a-three-js-scene-when-the-browser-window-size-changes-4lnd
	window.addEventListener('resize', function() {
		camera.fov = window.innerHeight / window.screen.height;
		//camera.fov = Math.atan(window.innerHeight / 2 / camera.position.z) * 2 * THREE.Math.RAD2DEG;
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
	});

	// 6. Створення кубічної геометрії
	const geometry = new THREE.BoxGeometry( 1, 1, 1 );
	// 7. Створення матеріалу із власним зеленим кольором
	const material = [
		new THREE.MeshBasicMaterial( { //0
					color: Math.random()*0xffffff,
					transparent: true,
					opacity: 0.7,
					wireframe: false
					} ),
		new THREE.MeshBasicMaterial( { //1
					color: Math.random()*0xffffff,
					transparent: true,
					opacity: 0.7,
					wireframe: false
					} ),
		new THREE.MeshBasicMaterial( { //2
					color: Math.random()*0xffffff,
					transparent: true,
					opacity: 0.7,
					wireframe: false
					} ),
		new THREE.MeshBasicMaterial( { //3
					color: 0xffffff,
					} ),
		new THREE.MeshBasicMaterial( { //4
					color: Math.random()*0xffffff,
					transparent: true,
					opacity: 0.7,
					wireframe: false
					} ),
		new THREE.MeshBasicMaterial( { //5
					color: Math.random()*0xffffff,
					transparent: true,
					opacity: 0.7,
					wireframe: false
					} )
	]

	// 8. Створення з кубічної геометрії та матеріалу із власним зеленим кольором 3D-об'єкту
	cube = new THREE.Mesh( geometry, material );

	cube.rotation.y = 45*Math.PI/180;
	cube.rotation.x = 15*Math.PI/180;

	// 9. Додавання 3D-об'єкту (кубу) до сцени
	scene.add( cube );


	const geometryCapsule = new THREE.CapsuleGeometry( 0.5, 1, 4, 8 );
	const materialCapsule = new THREE.MeshPhongMaterial( {color: 0xff0000} );
	const capsule = new THREE.Mesh( geometryCapsule, materialCapsule );
	scene.add( capsule );
	capsule.position.set(-3, 0, -2);

	var lightOne=new THREE.AmbientLight(0xffffff, 0.5);
	scene.add(lightOne);

	lightTwo=new THREE.PointLight(0xffffff, 0.5);
	scene.add(lightTwo);
	lightTwo.position.set(-1.5, 0, -1);


	const geometryTorus = new THREE.TorusGeometry( 3, 1.5, 16, 100 );
	const materialTorus = new THREE.MeshBasicMaterial();
	torus = new THREE.Mesh( geometryTorus, materialTorus );
	scene.add( torus );
	torus.position.x=10;
	torus.position.z=-15;

	const light3 = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
	scene.add( light3 );

	const loader = new THREE.TextureLoader();

	const texture = loader.load( '../assets/petrykivka.png' );

	material[0].map = loader.load( '../assets/cube1.png' );
	material[1].map = loader.load( '../assets/cube2.png' );
	material[2].map = loader.load( '../assets/cube3.png' );
	//material[3].map = loader.load( '../assets/cube0.png' );
	material[4].map = loader.load( '../assets/cube4.png' );
	material[5].map = loader.load( '../assets/cube5.png' );


	const geometryPlane = new THREE.PlaneGeometry( 16, 9 );
	const materialPlane = new THREE.MeshBasicMaterial( {color: 0xffffff} );
	const plane = new THREE.Mesh( geometryPlane, materialPlane );
	scene.add( plane );
	plane.position.x=10;
	plane.position.z=-10;

	materialCapsule.map = texture;


	//const video = document.getElementById( 'videoQ' );
	//video.play();

	//const video_texture = new THREE.VideoTexture( video );

	//materialPlane.map = video_texture; 

	///const video2 = document.getElementById( 'videoToby' );
	//video2.play();

	//const video_texture2 = new THREE.VideoTexture( video2 );

	//material[3].map = video_texture2;
	//materialTorus.map = video_texture2;

	// 10. Відсунути на 5 м камеру від початку координат
	camera.position.z = 3;

	//controls.update();

	//camera.position.x = -5;
	//camera.position.y = -2;

	/*
		const animate = () => {

		}
	*/
	// 12. Виклик функції animate
	animate();
}


start();

// 11. Створення функції animate
var phi = 0;


function animate() {
	//11.1 - запит, за можливості, знову викликати функцію animate
	requestAnimationFrame( animate );

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	const x = 1.5*Math.cos(phi)+(-3);
	const z = 1.5*Math.sin(phi)+(-2);
	lightTwo.position.set(x, 0, z);

	torus.position.set(15*Math.cos(phi), 15*Math.sin(phi), -15);
	torus.rotation.y += phi/100;

	phi += Math.PI/180;

//	camera.rotation.y += phi/100;
	//controls.update();

	//11.2 - рендеринг сцени
	renderer.render( scene, camera );
}






/*
var scene, camera, renderer, clock, deltaTime, totalTime;

var arToolkitSource, arToolkitContext;

var markerRoot1, markerRoot2;

var mesh1;

initialize();
//animate();

function initialize()
{
	scene = new THREE.Scene();

	let ambientLight = new THREE.AmbientLight( 0xcccccc, 0.5 );
	scene.add( ambientLight );
				
	camera = new THREE.Camera();
	scene.add(camera);

	renderer = new THREE.WebGLRenderer({
		antialias : true,
		alpha: true,
		canvas: document.getElementById("Canvas")
	});
	console.log(renderer.domElement);
    	//document.body.appendChild(renderer.domElement);

	//renderer.setClearColor(new THREE.Color('lightgrey'), 0)
	//renderer.setSize( 640, 480 );
	//renderer.domElement.style.position = 'absolute';
	//renderer.domElement.style.top = '0px';
	//renderer.domElement.style.left = '0px';
	//document.body.appendChild( renderer.domElement );

	clock = new THREE.Clock();
	deltaTime = 0;
	totalTime = 0;
	
	////////////////////////////////////////////////////////////
	// setup arToolkitSource
	////////////////////////////////////////////////////////////

	arToolkitSource = new THREEx.ArToolkitSource({
		sourceType : 'webcam',
	});

	function onResize()
	{
		arToolkitSource.onResize()	
		arToolkitSource.copySizeTo(renderer.domElement)	
		if ( arToolkitContext.arController !== null )
		{
			arToolkitSource.copySizeTo(arToolkitContext.arController.canvas)	
		}	
	}

	arToolkitSource.init(function onReady(){
		onResize()
	});
	
	// handle resize event
	window.addEventListener('resize', function(){
		onResize()
	});
	
	////////////////////////////////////////////////////////////
	// setup arToolkitContext
	////////////////////////////////////////////////////////////	

	// create atToolkitContext
	arToolkitContext = new THREEx.ArToolkitContext({
		cameraParametersUrl: 'data/camera_para.dat',
		detectionMode: 'mono'
	});
	
	// copy projection matrix to camera when initialization complete
	arToolkitContext.init( function onCompleted(){
		camera.projectionMatrix.copy( arToolkitContext.getProjectionMatrix() );
	});

	////////////////////////////////////////////////////////////
	// setup markerRoots
	////////////////////////////////////////////////////////////

	// build markerControls
	markerRoot1 = new THREE.Group();
	scene.add(markerRoot1);
	let markerControls1 = new THREEx.ArMarkerControls(arToolkitContext, markerRoot1, {
		type: 'pattern', patternUrl: "data/hiro.patt",
	})

	let geometry1	= new THREE.CubeGeometry(1,1,1);
	let material1	= new THREE.MeshNormalMaterial({
		transparent: true,
		opacity: 0.5,
		side: THREE.DoubleSide
	}); 
	
	mesh1 = new THREE.Mesh( geometry1, material1 );
	mesh1.position.y = 0.5;
	
	markerRoot1.add( mesh1 );
}


function update()
{
	// update artoolkit on every frame
	if ( arToolkitSource.ready !== false )
		arToolkitContext.update( arToolkitSource.domElement );
}


function render()
{
	renderer.render( scene, camera );
}


function animate()
{
	requestAnimationFrame(animate);
	deltaTime = clock.getDelta();
	totalTime += deltaTime;
	update();
	render();
}
*/
