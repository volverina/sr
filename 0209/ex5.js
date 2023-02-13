import * as THREE from 'three';
import { MindARThree } from 'mindar-image-three';

document.addEventListener("DOMContentLoaded", () => {

	const start = async () => {
		//1. Ініціалізація MindAR
		const mindarThree = new MindARThree({
			container: document.body,
			imageTargetSrc: "face.mind"
		});

		//2. Щось намалювати
		const {renderer, scene, camera} = mindarThree;

		// instantiate a loader
		const loader = new THREE.TextureLoader();

		// 80 x 65 => 1 x 65/80
		const geometry = new THREE.PlaneGeometry( 1, 65.0/80 );
		const material = new THREE.MeshBasicMaterial( {
			//color: 0x00ffff, 
			//transparent: true,
			//opacity: 0.5,
			map: loader.load("face.png")
		} );
		const plane = new THREE.Mesh( geometry, material );

		//3. Прив'язати створений об'єкт до цільового зображення (маркеру)
		const anchor = mindarThree.addAnchor(0);
		anchor.group.add( plane );

		//4. Запуск MindAR 
		await mindarThree.start();

		//5. Цикл оновлення
		renderer.setAnimationLoop( () => {
			renderer.render(scene, camera);
		});
	}

	start();
});
