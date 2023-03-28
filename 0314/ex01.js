import * as THREE from '../js/three/three.module.js';

document.addEventListener("DOMContentLoaded", () => {
	//основна функція
	const initialize = async() => {
		// посилання на кнопку
		const arButton = document.querySelector("#ar-button");

		// перевірка доступності на пристрої WebXR
		const supported = navigator.xr 
			&&
			await navigator.xr.isSessionSupported("immersive-ar");

		if(!supported)  // відключаємо кнопку за відсутності підтримки
		{
			arButton.textContent = "На жаль, WebXR не підтримується";
			arButton.disabled = true;
			return;
		}


		// створення сцени з червоним кубом розміром 5 см

	        let scene = new THREE.Scene();
	        let camera = new THREE.PerspectiveCamera();

		let renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true
		});
	        renderer.setSize(window.innerWidth, window.innerHeight);
	        renderer.setPixelRatio(window.devicePixelRatio);

	        document.body.appendChild(renderer.domElement);

		const cubegeometry = new THREE.BoxGeometry(0.05, 0.05, 0.05);
		const cubematerial = new THREE.MeshBasicMaterial({color:'red'})

	        let cube = new THREE.Mesh(cubegeometry, cubematerial);

	        cube.position.set(0, 0, -0.3);
		scene.add(cube);
       
        	var light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        	scene.add(light);

		// перевірка запуску та завершення сесії WebXR
		renderer.xr.addEventListener("sessionstart", (evt) => {
			console.log("Сесію WebXR розпочато");
		});

		renderer.xr.addEventListener("sessionend", (evt) => {
			console.log("Сесію WebXR завершено");
		});

		let currentSession = null; // ідентифікатор сеансу 

		// визначення функції start
		const start = async() => {
			// запит сеансу доповненої реальності	
			currentSession = await navigator.xr.requestSession("immersive-ar", {
				optionalFeatures: ["dom-overlay"],
				domOverlay: {root: document.body},
			});

			// повідомлення рушія Three.js про параметри використання WebXR
			renderer.xr.enabled = true;
      			renderer.xr.setReferenceSpaceType("local");
			await renderer.xr.setSession(currentSession);
			arButton.textContent = "Завершити сесію WebXR";

			renderer.setAnimationLoop(() => {
			    renderer.render(scene, camera);
			}); 
		
		}

   		// визначення функції end
		const end = async() => {
			currentSession.end(); // завершення сеансу
			renderer.setAnimationLoop(null);
			renderer.clear();
			arButton.style.display="none";
		}

		// натискання кнопки
		arButton.addEventListener("click", () => {
			if(currentSession) // завершити сеанс
				end();
			else // почати сеанс
				start();
		});
	}

	initialize(); // розпочати роботу
});

