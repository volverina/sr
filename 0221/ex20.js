import { MindARThree } from 'mindar-image-three';
import * as THREE from 'three';
import {CSS3DObject, CSS3DRenderer} from "three/addons/renderers/CSS3DRenderer.js";


document.addEventListener("DOMContentLoaded", () => {

	const start = async () => {

		//1. Ініціалізація MindAR
		const mindarThree = new MindARThree({
			container: document.body,
			imageTargetSrc: "../assets/fromilid_internet.mind",
		});

		const {renderer, cssRenderer, scene, cssScene, camera} = mindarThree;

		//2. Створення об'єкту CSS
		const obj = new CSS3DObject(document.querySelector("div#ar-div"));

		//3. Прив'язати створений об'єкт до цільового зображення (маркеру)
		const anchor = mindarThree.addCSSAnchor(0);
		anchor.group.add(obj);

      // 2. This code loads the IFrame Player API code asynchronously.
      var tag = document.createElement('script');

      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      // 3. This function creates an <iframe> (and YouTube player)
      //    after the API code downloads.
      var player;
      function onYouTubeIframeAPIReady() {
        player = new YT.Player('player', {
          height: '1000',
          width: '1000',
          videoId: 'I8F3OtWNY',
          playerVars: {
            'playsinline': 1
          },
          events: {
            'onReady': () => {         event.target.playVideo();
 }, //onPlayerReady,
//            'onStateChange': onPlayerStateChange
          }
        });
      }

      // 4. The API will call this function when the video player is ready.
/*
      function onPlayerReady(event) {
        event.target.playVideo();
      }
*/
      // 5. The API calls this function when the player's state changes.
      //    The function indicates that when playing a video (state=1),
      //    the player should play for six seconds and then stop.
/*
      var done = false;
      function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.PLAYING && !done) {
          setTimeout(stopVideo, 6000);
          done = true;
        }
      }
      function stopVideo() {
        player.stopVideo();
      }
 */

		//3a. Створення програвача Vimeo
   // 		var player = new Vimeo.Player(document.querySelector('iframe'));

		anchor.onTargetFound = () => {
			//play video
			//player.playVideo();
		}

		anchor.onTargetLost = () => {
			//pause video
			player.pauseVideo();
		}

/*
		player.setLoop(true).catch(() => {
			console.log("Помилка зациклювання відео");
		});


		player.on('play', function() {
			player.seekTo(0);
    		});
*/

		//4. Запуск MindAR 
		await mindarThree.start();

		//5. Цикл оновлення
		renderer.setAnimationLoop( () => {
			cssRenderer.render(cssScene, camera);
		});
	}

	start();
});
