//import * as tf from '@tensorflow/tfjs';


import { MindARThree } from 'mindar-image-three';
//window.MINDAR.IMAGE.tf = tf;
//window.tf = window.MINDAR.IMAGE.tf;
import * as THREE from 'three';


document.addEventListener("DOMContentLoaded", () => {

	const start = async () => {

		//1. Ініціалізація MindAR
		const mindarThree = new MindARThree({
			container: document.body,
			imageTargetSrc: "../assets/fromilid_internet.mind",
			uiLoading: "no", 
			uiScanning: "no", 
		});

		const {renderer, scene, camera} = mindarThree;

		const geometry = new THREE.PlaneGeometry( 1, 1 );
		const material = new THREE.MeshBasicMaterial( {
			color: 0x00ffff, 
			transparent: true,
			opacity: 0.5
		} );
		const plane = new THREE.Mesh( geometry, material );

		//3. Прив'язати створений об'єкт до цільового зображення (маркеру)
		const anchor = mindarThree.addAnchor(0);
		anchor.group.add(plane);

		const model = handPoseDetection.SupportedModels.MediaPipeHands;
		const detectorConfig = {
			runtime: 'mediapipe', // or 'tfjs',
			solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands',
			modelType: 'lite', //full
			maxHands: 2,
		}
		const detector = await handPoseDetection.createDetector(model, detectorConfig);
		
		//console.log(detector);

		//4. Запуск MindAR 
		await mindarThree.start();

		//5. Цикл оновлення
		renderer.setAnimationLoop( () => {
			renderer.render(scene, camera);
		});

		const video = mindarThree.video;

		let skipCount = 5, frameCount = 1;

		let leftHand = document.getElementById("left");
		let rightHand = document.getElementById("right");

		const detect = async () => {
			if (frameCount % skipCount == 0)
			{
				const hands = await detector.estimateHands(video);
				if(hands.length == 0)
				{
					leftHand.innerHTML = "";
					rightHand.innerHTML = "";
				}
				if(hands.length == 1)
				{
					if(hands[0].handedness=="Left")
					{
						leftHand.innerHTML = "Піднято ліву руку<br>" + finger(hands[0].keypoints);
						rightHand.innerHTML = "";
					}
					else
					{
						rightHand.innerHTML = "Піднято праву руку<br>" + finger(hands[0].keypoints);
						leftHand.innerHTML = "";
					}
				}
				if(hands.length == 2)
				{
					for (let h=0;h<2;h++)
						if(hands[h].handedness=="Left")
							leftHand.innerHTML = "Піднято ліву руку<br>" + finger(hands[h].keypoints);
						else
							rightHand.innerHTML = "Піднято праву руку<br>" + finger(hands[h].keypoints);
				}
			}
			frameCount++;
			window.requestAnimationFrame(detect);
		}

		window.requestAnimationFrame(detect);

	}

	
	const distance = (a, b) => {
		return Math.round(Math.sqrt((a[0]-b[0])*(a[0]-b[0]) + (a[1]-b[1])*(a[1]-b[1])));
	}

	const finger = (keypoints) => {
		let res= "";

		const fingers = ["великий", "вказівний", "середній", "підмізинний", "мізинець"];

		for(let i=0;i<fingers.length;i++)
		{
			let coords = [];
			res+="<br>" + fingers[i] + " палець: [";
			for(let p=0;p<4;p++)
			{
				res+=  "(" + Math.round(keypoints[i*4+p+1].x) + ", " + Math.round(keypoints[i*4+p+1].y) + ")";
				coords.push([keypoints[i*4+p+1].x, keypoints[i*4+p+1].y]);
			}
			res+= "]";
			let d12 = distance(coords[0], coords[1]);
			let d13 = distance(coords[0], coords[2]);
			let d14 = distance(coords[0], coords[3]);
			let d23 = distance(coords[1], coords[2]);
			let d24 = distance(coords[1], coords[3]);
			let d34 = distance(coords[2], coords[3]);
			res+=", відстані = 1-2: "+d12+", 1-3: "+d13+", 1-4: "+d14+", 2-3: "+d23+", 2-4: "+d24+", 3-4: "+d34;
			if(d13+d34>d14)
				res+=", зігнуто";
			else
				res+=", не зігнуто";
		}

		return res;
	}


	start();
});

