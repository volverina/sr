import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";

import * as THREE from 'three';

export const loadGLTF = (path) => {
	return new Promise( (resolve, reject) => {
		const loader = new GLTFLoader();
		loader.load(path, (gltf) => {
			resolve(gltf);
		}),
		(xhr) => {
			console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded from '+ path );
		},
		(error) => {
			reject(error);
		}
	});
}


export const loadAudio = (path) => {
	return new Promise( (resolve, reject) => {
		const loader = new THREE.AudioLoader();
		loader.load(path, (gltf) => {
			resolve(gltf);
		});
	});
}


export const loadVideo = (path) => {
	return new Promise( (resolve, reject) => {
		const video = document.createElement("video");
		video.addEventListener("loadeddata", () => {
			video.setAttribute("playsinline", "");
			resolve(video);
		});
		video.src = path;
	});
}



