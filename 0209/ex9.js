import { MindARThree } from 'mindar-image-three';
import * as THREE from 'three';
import {loadGLTF} from "../js/loader.js"

document.addEventListener("DOMContentLoaded", () => {

	const start = async () => {
		//1. Ініціалізація MindAR
		const mindarThree = new MindARThree({
			container: document.body,
			imageTargetSrc: "https://raw.githubusercontent.com/hiukim/mind-ar-js/master/examples/image-tracking/assets/band-example/raccoon.mind" //"racoon.mind"
		});

		//2. Щось намалювати
		const {renderer, scene, camera} = mindarThree;

		const anchor = mindarThree.addAnchor(0);

		//const gltf = await loadGLTF('https://raw.githubusercontent.com/hiukim/mind-ar-js/master/examples/image-tracking/assets/band-example/raccoon/scene.gltf');
		const gltf = await loadGLTF('raccoon/scene.gltf');

		gltf.scene.scale.set(0.1, 0.1, 0.1);
		gltf.scene.position.set(0, -0.4, 0);
		//3. Прив'язати модель до цільового зображення (маркеру)
		anchor.group.add(gltf.scene);

		const wolf = await loadGLTF('wolf/Wolf-Blender-2.82a.glb');

		//wolf.scene.scale.set(1.5, 1,5, 1.5);
		wolf.scene.position.set(1, -0.4, 0);
		//3. Прив'язати модель до цільового зображення (маркеру)
		anchor.group.add(wolf.scene);

		const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbbb, 1 );
		scene.add( light );

		//4. Запуск MindAR 
		await mindarThree.start();

		const gradus = Math.PI/180;

		//5. Цикл оновлення
		renderer.setAnimationLoop( () => {
			//if(isloaded)
			gltf.scene.rotation.y -= 3*gradus;
			wolf.scene.rotation.y += 2*gradus;
			renderer.render(scene, camera);
		});
	}

	start();
});
