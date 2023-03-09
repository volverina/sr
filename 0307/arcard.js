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

		// додавання елементів до групи, пов'язаної із якорем 0 (фото візитівки)
		anchor.group.add(card);
		anchor.group.add(emailIcon);
		anchor.group.add(locationIcon);
		anchor.group.add(webIcon);
		anchor.group.add(profileIcon);
		anchor.group.add(avatar.scene);
		anchor.group.add(portfolioGroup);

		// створення порожнього елементу HTML <div></div>
		const textElement = document.createElement("div");
		const textObj = new CSS3DObject(textElement);
		textObj.position.set(0, -1000, 0);
		textElement.style.fontSize = "75px";
		textElement.style.padding = "25px";
		textElement.style.background = "#FFFFFF";

		textObj.visible = false;
		//textElement.innerHTML = "Воно працює!";
		
		//якір для CSS
		const cssAnchor = mindarThree.addCSSAnchor(0);
		// додавання до якорю CSS елементу CSS div
		cssAnchor.group.add(textObj);

		// налаштування анімації моделі
		const mixer = new THREE.AnimationMixer(avatar.scene);

		if(avatar.animations.length != 0)
		{
			const action = mixer.clipAction(avatar.animations[1]); // вибір анімації номер 1
			action.play();
		}

		// створення таймер
		const timer = new THREE.Clock();

		// створення додаткового атрибуту clickable для об'єктів, що мають реагувати на натискання миші
		emailIcon.userData.clickable = true;
		locationIcon.userData.clickable = true;
		webIcon.userData.clickable = true;
		profileIcon.userData.clickable = true;
		leftIcon.userData.clickable = true;
		rightIcon.userData.clickable = true;
		portfolioItem0.userData.clickable = true;
		portfolioItem0V.userData.clickable = true;
		portfolioItem1.userData.clickable = true;
		portfolioItem2.userData.clickable = true;

		// масив статитичних зображень елементів портфоліо
		const portfolioItems = [
			portfolioItem0,
			portfolioItem1,
			portfolioItem2
		];
		let currentPortfolio = 0; // поточний елемент для відображення

		// універсальний обробник "дотику" до елементів сцени
		document.body.addEventListener("click", (event) => {
			const mouse_x = ( event.clientX / window.innerWidth ) * 2 - 1;
			const mouse_y = - ( event.clientY / window.innerHeight ) * 2 + 1;
			const mouse = new THREE.Vector2(mouse_x, mouse_y);
			const raycaster = new THREE.Raycaster();
			raycaster.setFromCamera( mouse, camera );

			const intersects = raycaster.intersectObjects(scene.children, true);

			if(intersects.length != 0 )	//  є перетини
			{
				let o = intersects[0].object;

				while(o.parent 	&& !o.userData.clickable)
					o = o.parent;

				if(o.userData.clickable)
				{ 
					if(o === leftIcon || o === rightIcon)
					{
						// 0, 1, 2
						// right -> [0, 1, 2], [1, 2, 0], [2, 0, 1], [0, 1, 2]
						// left -> [0, 1, 2], [2, 0, 1], [1, 2, 0], [0, 1, 2] 
						if(o === leftIcon)
							currentPortfolio = (currentPortfolio - 1 + portfolioItems.length) % portfolioItems.length;
						if(o === rightIcon)
							currentPortfolio = (currentPortfolio + 1) % portfolioItems.length;
						portfolioItem0Video.pause();

						for(let i =0; i < portfolioItems.length; i++)
							portfolioGroup.remove(portfolioItems[i]);
						portfolioGroup.add(portfolioItems[currentPortfolio]);
					}
					else if (o === portfolioItem0)
					{
						portfolioGroup.remove(portfolioItem0);
						portfolioGroup.add(portfolioItem0V);
						portfolioItems[0] = portfolioItem0V;
						portfolioItem0Video.play();
					}
					else if (o === portfolioItem0V)
					{
						if(portfolioItem0Video.paused)
							portfolioItem0Video.play();
						else
							portfolioItem0Video.pause();
					}
					else if (o === emailIcon)					
					{
						textObj.visible = true;
						textElement.innerHTML = "semerikov@gmail.com";
					}
					else if (o === locationIcon)					
					{
						textObj.visible = true;
						textElement.innerHTML = "Kryvyi Rih, Ukraine";
					}
					else if (o === webIcon)					
					{
						textObj.visible = true;
						textElement.innerHTML = "https://kdpu.edu.ua/semerikov/";
					}
					else if (o === profileIcon)					
					{
						textObj.visible = true;
						textElement.innerHTML = "https://kdpu.edu.ua/personal/cc.html";
					}
					else if (o === portfolioItem1)					
					{
						window.open("https://moodle.kdpu.edu.ua/course/view.php?id=8684");
					}
					else if (o === portfolioItem2)					
					{
						window.open("https://acnsci.org/journal/index.php/etq");
					}

				}
			}
		});


		//4. Запуск MindAR 
		await mindarThree.start();

		//5. Цикл оновлення
		renderer.setAnimationLoop( () => {
			// delta - час, що минув від попереднього оновлення сцени; elapsed - загальний час
			const delta = timer.getDelta();
			const elapsed = timer.getElapsedTime();
			mixer.update(delta); //відтворити фрагмент анімації за час delta

			const iconScale = 1 + 0.25 * Math.sin(5 * elapsed); // масштаб: [0.75; 1.25]

			// анімація іконок шляхом зміни їх масштабу
			[emailIcon, locationIcon, webIcon, profileIcon].forEach( (icon) => {
				icon.scale.set(iconScale, iconScale, iconScale);
			});

			// рух моделі залежно від часу по вісі Z
			avatar.scene.position.set(-0.4, -0.4, -0.5 + Math.sin(1 * elapsed));
			
			renderer.render(scene, camera);
			cssRenderer.render(cssScene, camera);
		});
	}

	start();
});
