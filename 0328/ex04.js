import * as THREE from '../js/three/three.module.js';
import {ARButton} from '../js/three/ARButton.js';

document.addEventListener("DOMContentLoaded", () => {
	//основна функція
	const initialize = async() => {

	        const scene = new THREE.Scene();

	        const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

        	const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        	scene.add(light);

		const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
	        renderer.setSize(window.innerWidth, window.innerHeight);

		renderer.xr.enabled = true;

		renderer.setAnimationLoop(() => {
		    renderer.render(scene, camera);
		}); 

		const arButton = ARButton.createButton(renderer, {
				optionalFeatures: ["dom-overlay"],
				domOverlay: {root: document.body},
			}
		);

	        document.body.appendChild(renderer.domElement);
		document.body.appendChild(arButton);

		const controller = renderer.xr.getController(0);
        	scene.add(controller);

		controller.addEventListener("select", () => {
			const cubegeometry = new THREE.BoxGeometry(0.05, 0.05, 0.05);
			const cubematerial = new THREE.MeshBasicMaterial( {
				color: 0xffffff * Math.random(), 
				transparent: true,
				opacity: 0.5
			} );
			const cube = new THREE.Mesh(cubegeometry, cubematerial);
			cube.position.applyMatrix4(controller.matrixWorld);
			cube.quaternion.setFromRotationMatrix(controller.matrixWorld);
			scene.add(cube);
		});
	}

	initialize(); // розпочати роботу
});

