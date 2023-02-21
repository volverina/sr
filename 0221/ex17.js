import { MindARThree } from 'mindar-image-three';
import * as THREE from 'three';
import {loadVideo} from "../js/loader.js"

document.addEventListener("DOMContentLoaded", () => {

	var startButton;

	const start = async () => {

		//1. Ініціалізація MindAR
		const mindarThree = new MindARThree({
			container: document.body,
			imageTargetSrc: "../assets/fromilid_internet.mind",
		});

		//2. Щось намалювати
		const {renderer, scene, camera} = mindarThree;

		const video = await loadVideo('../assets/Moon on blue screen.mp4');

		const texture = new THREE.VideoTexture( video );

		const geometry = new THREE.PlaneGeometry( 1, video.videoHeight/video.videoWidth );
		//const material = new THREE.MeshBasicMaterial( {map: texture} );

		let myUniforms = {
			mytexture: {
				type: "t",
				value: texture
			},
			color: {
				type: "c",
				value: new THREE.Color(0x0000ff)
			}

		};


		const material = new THREE.ShaderMaterial( {
			uniforms: myUniforms,
			vertexShader: document.getElementById( 'vertexShader' ).textContent,
			fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
			transparent: true
		} );

		const plane = new THREE.Mesh( geometry, material );
		plane.position.y = 0.7;
		//plane.rotation.x = Math.PI / 2;
		plane.scale.multiplyScalar(4);

		//3. Прив'язати створений об'єкт до цільового зображення (маркеру)
		const anchor = mindarThree.addAnchor(0);
		anchor.group.add( plane );

		anchor.onTargetFound = () => {
			//console.log("Target Found");
			video.play();
		}

		anchor.onTargetLost = () => {
			//console.log("Target Lost");
			video.pause();
		}

		video.addEventListener("play", () => {
			//video.currentTime = 13;
		});


		//4. Запуск MindAR 
		await mindarThree.start();

		//5. Цикл оновлення
		renderer.setAnimationLoop( () => {
			renderer.render(scene, camera);
		});
	}

	start();
});
