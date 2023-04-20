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
						let res = finger(hands[0].keypoints);
						let what = get_gesture(res);
						leftHand.innerHTML = "Піднято ліву руку<br>" + what;
						rightHand.innerHTML = "";
					}
					else
					{
						let res = finger(hands[0].keypoints);
						let what = get_gesture(res);
						rightHand.innerHTML = "Піднято праву руку<br>" + what;
						leftHand.innerHTML = "";
					}
				}
/*
				if(hands.length == 2)
				{
					for (let h=0;h<2;h++)
						if(hands[h].handedness=="Left")
							leftHand.innerHTML = "Піднято ліву руку<br>" + finger(hands[h].keypoints);
						else
							rightHand.innerHTML = "Піднято праву руку<br>" + finger(hands[h].keypoints);
				}
*/
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
		let res= [];

		const fingers = ["великий", "вказівний", "середній", "підмізинний", "мізинець"];
		let fin_len_coord = [];


		for(let i=0;i<fingers.length;i++)
		{
/*
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
			res+=", відстані = 1-2: "+d12+", 2-3: "+d23+", 3-4: "+d34+", 1-4: "+d34+", % = "+Math.round(100*d14 / (d12+d23+d34));
			//if(d13+d34>d14)
			//	res+=", зігнуто";
			//else
			//	res+=", не зігнуто";
			*/
			let coords = [];
			for(let p=0;p<4;p++)
				coords.push([keypoints[i*4+p+1].x, keypoints[i*4+p+1].y]);
			let d12 = distance(coords[0], coords[1]);
			let d14 = distance(coords[0], coords[3]);
			let d23 = distance(coords[1], coords[2]);
			let d34 = distance(coords[2], coords[3]);

			let direction = "донизу";
			if(coords[3][1] < coords[0][1])
				direction = "вгору";
			let percent = Math.round(100*d14 / (d12+d23+d34));
			if (percent > 95) // прямий
				res.push([fingers[i], "прямий", direction]);
			else
				if (percent < 70) // зігнутий
					res.push([fingers[i], "зігнутий", direction]);
				else
					res.push([fingers[i], "напівзігнутий", direction]);

			fin_len_coord.push([d14, coords[0], coords[3]]);
		}

		let angles = [];
		for(let i=0;i<fin_len_coord.length-1;i++)
		{
			let fin1_start_x = fin_len_coord[i][1][0],
			 fin1_start_y = fin_len_coord[i][1][1],
			 fin1_end_x = fin_len_coord[i][2][0],
			 fin1_end_y = fin_len_coord[i][2][1],

			 fin2_start_x = fin_len_coord[i+1][1][0], 
			 fin2_start_y = fin_len_coord[i+1][1][1],
			 fin2_end_x = fin_len_coord[i+1][2][0],
			 fin2_end_y = fin_len_coord[i+1][2][1];

			let f1x = fin1_end_x-fin1_start_x, f1y = fin1_end_y-fin1_start_y;
			let f2x = fin2_end_x-fin2_start_x, f2y = fin2_end_y-fin2_start_y;

			angles.push(Math.round(Math.acos( (f1x * f2x + f1y * f2y) / (fin_len_coord[i][0] * fin_len_coord[i+1][0])) * 180 / Math.PI));
		}

		return [res, angles];
	}


	function get_gesture(fin) {
		const fingers = ["великий", "вказівний", "середній", "підмізинний", "мізинець"];

		//лайк чи дизлайк: великий палець прямий, інші - непрямі
		if(fin[0][0][1]==="прямий" && fin[0][1][1]!=="прямий" && fin[0][2][1]!=="прямий" && fin[0][3][1]!=="прямий" && fin[0][4][1]!=="прямий")
			if(fin[0][0][2]==="вгору")
				return "вподобаємо";
			else
				return "не вподобаємо";
		
		//console.log(fin);
		//перемога: вказівний та середній прямі, інші - непрямі, кут - 15 градусів
		if(fin[0][0][1]!=="прямий" && 
			fin[0][1][1]==="прямий" && fin[0][1][2]==="вгору" &&
			fin[0][2][1]==="прямий" && fin[0][2][2]==="вгору" &&
			fin[0][3][1]!=="прямий" && 
			fin[0][4][1]!=="прямий" && 
			fin[1][1]>=15)
			return "перемога";

		
		return "жест не розпізнано";
	}


	start();
});

