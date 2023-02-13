import * as THREE from 'three';
import { MindARThree } from 'mindar-image-three';

document.addEventListener("DOMContentLoaded", () => {

	const start = async () => {
		//1. Ініціалізація MindAR
		const mindarThree = new MindARThree({
			container: document.body,
			imageTargetSrc: "fromilid_internet.mind"
		});

		//2. Щось намалювати
		const {renderer, scene, camera} = mindarThree;

		// instantiate a loader
		const loader = new THREE.TextureLoader();

		// 80 x 65 => 1 x 65/80
		const geometry1 = new THREE.PlaneGeometry( 1, 1 );
		const material1 = new THREE.MeshBasicMaterial( {
			//color: 0x00ffff, 
			transparent: true,
			//opacity: 0.5,
			//map: loader.load("https://i.imgur.com/R6DKElM.png")
			map: loader.load("badge.png")
		} );
		const plane1 = new THREE.Mesh( geometry1, material1 );
		plane1.position.set(-1, 0, 0);
		//cube.rotation.set(0, Math.PI/4, 0);

		const geometry2 = new THREE.PlaneGeometry( 1, 1 );
		const material2 = new THREE.MeshBasicMaterial( {
			//color: 0x00ffff, 
			transparent: true,
			//opacity: 0.5,
			//map: loader.load("https://i.imgur.com/FWOlObu.jpeg")
			map: loader.load("https://i.imgur.com/R6DKElM.png")
		} );
		const plane2 = new THREE.Mesh( geometry2, material2 );
		plane2.position.set(+1, 0, 0);

		//3. Прив'язати створений об'єкт до цільового зображення (маркеру)
		const anchor = mindarThree.addAnchor(0);
		anchor.group.add( plane1 );
		anchor.group.add( plane2 );

		//4. Запуск MindAR 
		await mindarThree.start();

		const gradus = Math.PI/180;

		//5. Цикл оновлення
		renderer.setAnimationLoop( () => {
			plane1.rotation.z += gradus;
			//plane2.rotation.y += 0.2*gradus;
			renderer.render(scene, camera);
		});
	}

	start();
});
