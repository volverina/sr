import * as THREE from '../js/three/three.module.js';
import {ARButton} from '../js/three/ARButton.js';


document.addEventListener("DOMContentLoaded", () => {
	//основна функція
	const initialize = async() => {
		// створення сцени з червоним кубом розміром 5 см

	        let scene = new THREE.Scene();
	        let camera = new THREE.PerspectiveCamera();

		let renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true
		});
	        renderer.setSize(window.innerWidth, window.innerHeight);
	        renderer.setPixelRatio(window.devicePixelRatio);

	        document.body.appendChild(renderer.domElement);

		const cubegeometry = new THREE.BoxGeometry(0.05, 0.05, 0.05);
		const cubematerial = new THREE.MeshBasicMaterial( {
			color: 0x00ffff, 
			transparent: true,
			opacity: 0.5
		} );


	        let cube = new THREE.Mesh(cubegeometry, cubematerial);

	        cube.position.set(0, 0, -0.3);
		scene.add(cube);
       
        	var light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        	scene.add(light);

		// повідомлення рушія Three.js про параметри використання WebXR
		renderer.xr.enabled = true;

		const controller = renderer.xr.getController(0);

		const textarea = document.querySelector("#events");

		controller.addEventListener("select", () => {
			textarea.value += "Надійшла подія select\n";
		});
		controller.addEventListener("selectstart", () => {
			textarea.value += "Надійшла подія selectstart\n";
		});
		controller.addEventListener("selectend", () => {
			textarea.value += "Надійшла подія selectend\n";
		});

		// перевірка запуску та завершення сесії WebXR
		renderer.xr.addEventListener("sessionstart", (evt) => {
			//console.log("Сесію WebXR розпочато");
			renderer.setAnimationLoop(() => {
			    renderer.render(scene, camera);
			}); 
		});


		const arButton = ARButton.createButton(renderer, {
				optionalFeatures: ["dom-overlay"],
				domOverlay: {root: document.body},
			}
		);
		//arButton.style.background = 'yellow';
		arButton.textContent = "Увійти до WebXR";
		document.body.appendChild(arButton);
	}

	initialize(); // розпочати роботу
});

