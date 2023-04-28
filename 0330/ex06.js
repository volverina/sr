import * as THREE from 'three';
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
		const m2 = await loadGLTF('../assets/karaoke_piranha_plant.glb');
		//const m3 = await loadGLTF('../assets/alarm_clock.glb');
		const m4 = await loadGLTF('../assets/headOccluder.glb');
		const m5 = await loadGLTF('../assets/RobotExpressive.glb');
		//const m6 = await loadGLTF('../assets/uploads_files_3685558_11-20.glb');


		const models = [m1, m2, 
			//m3, 
			m4, m5, 
			//m6
			];
		
		m1.scene.scale.set(0.15, 0.15, 0.15);
		m2.scene.scale.set(0.002, 0.002, 0.002);
		//m3.scene.scale.set(0.001, 0.001, 0.001);
		m4.scene.scale.set(0.01, 0.01, 0.01);
		m5.scene.scale.set(0.03, 0.03, 0.03);
		//m6.scene.scale.set(0.045, 0.045, 0.045);
		//m6.scene.rotation.y = -Math.PI/2;

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

		const controller = renderer.xr.getController(0);
        	scene.add(controller);

		controller.addEventListener("select", () => {
			const number = Math.round(Math.random()*(models.length-1));
			const m = models[number].scene.clone();
	    		m.position.setFromMatrixPosition(reticle.matrix);
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
					reticle.visible = false;
			    	renderer.render(scene, camera);
			}); 
		});

		renderer.xr.addEventListener("sessionend", (evt) => {
			console.log("Сесію WebXR завершено");
		});

	}

	initialize(); // розпочати роботу
});

