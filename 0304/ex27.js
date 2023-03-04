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
		const link = document.createElement("a");
		link.download = "photo.png";
		link.href = data;
		link.click();
	}


	const start = async () => {

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
			capture(mindarThree);
		});

		//5. Цикл оновлення
		renderer.setAnimationLoop( () => {
			renderer.render(scene, camera);
		});
	}

	start();
});
