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
		
		glasses.scene.scale.set(0.22, 0.22, 0.22);
		glasses.scene.position.set(0, 0, -0.7);

		for(var i=17; i<27; i++)
			glasses.scene.children[i].visible = false;

		console.log(glasses);

		const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbbb, 1 );
		scene.add( light );

		//3. Прив'язати створений об'єкт до обличчя
		const anchor = mindarThree.addAnchor(6);
		anchor.group.add(glasses.scene);
      
		//4. Запуск MindAR 
		await mindarThree.start();

		//5. Цикл оновлення
		renderer.setAnimationLoop( () => {
			renderer.render(scene, camera);
		});
	}

	start();
});
