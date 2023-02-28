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
		glasses.scene.position.set(0, -0.12, -0.75);

		for(var i=17; i<27; i++)
			glasses.scene.children[i].visible = false;


		const occluder = await loadGLTF('../assets/headOccluder.glb');
		
		//console.log(occluder);

		occluder.scene.scale.set(0.070, 0.070, 0.070);
		occluder.scene.position.set(0, -0.3, 0.15);

		const occluderMaterial = new THREE.MeshBasicMaterial({color: 0x777777, wireframe:false, colorWrite: false});

		occluder.scene.traverse((obj) => {
			if(obj.isMesh)
				obj.material = occluderMaterial;
		});

		occluder.scene.renderOrder = 0;
		glasses.scene.renderOrder = 1;

		const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbbb, 1 );
		scene.add( light );

		//3. Прив'язати створений об'єкт до обличчя
		const glassesAnchor = mindarThree.addAnchor(6);
		glassesAnchor.group.add(glasses.scene);
      
		//3. Прив'язати створений об'єкт до обличчя
		const occluderAnchor = mindarThree.addAnchor(168);
		occluderAnchor.group.add(occluder.scene);
      
		//4. Запуск MindAR 
		await mindarThree.start();

		//5. Цикл оновлення
		renderer.setAnimationLoop( () => {
			renderer.render(scene, camera);
		});
	}

	start();
});
