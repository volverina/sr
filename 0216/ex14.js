import { MindARThree } from 'mindar-image-three';
import * as THREE from 'three';
import {loadGLTF, loadAudio} from "../js/loader.js"

document.addEventListener("DOMContentLoaded", () => {

	var startButton;

	const start = async () => {

		//startButton.textContent = "Камера увімкнена";
		startButton.hidden="hidden";

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

		const raccoon = await loadGLTF('https://raw.githubusercontent.com/hiukim/mind-ar-js/master/examples/image-tracking/assets/band-example/raccoon/scene.gltf');
		
		raccoon.scene.scale.set(0.1, 0.1, 0.1);
		raccoon.scene.position.set(0, -0.4, 0);
		raccoon.scene.userData.clickable = true;


		anchor.group.add(raccoon.scene);

		const audioClip = await loadAudio("https://ia802906.us.archive.org/6/items/bee-flat/bee-flat.mp3");

		const audioListener = new THREE.AudioListener();
		camera.add(audioListener);

		//audioListener.setMasterVolume( audioListener.getMasterVolume() * 20.0 );

		const sound = new THREE.PositionalAudio(audioListener);
		anchor.group.add(sound);
		sound.setBuffer(audioClip);
		sound.setRefDistance(100);
		sound.setLoop(true);

		anchor.onTargetFound = () => {
			console.log("Target Found");
			//sound.play();
		}

		anchor.onTargetLost = () => {
			console.log("Target Lost");
			sound.pause();
		}


		const mixer = new THREE.AnimationMixer(raccoon.scene);

		if(raccoon.animations.length != 0)
		{
			const action = mixer.clipAction(raccoon.animations[0]);
			action.play();
		}

		const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbbb, 1 );
		scene.add( light );

		const timer = new THREE.Clock();

		document.body.addEventListener("click", (event) => {
			const mouse_x = ( event.clientX / window.innerWidth ) * 2 - 1;
			const mouse_y = - ( event.clientY / window.innerHeight ) * 2 + 1;
			//alert("екранні координати натискання - "+ event.clientX+", "+ event.clientY+"\n"+
			//	"нормалізовані координати - "+ mouse_x+", "+ mouse_y);
			const mouse = new THREE.Vector2(mouse_x, mouse_y);
			const raycaster = new THREE.Raycaster();
			raycaster.setFromCamera( mouse, camera );

			const intersects = raycaster.intersectObjects(scene.children, true);
			//console.log(intersects);

			if(intersects.length != 0 )	//  є перетини
			{
				
				console.log("Натиснули на .. ");
				console.log(intersects[0].object);
				console.log("Модель єнота - ");
				console.log(raccoon.scene);
				
				let o = intersects[0].object;

				while(o.parent 	&& !o.userData.clickable)
					o = o.parent;

				console.log("Кореневий o - ");
				console.log(o);

				if(o.userData.clickable && o === raccoon.scene)
					sound.play();			
			}
		});


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

	//start();
	startButton = document.createElement("button");
	startButton.textContent = "Будь-ласка, дозвольте скористатись камерою";
	document.body.appendChild(startButton);
	startButton.addEventListener("click", start);

});
