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
		const anchor = mindarThree.addAnchor(0);
		const loader = new THREE.TextureLoader();

		var sphere;
		var isloaded = false;

		loader.load("moon_texture.5400x2700.jpg", (texture) => {
			const geometry1 = new THREE.SphereGeometry( 1, 32, 32 );
			const material1 = new THREE.MeshBasicMaterial( {
				//transparent: true,
				map: texture
			} );
			sphere = new THREE.Mesh( geometry1, material1 );
			sphere.position.set(0, 0, 0);
			//3. Прив'язати створений об'єкт до цільового зображення (маркеру)
			anchor.group.add(sphere);
			isloaded = true;
		});

		//4. Запуск MindAR 
		await mindarThree.start();

		const gradus = Math.PI/180;

		//5. Цикл оновлення
		renderer.setAnimationLoop( () => {
			//console.log(isloaded);
			if(isloaded)
				sphere.rotation.x += gradus;
			renderer.render(scene, camera);
		});
	}

	start();
});
