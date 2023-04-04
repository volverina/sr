import * as THREE from 'three';
//import * as THREE from '../js/three/three.module.js';
//import {ARButton} from '../js/three/ARButton.js';
import {ARButton} from "three/addons/webxr/ARButton.js"
import {loadGLTF} from "../js/loader.js"

document.addEventListener("DOMContentLoaded", () => {
	//основна функція
	const initialize = async() => {

	        const scene = new THREE.Scene();

	        const camera = new THREE.PerspectiveCamera();

        	const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        	scene.add(light);

		const reticleGeometry = new THREE.RingGeometry( 0.15, 0.20, 32 );
		reticleGeometry.rotateX(-Math.PI/2);
		const reticleMaterial = new THREE.MeshBasicMaterial();
		const reticle = new THREE.Mesh( reticleGeometry, reticleMaterial );
		reticle.matrixAutoUpdate = false;
		reticle.visible = false;
		scene.add(reticle);


		const m1 = await loadGLTF('../assets/plant.glb');
//		const m2 = await loadGLTF('../assets/karaoke_piranha_plant.glb');
//		const m3 = await loadGLTF('../assets/alarm_clock.glb');
		const models = [m1]; //, m2, m3];
		
		//glasses.scene.scale.set(0.22, 0.22, 0.22);
		console.log(models);

		const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
	        renderer.setSize(window.innerWidth, window.innerHeight);
	        renderer.setPixelRatio(window.devicePixelRatio);

		renderer.xr.enabled = true;

		const arButton = ARButton.createButton(renderer, {
				requiredFeatures: ["hit-test"],
				optionalFeatures: ["dom-overlay"],
				domOverlay: {root: document.body},
			}
		);

	        document.body.appendChild(renderer.domElement);
		document.body.appendChild(arButton);
		console.log("arButton");

		const controller = renderer.xr.getController(0);
        	scene.add(controller);

		controller.addEventListener("select", () => {
/*
			console.log("select event start");
			const cubegeometry = new THREE.BoxGeometry(0.10, 0.10, 0.10);
			const cubematerial = new THREE.MeshBasicMaterial( {
				color: 0xffffff * Math.random(), 
				//transparent: true,
				//opacity: 0.5
			} );
			const cube = new THREE.Mesh(cubegeometry, cubematerial);
			cube.position.setFromMatrixPosition(reticle.matrix);
			cube.scale.y = Math.random() * 2 + 1;
			scene.add(cube);
			console.log("select event end");
*/
			const number = Math.round(Math.random()*(models.length-1));
			console.log("number = " + number);
			const m = models[number];///.clone();
			console.log(m);
			m.matrix = reticle.matrix; ///??? how to update model's position?
			// https://github.com/immersive-web/webxr-samples/blob/main/hit-test.html
			scene.add(m);
		});

		// перевірка запуску сесії WebXR
		renderer.xr.addEventListener("sessionstart", async (evt) => {
			const session = renderer.xr.getSession();
			const viewerReferenceSpace = await session.requestReferenceSpace("viewer");
			const hitTestSource = await session.requestHitTestSource({space: viewerReferenceSpace});

			renderer.setAnimationLoop((timestamp, frame) => {
				if(!frame)
					return;
				const hitTestResults = frame.getHitTestResults(hitTestSource);
				if(hitTestResults.length > 0)
				{
					const hit = hitTestResults[0];
					const referenceSpace = renderer.xr.getReferenceSpace();
					const hitPose = hit.getPose(referenceSpace);
					reticle.visible = true;
					reticle.matrix.fromArray(hitPose.transform.matrix);
				}
				else
				{
					//reticle.matrixAutoUpdate = false;
					reticle.visible = false;
				}
			    	renderer.render(scene, camera);
			}); 
		});

		renderer.xr.addEventListener("sessionend", (evt) => {
			console.log("Сесію WebXR завершено");
		});

	}

	initialize(); // розпочати роботу
});

