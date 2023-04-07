// 0. Підключення б-ки Three.js
import * as THREE from '../js/three/three.module.js';

import { FirstPersonControls } from '../js/three/FirstPersonControls.js';


var cube, lightTwo, torus, renderer, scene, camera, controls;

const button = document.getElementById( 'start' );

button.addEventListener("click", start);

function start()
{
	button.style.display="none";
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

	controls = new FirstPersonControls( camera, renderer.domElement );

	// https://dev.to/pahund/resizing-a-three-js-scene-when-the-browser-window-size-changes-4lnd
	window.addEventListener('resize', function() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
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


	const video = document.getElementById( 'videoQ' );
	video.play();

	const video_texture = new THREE.VideoTexture( video );

	materialPlane.map = video_texture; 

	const video2 = document.getElementById( 'videoToby' );
	video2.play();

	const video_texture2 = new THREE.VideoTexture( video2 );

	material[3].map = video_texture2;
	materialTorus.map = video_texture2;

	// 10. Відсунути на 5 м камеру від початку координат
	camera.position.z = 7;

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


// 11. Створення функції animate
var phi = 0;

const clock = new THREE.Clock();

function animate() {

	const delta = clock.getDelta();

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
	controls.update(delta);

	//11.2 - рендеринг сцени
	renderer.render( scene, camera );
}




