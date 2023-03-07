import { MindARThree } from 'mindar-image-three';
import * as THREE from 'three';
import {loadGLTF, loadVideo, loadAudio, loadTexture, loadTextures} from "../js/loader.js";
import {CSS3DObject, CSS3DRenderer} from "three/addons/renderers/CSS3DRenderer.js";


document.addEventListener("DOMContentLoaded", () => {

	const start = async () => {
		//1. Ініціалізація MindAR
		const mindarThree = new MindARThree({
			container: document.body,
			imageTargetSrc: "../assets/cc_card.mind",
		});

		//2. Щось намалювати
		const {renderer, cssRenderer, cssScene, scene, camera} = mindarThree;

		// вмикаємо освітлення для моделей та матеріалів, що відбивають світло 
		const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbbb, 1 );
		scene.add(light);
		
		const [
			cardTexture, // текстура для візитівки
			emailTexture, // іконка для електронної пошти
			locationTexture, // іконка для геоположення
			webTexture,  // іконка для веб
			profileTexture,  // іконка для профілю
			leftTexture,  // кнопка "ліворуч"
			rightTexture, // кнопка "праворуч"
			portfolioItem0Texture, // зображення для елементів портфоліо
			portfolioItem1Texture,
			portfolioItem2Texture,
		] = await loadTextures([
			"../assets/cc_card.png", // шлях до текстури для візитівки
			"https://live.staticflickr.com/7392/14191286471_19c50ea564_b.jpg",  // іконка для електронної пошти
			"https://live.staticflickr.com/65535/48078008041_21e1cc1a02_b.jpg", // іконка для геоположення
			"https://live.staticflickr.com/4807/46314674541_07ed6dc166_b.jpg",  // іконка для веб
			"https://live.staticflickr.com/4131/5037982272_0f8ef86ba8_w.jpg",  // іконка для профілю
			"https://live.staticflickr.com/7551/16220689162_375ff51ebc_w.jpg",  // кнопка "ліворуч"
			"https://live.staticflickr.com/8667/16221493785_734a8ac248_w.jpg", // кнопка "праворуч"
			"https://live.staticflickr.com/5018/5496623092_a00f976a57_b.jpg", // зображення для елементів портфоліо
			"../assets/course_sr.png", // https://moodle.kdpu.edu.ua/course/view.php?id=8684
			"../assets/etq.png", // https://acnsci.org/journal/index.php/etq
		]);
		
		// зображення візитівки на площині
		const planeGeometry = new THREE.PlaneGeometry(1, 663/484.0);
		const cardMaterial = new THREE.MeshBasicMaterial({map: cardTexture});
		const card = new THREE.Mesh(planeGeometry, cardMaterial);

		// створення іконок
			// створення спільної геометрії - коло
		const iconGeometry = new THREE.CircleGeometry(0.075, 32);
			// створення індивідуальних матеріалів - завантаження текстур
		const emailMaterial = new THREE.MeshBasicMaterial({map: emailTexture});
		const locationMaterial = new THREE.MeshBasicMaterial({map: locationTexture});
		const webMaterial = new THREE.MeshBasicMaterial({map: webTexture});
		const profileMaterial = new THREE.MeshBasicMaterial({map: profileTexture});
		const leftMaterial = new THREE.MeshBasicMaterial({map: leftTexture});
		const rightMaterial = new THREE.MeshBasicMaterial({map: rightTexture});
			// створення іконок з геометрії та матеріалів
		const emailIcon = new THREE.Mesh(iconGeometry, emailMaterial);
		const locationIcon = new THREE.Mesh(iconGeometry, locationMaterial);
		const webIcon = new THREE.Mesh(iconGeometry, webMaterial);
		const profileIcon = new THREE.Mesh(iconGeometry, profileMaterial);
		const leftIcon = new THREE.Mesh(iconGeometry, leftMaterial);
		const rightIcon = new THREE.Mesh(iconGeometry, rightMaterial);
          
		// створення матеріалу з накладеним відео
		const portfolioItem0Video = await loadVideo("../assets/Sokka_on_Fortune.mkv");
		portfolioItem0Video.muted = true; // вимикаємо звук (за наявності)
		const portfolioItem0VideoTexture = new THREE.VideoTexture(portfolioItem0Video); 
		const portfolioItem0VideoMaterial = new THREE.MeshBasicMaterial({map: portfolioItem0VideoTexture});
		
		// створення матеріалів з накладеними зображення (портфоліо)
		const portfolioItem0Material = new THREE.MeshBasicMaterial({map: portfolioItem0Texture});
		const portfolioItem1Material = new THREE.MeshBasicMaterial({map: portfolioItem1Texture});
		const portfolioItem2Material = new THREE.MeshBasicMaterial({map: portfolioItem2Texture});
		
		// створення площин для відображення елементів портфоліо
		const planeProfileGeometry = new THREE.PlaneGeometry(1, 880/1588.0);
		const portfolioItem0V = new THREE.Mesh(planeProfileGeometry, portfolioItem0VideoMaterial);
		const portfolioItem0 = new THREE.Mesh(planeProfileGeometry, portfolioItem0Material);
		const portfolioItem1 = new THREE.Mesh(planeProfileGeometry, portfolioItem1Material);
		const portfolioItem2 = new THREE.Mesh(planeProfileGeometry, portfolioItem2Material);

		// розташування 4 іконок під визитівкою
		emailIcon.position.set(-0.42, -0.8, 0);
		locationIcon.position.set(-0.14, -0.8, 0);
		webIcon.position.set(0.14, -0.8, 0);
		profileIcon.position.set(0.42, -0.8, 0);

		// створення групи із зображення 0-го елементу портфолі та кнопок "ліворуч", "праворуч"
		const portfolioGroup = new THREE.Group();
		portfolioGroup.position.set(0, 1.1, -0.01);
		portfolioGroup.add(portfolioItem0);
		portfolioGroup.add(leftIcon);
		portfolioGroup.add(rightIcon);
		leftIcon.position.set(-0.7, 0, 0);
		rightIcon.position.set(0.7, 0, 0);
	
		const avatar = await loadGLTF('../0209/wolf/Wolf-Blender-2.82a.gltf');
		avatar.scene.scale.set(0.5, 0.5, 0.5);
		avatar.scene.position.set(-0.4, -0.4, -0.5);
		avatar.scene.rotation.set(0, 45*Math.PI/180, 0);

		//якір для WebGL
		const anchor = mindarThree.addAnchor(0);

		anchor.group.add(card);
		anchor.group.add(emailIcon);
		anchor.group.add(locationIcon);
		anchor.group.add(webIcon);
		anchor.group.add(profileIcon);
		anchor.group.add(avatar.scene);
		anchor.group.add(portfolioGroup);

		const textElement = document.createElement("div");
		const textObj = new CSS3DObject(textElement);
		textObj.position.set(0, -1000, 0);
		//textObj.visible = false;
		textElement.style.fontSize = "75px";
		textElement.style.padding = "25px";
		textElement.style.background = "#FFFFFF";

		textElement.innerHTML = "Воно працює!";
		
		//якір для CSS
		const cssAnchor = mindarThree.addCSSAnchor(0);

		cssAnchor.group.add(textObj);

		const mixer = new THREE.AnimationMixer(avatar.scene);

		if(avatar.animations.length != 0)
		{
			const action = mixer.clipAction(avatar.animations[1]);
			action.play();
		}

		const timer = new THREE.Clock();

		//4. Запуск MindAR 
		await mindarThree.start();

		//5. Цикл оновлення
		renderer.setAnimationLoop( () => {
			const delta = timer.getDelta();
			const elapsed = timer.getElapsedTime();
			mixer.update(delta);

			const iconScale = 1 + 0.25 * Math.sin(5 * elapsed);

			[emailIcon, locationIcon, webIcon, profileIcon].forEach( (icon) => {
				icon.scale.set(iconScale, iconScale, iconScale);
			});


			avatar.scene.position.set(-0.4, -0.4, -0.5 + Math.sin(1 * elapsed));
			
			renderer.render(scene, camera);
			cssRenderer.render(cssScene, camera);
		});
	}

	start();
});
