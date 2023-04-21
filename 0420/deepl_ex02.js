import { MindARThree } from 'mindar-image-three';
import * as THREE from 'three';

import {loadGLTF} from "../js/loader.js"

document.addEventListener("DOMContentLoaded", () => {

	const start = async () => {

		//1. Ініціалізація MindAR
		const mindarThree = new MindARThree({
			container: document.body,
			imageTargetSrc: "../assets/fromilid_internet.mind",
			//uiLoading: "no", 
			//uiScanning: "no", 
		});

		const {renderer, scene, camera} = mindarThree;

		const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
		scene.add( light );

		const robot = await loadGLTF('../assets/RobotExpressive.glb');
		
		robot.scene.scale.set(0.2, 0.2, 0.2);
		robot.scene.position.set(0, 0, 0);

		//3. Прив'язати створений об'єкт до цільового зображення (маркеру)
		const anchor = mindarThree.addAnchor(0);
		anchor.group.add(robot.scene);
		//console.log(robot);

		const mixer = new THREE.AnimationMixer(robot.scene);

		const actionDance = mixer.clipAction(robot.animations[0]);		
		const actionDeath = mixer.clipAction(robot.animations[1]);		
		const actionIdle = mixer.clipAction(robot.animations[2]);		
		const actionJump = mixer.clipAction(robot.animations[3]);		
		const actionNo = mixer.clipAction(robot.animations[4]);		
		const actionPunch = mixer.clipAction(robot.animations[5]);		
		const actionRunning = mixer.clipAction(robot.animations[6]);		
		const actionSitting = mixer.clipAction(robot.animations[7]);		
		const actionStanding = mixer.clipAction(robot.animations[8]);		
		const actionThumbsUp = mixer.clipAction(robot.animations[9]);		
		const actionWalking = mixer.clipAction(robot.animations[10]);		
		const actionWalkJump = mixer.clipAction(robot.animations[11]);		
		const actionWave = mixer.clipAction(robot.animations[12]);		
		const actionYes = mixer.clipAction(robot.animations[13]);		


		const model = await handpose.load();

		const dieGesture = new fp.GestureDescription('die');

		for(let finger of [fp.Finger.Thumb, fp.Finger.Index, fp.Finger.Middle, fp.Finger.Ring, fp.Finger.Pinky]) {
			dieGesture.addCurl(finger, fp.FingerCurl.NoCurl, 1.0);
			dieGesture.addDirection(finger, fp.FingerDirection.HorizontalLeft, 1.0);
			dieGesture.addDirection(finger, fp.FingerDirection.HorizontalRight, 1.0);
		}

		const thumbsUpGesture = new fp.GestureDescription('thumbs_up');
		// do this for all other fingers
		for(let finger of [fp.Finger.Index, fp.Finger.Middle, fp.Finger.Ring, fp.Finger.Pinky]) {
			thumbsUpGesture.addCurl(finger, fp.FingerCurl.FullCurl, 1.0);
			thumbsUpGesture.addCurl(finger, fp.FingerCurl.HalfCurl, 0.9);
		}


		const GE = new fp.GestureEstimator([fp.Gestures.VictoryGesture, dieGesture, thumbsUpGesture]);
/*
		// add "✌🏻" and "👍" as sample gestures
		const GE = new fp.GestureEstimator([
		    fp.Gestures.VictoryGesture,
		    fp.Gestures.ThumbsUpGesture
		]);
*/

		//4. Запуск MindAR 
		await mindarThree.start();

		const timer = new THREE.Clock();

		//5. Цикл оновлення
		renderer.setAnimationLoop( () => {
			const delta = timer.getDelta();
			mixer.update(delta);
			renderer.render(scene, camera);
		});

		let actionActive = actionIdle;

		actionActive.play();

		const fadeToAction = (action, duration) => {
			if(action === actionActive)
				return;

			actionActive = action;
			actionActive.reset().fadeIn(duration).play();
		}

		mixer.addEventListener("finished", () => {
			fadeToAction(actionIdle, 0.2);
		});


		const video = mindarThree.video;

		let skipCount = 2, frameCount = 1;

		const detect = async () => {
			if(actionActive !== actionIdle)
			{
				window.requestAnimationFrame(detect);
				return;
			}

			if (frameCount % skipCount != 0)
			{
				frameCount++;
				window.requestAnimationFrame(detect);
				return;
			}

			const hands = await model.estimateHands(video);
			if(hands.length > 0)
			{
				// using a minimum match score of 8.5 (out of 10)
				//console.log("hands.landmarks:", hands[0].landmarks);
				const estimatedGestures = GE.estimate(hands[0].landmarks, 9);
				console.log("estimatedGestures:", estimatedGestures);
				if(estimatedGestures.gestures.length > 0)
				{
					console.log("gestures:", estimatedGestures.gestures);
					const best = estimatedGestures.gestures.sort((g1, g2) => g2.confidence-g1.confidence)[0];
					if(best.name === "thumbs_up")
						fadeToAction(actionThumbsUp, 0.5);
					else
						if(best.name === "die")
							fadeToAction(actionDie, 0.5);
						else
							if(best.name === "victory")
								fadeToAction(actionDance, 0.5);
				}
				//window.requestAnimationFrame(detect);
			}
			window.requestAnimationFrame(detect);
		}

		window.requestAnimationFrame(detect);
	}


	start();
});

