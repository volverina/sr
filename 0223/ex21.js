import { MindARThree } from 'mindar-face-three';
import * as THREE from 'three';

document.addEventListener("DOMContentLoaded", () => {

	const start = async () => {

		//1. Ініціалізація MindAR
		const mindarThree = new MindARThree({
			container: document.body,
		});

		const {renderer, scene, camera} = mindarThree;

		//2. Створити сферу
		const geometry = new THREE.SphereGeometry( 0.1, 32, 16 );
      		const material = new THREE.MeshBasicMaterial( {color: 0x00ffff, transparent: true, opacity: 0.5} );
      		const sphere = new THREE.Mesh( geometry, material );

		//3. Прив'язати створений об'єкт до обличчя
		const anchor = mindarThree.addAnchor(1);
      		anchor.group.add(sphere);
      
		//4. Запуск MindAR 
		await mindarThree.start();

		//5. Цикл оновлення
		renderer.setAnimationLoop( () => {
			renderer.render(scene, camera);
		});
	}

	start();
});
