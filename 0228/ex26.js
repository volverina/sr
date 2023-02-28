import { MindARThree } from 'mindar-face-three';
import * as THREE from 'three';
import {loadGLTF} from "../js/loader.js"


document.addEventListener("DOMContentLoaded", () => {

	const start = async () => {

		//1. Ініціалізація MindAR
		const mindarThree = new MindARThree({
			container: document.body,
		});

		const {renderer, scene, camera} = mindarThree;

		//2. 
		const glasses = await loadGLTF('../assets/uploads_files_3685558_11-20.glb');
		
		glasses.scene.scale.set(0.27, 0.25, 0.25);
		glasses.scene.position.set(0, -0.12, -0.7);

		for(var i=17; i<27; i++)
			glasses.scene.children[i].visible = false;

		const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbbb, 1 );
		scene.add( light );

		//3. Прив'язати створений об'єкт до обличчя
		const glassesAnchor = mindarThree.addAnchor(6);
		glassesAnchor.group.add(glasses.scene);
      
		// instantiate a loader
		const loader = new THREE.TextureLoader();

		//const meshMaterial = new THREE.MeshBasicMaterial({//color: 0x00AA00, //wireframe:true, 
			//map: loader.load("../assets/FaceAssets/Textures/faceMeshTrackers.png")
		//});

		const faceMesh = mindarThree.addFaceMesh();

		faceMesh.material.needsUpdate = true;

		//faceMesh.material.wireframe = true;
		faceMesh.material.transparent = true;
		//faceMesh.material.opacity = 0.5;
		faceMesh.material.map = loader.load("../assets/moustache1.png");
		//faceMesh.material.color = new THREE.Color( 0xff0000 );
		//faceMesh.material = meshMaterial;

		scene.add(faceMesh);

		//4. Запуск MindAR 
		await mindarThree.start();

		document.querySelector("button#switch").addEventListener("click", () => {
			mindarThree.switchCamera();
		});

		//5. Цикл оновлення
		renderer.setAnimationLoop( () => {
			renderer.render(scene, camera);
		});
	}

	start();
});
