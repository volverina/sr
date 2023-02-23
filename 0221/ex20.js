import { MindARThree } from 'mindar-image-three';
import * as THREE from 'three';
import {CSS3DObject, CSS3DRenderer} from "three/addons/renderers/CSS3DRenderer.js";

/*
https://www.youtube.com/watch?v=TFJ-fD6soE4
https://youtu.be/TFJ-fD6soE4
https://www.youtube.com/shorts/Aws2Id39JFU
https://youtube.com/shorts/Aws2Id39JFU?feature=share
*/

function getVideoId(url) {
	const urltypes = [
		"https://www.youtube.com/watch?v=", //0
		"https://www.youtube.com/shorts/",  //1
		"https://youtube.com/shorts/",      //2
		"https://youtu.be/"                 //3
	];
	
	var maybeId = false;

	for(var i=0; i<4; i++)
		if(url.startsWith(urltypes[i]))
			return url.substr(urltypes[i].length).substr(0, 11);
	return "";
}


function createYouTube(url, w, h) {

	return new Promise((resolve, reject) => {
		// 2. This code loads the IFrame Player API code asynchronously.
		var tag = document.createElement('script');
		tag.src = "https://www.youtube.com/iframe_api";
		var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

		// 3. This function creates an <iframe> (and YouTube player)
		//    after the API code downloads.
		function onYouTubeIframeAPIReady() {
			const player = new YT.Player('player', {
		  		videoId: getVideoId(url),
				playerVars: { 
					//'playsinline': 1 
				        'autoplay': 1,
					'controls': 0,
				},
				width: w,
				height: h,
				events: {
					'onReady': () => { resolve(player); }
		  		}
			});
		}	
		window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;			
        });
}



document.addEventListener("DOMContentLoaded", () => {

	const start = async () => {

      		//const player = await createYouTube("https://youtu.be/W4jRdyriODY", 1000, 1000*9/16);
      		const player = await createYouTube("https://youtu.be/W4jRdyriODY", 1000, 1000*9/16);
		player.seekTo(0);
		player.pauseVideo();

		//1. Ініціалізація MindAR
		const mindarThree = new MindARThree({
			container: document.body,
			imageTargetSrc: "../assets/fromilid_internet.mind",
		});

		const {renderer, cssRenderer, scene, cssScene, camera} = mindarThree;

		//2. Створення об'єкту CSS
		const obj = new CSS3DObject(document.querySelector("#ar-div"));

		//3. Прив'язати створений об'єкт до цільового зображення (маркеру)
		const anchor = mindarThree.addCSSAnchor(0);
		anchor.group.add(obj);

		anchor.onTargetFound = () => {
			player.playVideo();
		}

		anchor.onTargetLost = () => {
			player.pauseVideo();
		}

		//4. Запуск MindAR 
		await mindarThree.start();

		//5. Цикл оновлення
		renderer.setAnimationLoop( () => {
			cssRenderer.render(cssScene, camera);
		});
	}

	start();
});
