import { MindARThree } from 'mindar-image-three';
import * as THREE from 'three';
import {loadGLTF} from "../js/loader.js"

document.addEventListener("DOMContentLoaded", () => {

	const start = async () => {
		//1. Ініціалізація MindAR
		const mindarThree = new MindARThree({
			container: document.body,
			imageTargetSrc: "raccoon_and_bear.mind",
			maxTrack: 2,
			uiLoading: "no",
			uiScanning: "no",
		});

		//2. Щось намалювати
		const {renderer, scene, camera} = mindarThree;

		const raccoon = await loadGLTF('https://raw.githubusercontent.com/hiukim/mind-ar-js/master/examples/image-tracking/assets/band-example/raccoon/scene.gltf');
		
		raccoon.scene.scale.set(0.1, 0.1, 0.1);
		raccoon.scene.position.set(0, -0.4, 0);
		//3. Прив'язати модель до цільового зображення (маркеру)
		const anchor0 = mindarThree.addAnchor(0);
		anchor0.group.add(raccoon.scene);

		const bear = await loadGLTF('https://raw.githubusercontent.com/hiukim/mind-ar-js/master/examples/image-tracking/assets/band-example/bear/scene.gltf');

		bear.scene.scale.set(0.1, 0.1, 0.1);
		bear.scene.position.set(0, -0.4, 0);
		//3. Прив'язати модель до цільового зображення (маркеру)
		const anchor1 = mindarThree.addAnchor(1);
		anchor1.group.add(bear.scene);

		const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbbb, 1 );
		scene.add( light );

		//4. Запуск MindAR 
		await mindarThree.start();

		//const gradus = Math.PI/180;

		//5. Цикл оновлення
		renderer.setAnimationLoop( () => {
			//if(isloaded)
			//raccoon.scene.rotation.y -= 3*gradus;
			//bear.scene.rotation.y += 2*gradus;
			renderer.render(scene, camera);
		});
	}

	start();
});
