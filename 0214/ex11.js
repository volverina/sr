import { MindARThree } from 'mindar-image-three';
import * as THREE from 'three';
import {loadGLTF} from "../js/loader.js"

document.addEventListener("DOMContentLoaded", () => {

	const start = async () => {
		//1. Ініціалізація MindAR
		const mindarThree = new MindARThree({
			container: document.body,
			imageTargetSrc: "targets1-5.mind",
			maxTrack: 2,
			uiLoading: "yes",
			uiScanning: "yes",
		});

		//2. Щось намалювати
		const {renderer, scene, camera} = mindarThree;

		//масив якорів
		const anchors = [
			mindarThree.addAnchor(0),
			mindarThree.addAnchor(1),
			mindarThree.addAnchor(2),
			mindarThree.addAnchor(3),
			mindarThree.addAnchor(4)
		]

		const raccoon = await loadGLTF('https://raw.githubusercontent.com/hiukim/mind-ar-js/master/examples/image-tracking/assets/band-example/raccoon/scene.gltf');
		
		raccoon.scene.scale.set(0.1, 0.1, 0.1);
		raccoon.scene.position.set(0, -0.4, 0);

		const bear = await loadGLTF('https://raw.githubusercontent.com/hiukim/mind-ar-js/master/examples/image-tracking/assets/band-example/bear/scene.gltf');
		
		bear.scene.scale.set(0.1, 0.1, 0.1);
		bear.scene.position.set(0, -0.4, 0);
		//3. Прив'язати модель до цільового зображення (маркеру)
		
		const wolf = await loadGLTF('../0209/wolf/Wolf-Blender-2.82a.glb');

		wolf.scene.position.set(1, -0.4, 0);
		//3. Прив'язати модель до цільового зображення (маркеру)

		const geometry1 = new THREE.SphereGeometry( 1, 32, 32 );

		const material1 = new THREE.MeshBasicMaterial( {
				//transparent: true,
		} );
		const sphere = new THREE.Mesh( geometry1, material1 );

		const material2 = new THREE.MeshBasicMaterial( {
			color: 0x00ffff, 
			transparent: true,
			opacity: 0.5
		} );
		const sphere2 = new THREE.Mesh( geometry1, material2);

		anchors[0].group.add(raccoon.scene);
		anchors[1].group.add(bear.scene);
		anchors[2].group.add(wolf.scene);
		anchors[3].group.add(sphere);
		anchors[4].group.add(sphere2);


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
