import { MindARThree } from 'mindar-image-three';
import * as THREE from 'three';
import {CSS3DObject, CSS3DRenderer} from "three/addons/renderers/CSS3DRenderer.js";


document.addEventListener("DOMContentLoaded", () => {

	const start = async () => {

		//1. Ініціалізація MindAR
		const mindarThree = new MindARThree({
			container: document.body,
			imageTargetSrc: "../assets/fromilid_internet.mind",
		});

		const {renderer, cssRenderer, scene, cssScene, camera} = mindarThree;

		//2. Створення об'єкту CSS
		const obj = new CSS3DObject(document.querySelector("div#ar-div"));

		//3. Прив'язати створений об'єкт до цільового зображення (маркеру)
		const anchor = mindarThree.addCSSAnchor(0);
		anchor.group.add(obj);

		//3a. Створення програвача Vimeo
    		var player = new Vimeo.Player(document.querySelector('iframe'));

		anchor.onTargetFound = () => {
			//play video
			player.play().catch(() => {
				console.log("Помилка програвання відео");
			});
		}

		anchor.onTargetLost = () => {
			//pause video
			player.pause().catch(() => {
				console.log("Помилка призупинення відео");
			});
		}

		player.setLoop(true).catch(() => {
			console.log("Помилка зациклювання відео");
		});

		player.on('play', function() {
			player.setCurrentTime(0).catch(() => {
				console.log("Помилка перемотки відео");
			});
    		});


		//4. Запуск MindAR 
		await mindarThree.start();

		//5. Цикл оновлення
		renderer.setAnimationLoop( () => {
			cssRenderer.render(cssScene, camera);
		});
	}

	start();
});
