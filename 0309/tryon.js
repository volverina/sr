import { MindARThree } from 'mindar-face-three';
import * as THREE from 'three';
import {loadGLTF} from "../js/loader.js"

const capture = (mindarThree) => {
	const {video, renderer, scene, camera} = mindarThree;

	const renderCanvas = renderer.domElement;

	const bufferCanvas = document.createElement("canvas");
	const context = bufferCanvas.getContext("2d");

	bufferCanvas.width = renderCanvas.width;
	bufferCanvas.height = renderCanvas.height;

	const sx = (video.clientWidth - renderCanvas.clientWidth) / 2 * video.videoWidth / video.clientWidth ;
	const sy = (video.clientHeight - renderCanvas.clientHeight) / 2 * video.videoHeight/ video.clientHeight;
	const sWidth = video.videoWidth - 2 * sx;
	const sHeight = video.videoHeight - 2 * sy;

	context.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, bufferCanvas.width, bufferCanvas.height);

	renderer.preserveDrawingBuffer = true;
	renderer.render(scene, camera);
	context.drawImage(renderCanvas, 0, 0, bufferCanvas.width, bufferCanvas.height);
	renderer.preserveDrawingBuffer = false;

	const data = bufferCanvas.toDataURL("image/png");

	return data;
}


document.addEventListener("DOMContentLoaded", () => {

	const start = async () => {

		const preview = document.querySelector("#preview");
		const previewClose = document.querySelector("#preview-close");
		const previewImage = document.querySelector("#preview-image");
		const previewShare = document.querySelector("#preview-share");

		//1. Ініціалізація MindAR
		const mindarThree = new MindARThree({
			container: document.body,
		});

		const {renderer, scene, camera} = mindarThree;

		// налаштування освітлення
		const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbbb, 1 ); // розсіяне
		const light2 = new THREE.DirectionalLight( 0xffffff, 0.6 ); // спрямоване - перед обличчям, зліва та вгорі
		light2.position.set(-0.5, 1, 1);
		scene.add( light );
		scene.add( light2 );

		// налаштування окклюдеру (невидима модель голови, що знаходиться на місці реальної голови)
		const occluder = await loadGLTF('../assets/headOccluder.glb');
		
		occluder.scene.scale.set(0.068, 0.070, 0.070);
		occluder.scene.position.set(0, -0.3, 0.15);

		occluder.scene.traverse((obj) => {
			if(obj.isMesh) {
				const occluderMaterial = new THREE.MeshPhongMaterial({colorWrite: false});
				obj.material = occluderMaterial;
			}
		});

		occluder.scene.renderOrder = 0;
		//3. Прив'язати створений об'єкт до обличчя
		const occluderAnchor = mindarThree.addAnchor(168);
		occluderAnchor.group.add(occluder.scene);
      

		//2. Завантаження окулярів, капелюхів та серег
		const glasses = await loadGLTF('../assets/uploads_files_3685558_11-20.glb');
		
		glasses.scene.scale.set(0.27, 0.25, 0.25);
		glasses.scene.position.set(0, -0.12, -0.75);

		for(var i=17; i<27; i++)
			glasses.scene.children[i].visible = false;

		glasses.scene.renderOrder = 1;

		const glassesAnchor = mindarThree.addAnchor(6);
		glassesAnchor.group.add(glasses.scene);
      
		const glasses2 = await loadGLTF('https://raw.githubusercontent.com/hiukim/mind-ar-js/master/examples/face-tracking/assets/glasses2/scene.gltf');

		glasses2.scene.rotation.set(0, -90*Math.PI/180, 0);
		glasses2.scene.scale.set(0.52, 0.52, 0.52);
		glasses2.scene.position.set(0, -0.3, -0.1);

		glasses2.scene.renderOrder = 1;

		const glasses2Anchor = mindarThree.addAnchor(168);
		glasses2Anchor.group.add(glasses2.scene);
      

		const hat1 = await loadGLTF('https://raw.githubusercontent.com/hiukim/mind-ar-js/master/examples/face-tracking/assets/hat/scene.gltf');

		hat1.scene.scale.set(0.35, 0.35, 0.35);
		hat1.scene.position.set(0, 1, -0.5);

		hat1.scene.renderOrder = 1;

		const hat1Anchor = mindarThree.addAnchor(10);
		hat1Anchor.group.add(hat1.scene);
      
		const hat2 = await loadGLTF('https://raw.githubusercontent.com/hiukim/mind-ar-js/master/examples/face-tracking/assets/hat2/scene.gltf');

		hat2.scene.position.set(0, -0.2, -0.5);
		hat2.scene.scale.set(0.008, 0.008, 0.008);

		hat2.scene.renderOrder = 1;

		const hat2Anchor = mindarThree.addAnchor(10);
		hat2Anchor.group.add(hat2.scene);


		const earringLeft = await loadGLTF('https://raw.githubusercontent.com/hiukim/mind-ar-js/master/examples/face-tracking/assets/earring/scene.gltf');

		earringLeft.scene.rotation.set(-0.1*Math.PI/180, 0, 0);
		earringLeft.scene.scale.set(0.05, 0.05, 0.05);
		earringLeft.scene.position.set(-0.02, -0.35, -0.3);

		earringLeft.scene.renderOrder = 1;

		const earringLeftAnchor = mindarThree.addAnchor(127);
		earringLeftAnchor.group.add(earringLeft.scene);
      
		const earringRight = await loadGLTF('https://raw.githubusercontent.com/hiukim/mind-ar-js/master/examples/face-tracking/assets/earring/scene.gltf');

		earringRight.scene.rotation.set(0.1*Math.PI/180, 0, 0);
		earringRight.scene.scale.set(0.05, 0.05, 0.05);
		earringRight.scene.position.set(0.02, -0.35, -0.3);

		earringRight.scene.renderOrder = 1;

		const earringRightAnchor = mindarThree.addAnchor(356);
		earringRightAnchor.group.add(earringRight.scene);
      
      
		const buttons = ["#glasses1", "#glasses2", "#hat1", "#hat2", "#earring"];
		const visibles = [true, false, false, true, true];
		const models = [
			[glasses.scene],
			[glasses2.scene],
			[hat1.scene],
			[hat2.scene],
			[earringLeft.scene, earringRight.scene],
		];

		const setVisible = (button, models, visible) => {
			if (visible) {
				button.classList.add("selected");
			} else {
				button.classList.remove("selected");
			}
			models.forEach((model) => {
				model.visible = visible;
			});
		}


		buttons.forEach((buttonId, index) => {
			const button = document.querySelector(buttonId);
	  		setVisible(button, models[index], visibles[index]);
			button.addEventListener('click', () => {
				visibles[index] = !visibles[index];
				setVisible(button, models[index], visibles[index]);
	  		});
		});

		//4. Запуск MindAR 
		await mindarThree.start();

		document.querySelector("button#capture").addEventListener("click", () => {
			const data = capture(mindarThree);
			preview.style.visibility = "visible";
			previewImage.src = data;
		});

		previewClose.addEventListener("click", () => {
			preview.style.visibility = "hidden";
		});

		previewShare.addEventListener("click", () => {
			const bufferCanvas = document.createElement("canvas");
			const context = bufferCanvas.getContext("2d");

			const renderCanvas = renderer.domElement;

			bufferCanvas.width = renderCanvas.width;
			bufferCanvas.height = renderCanvas.height;
			context.drawImage(previewImage, 0, 0, bufferCanvas.width, bufferCanvas.height);
			
			bufferCanvas.toBlob((blob) => {
				const file = new File([blob], "photo.png", {type: "image/png"});
				const files = [file];

				if (!navigator.canShare) {
					const link = document.createElement("a");
					link.download = "photo.png";
					link.href = previewImage.src;
					link.click();
				}
				
				if(navigator.canShare({files}))
				{
					try {
						navigator.share({files, title: "Поширити фото"});
						console.log("Web Share API підтримується");
					}
					catch (error) {
						console.log("Web Share API NOT підтримується");
					}
				}
				else
					console.log("Your system doesn't support sharing these files.");

			});
		});

		//5. Цикл оновлення
		renderer.setAnimationLoop( () => {
			renderer.render(scene, camera);
		});
	}

	start();
});
