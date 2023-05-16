window.addEventListener("DOMContentLoaded", async () => {
    let webcam, labelContainer;

    // Load the model.
    let model = await mobilenet.load();

    // Convenience function to setup a webcam
    const flip = true; // whether to flip the webcam
    webcam = new tmImage.Webcam(640, 480, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // append elements to the DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");

    async function loop() {
        webcam.update(); // update the webcam frame
        await predict();
        window.requestAnimationFrame(loop);
    }

    let frameCount = 1;
    // run the webcam image through the image model
    async function predict() {
	frameCount++;
	if(frameCount % 5 === 0)
	{
		// predict can take in an image, video or canvas html element

	     	let predictions = await model.classify(webcam.canvas);
		if(predictions && predictions.length > 0)
		{
			labelContainer.innerHTML = "На зображенні ідентифіковані:<br>";
			for(let i=0;i<predictions.length;i++)
	      			//console.log(predictions);
				if(predictions[i]["probability"]>0.5)
					labelContainer.innerHTML += predictions[i]["className"] + " з ймовірністю " + 
						predictions[i]["probability"] + "<br>";
		}
	}
    }
});
