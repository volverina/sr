import { MindARThree } from 'mindar-image-three';
import * as THREE from 'three';
import {loadGLTF} from "../js/loader.js"

document.addEventListener("DOMContentLoaded", () => {

	const start = async () => {
		//1. Ініціалізація MindAR
		const mindarThree = new MindARThree({
			container: document.body,
			imageTargetSrc: "fromilid_internet.mind",
			maxTrack: 1,
			uiLoading: "yes",
			uiScanning: "yes",
		});

		//2. Щось намалювати
		const {renderer, scene, camera} = mindarThree;

		//якір
		const anchor = mindarThree.addAnchor(0);

		const raccoon = await loadGLTF('../0209/wolf/Wolf-Blender-2.82a.gltf');
		
		//raccoon.scene.scale.set(0.1, 0.1, 0.1);
		//raccoon.scene.position.set(0, -0.4, 0);

		anchor.group.add(raccoon.scene);

		const mixer = new THREE.AnimationMixer(raccoon.scene);


		console.log(raccoon);

		if(raccoon.animations.length != 0)
		{
			const action = mixer.clipAction(raccoon.animations[1]);
			action.play();
		}

		const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbbb, 1 );
		scene.add( light );

		const timer = new THREE.Clock();

		//4. Запуск MindAR 
		await mindarThree.start();

		//5. Цикл оновлення
		renderer.setAnimationLoop( () => {
			const delta = timer.getDelta();
			mixer.update(delta);
			raccoon.scene.rotation.y += delta;
			renderer.render(scene, camera);
		});
	}

	start();
});
