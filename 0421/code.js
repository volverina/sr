import * as THREE from 'three';
import { MindARThree } from "mindar-face-three";
import * as faceapi from 'faceapi';
import {loadTexture} from 'loader';


document.addEventListener("DOMContentLoaded", () => {

	const start = async () => {

		const optionsTinyFace = new faceapi.TinyFaceDetectorOptions({inputSize: 128, scoreThreshold: 0.3}); //inst 128 can be 416

/*
nets: {
    ageGenderNet: AgeGenderNet;
    faceExpressionNet: FaceExpressionNet;
    faceLandmark68Net: FaceLandmark68Net;
    faceLandmark68TinyNet: FaceLandmark68TinyNet;
    faceRecognitionNet: FaceRecognitionNet;
    ssdMobilenetv1: SsdMobilenetv1;
    tinyFaceDetector: TinyFaceDetector;
    tinyYolov2: TinyYolov2;
}
*/
		await faceapi.nets.tinyFaceDetector.load('../assets/faceapi_model');
		await faceapi.nets.faceLandmark68Net.load('../assets/faceapi_model');
		await faceapi.nets.faceExpressionNet.load('../assets/faceapi_model');

		const mindarThree = new MindARThree({
			container: document.body,
			filterMinCF: 0.001,
			filterBeta: 10,
		});

		const { renderer, scene, camera } = mindarThree;

		const textures = {};
		textures['neutral'] = await loadTexture("../assets/neutral-face_1f610.png");   
		textures['happy'] = await loadTexture("../assets/hugging-face_1f917.png");   
		textures['sad'] = await loadTexture("../assets/worried-face_1f61f.png");   
		textures['angry'] = await loadTexture("../assets/angry-face_1f620.png");   
		textures['disgusted'] = await loadTexture("../assets/png-transparent-face-smiley-disgusted-face-emoticon-orange-sadness-disgusted-face-emoticon.png");   
		textures['surprised'] = await loadTexture("../assets/hushed-face_1f62f.png");   
		textures['fearful'] = await loadTexture("../assets/face-screaming-in-fear_1f631.png");   

		const expressions = ['neutral', 'happy', 'sad', 'angry', 'disgusted', 'surprised', 'fearful'];
		let oldExpression = 'neutral', newExpression = 'neutral';

		const anchor = mindarThree.addAnchor(10);
		const geometry = new THREE.PlaneGeometry(1, 1); 
		const material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, map: textures['neutral']});
		
		const plane = new THREE.Mesh(geometry, material);
		anchor.group.add(plane);

		await mindarThree.start();

		renderer.setAnimationLoop(() => {
        		renderer.render(scene, camera);
		});

		const video = mindarThree.video;

		const detect = async () => {
			const results = await faceapi.detectSingleFace(video, optionsTinyFace).withFaceLandmarks().withFaceExpressions();
			if(results && results.expressions)
			{

				for(let i=0;i<expressions.length;i++)
				{
					if(results.expressions[expressions[i]] > 0.5)
						newExpression = expressions[i];
				}

				if(newExpression !== oldExpression)
				{
					oldExpression = newExpression;
					material.map = textures[newExpression];
					material.needsUpdate = true;
				}
			}
			window.requestAnimationFrame(detect);
		}

		window.requestAnimationFrame(detect);
	}

	start();
});

