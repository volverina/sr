import { MindARThree } from 'mindar-face-three';
import * as THREE from 'three';
import {loadGLTF} from "../js/loader.js"


document.addEventListener("DOMContentLoaded", () => {

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

		//context.font = "48px serif";
		//context.fillText("Test -- тестування", 10, 50);

		const data = bufferCanvas.toDataURL("image/png");

		//console.log(data);
		/*
		const link = document.createElement("a");
		link.download = "photo.png";
		link.href = data;
		link.click();
		*/

		return data;
	}


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

		//2. 
		const glasses = await loadGLTF('../assets/uploads_files_3685558_11-20.glb');
		
		glasses.scene.scale.set(0.27, 0.25, 0.25);
		glasses.scene.position.set(0, -0.12, -0.7);

		for(var i=17; i<27; i++)
			glasses.scene.children[i].visible = false;

		const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbbb, 1 );
		scene.add( light );

		//3. Прив'язати створений об'єкт до обличчя
		const glassesAnchor = mindarThree.addAnchor(6);
		glassesAnchor.group.add(glasses.scene);
      
		// instantiate a loader
		const loader = new THREE.TextureLoader();

		const faceMesh = mindarThree.addFaceMesh();

		faceMesh.material.needsUpdate = true;
		faceMesh.material.transparent = true;
		faceMesh.material.map = loader.load("../assets/moustache1.png");

		scene.add(faceMesh);

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
