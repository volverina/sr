import * as THREE from 'three';
import { MindARThree } from 'mindar-image-three';
//import {GLTFLoader} from "GLTFLoader";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";

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

		// Instantiate a loader
		const loader = new GLTFLoader();

		// Optional: Provide a DRACOLoader instance to decode compressed mesh data
/*
		const dracoLoader = new DRACOLoader();
		dracoLoader.setDecoderPath( '/examples/jsm/libs/draco/' );
		loader.setDRACOLoader( dracoLoader );
*/

		// Load a glTF resource
		loader.load(
			// resource URL
			//'raccoon/scene.gltf',
			'https://raw.githubusercontent.com/hiukim/mind-ar-js/master/examples/image-tracking/assets/band-example/raccoon/scene.gltf',

			// called when the resource is loaded
	 		( gltf ) => {
				gltf.scene.scale.set(0.1, 0.1, 0.1);
				gltf.scene.position.set(0, -0.4, 0);
				//3. Прив'язати модель до цільового зображення (маркеру)
				anchor.group.add(gltf.scene);
				/*
				gltf.animations; // Array<THREE.AnimationClip>
				gltf.scene; // THREE.Group
				gltf.scenes; // Array<THREE.Group>
				gltf.cameras; // Array<THREE.Camera>
				gltf.asset; // Object
				*/
			},
			// called while loading is progressing
			( xhr ) => {
				console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
			},
			// called when loading has errors
			( error ) => {
				console.log( 'An error happened: ', error );
			}
		);

		const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbbb, 1 );
		scene.add( light );

		//4. Запуск MindAR 
		await mindarThree.start();

		//const gradus = Math.PI/180;

		//5. Цикл оновлення
		renderer.setAnimationLoop( () => {
			//if(isloaded)
			//	sphere.rotation.x += gradus;
			renderer.render(scene, camera);
		});
	}

	start();
});
