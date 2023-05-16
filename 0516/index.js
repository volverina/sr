let mobilenet, model, dataset;
let isPredicting = false;

const webcam = new Webcam(document.getElementById('wc'));

async function init()
{
	await webcam.setup();
	mobilenet = await loadMobilenet();
	dataset = new RPSDataset();
}

init();

async function loadMobilenet() {
	const mobilenet = await tf.loadLayersModel('imagenet_v1_025_224_layers/model.json');
	const layer = mobilenet.getLayer('conv_pw_13_relu');
	//console.log(mobilenet);
	//console.log(layer);
	return tf.model({inputs: mobilenet.inputs, outputs: layer.output});
	//mobilenet.summary();
}

async function train() {
	dataset.ys = null;
	dataset.encodeLabels(3);
	model = tf.sequential({
		layers: [
			tf.layers.flatten({inputShape: mobilenet.outputs[0].shape.slice(1)}),
			tf.layers.dense({ units: 100, activation: 'relu'}),
			tf.layers.dense({ units: 3, activation: 'softmax'})
		]
	});
	const optimizer = tf.train.adam(0.0001);
	model.compile({optimizer: optimizer, loss: 'categoricalCrossentropy'});
	let loss = 0;
	model.fit(dataset.xs, dataset.ys, {
		epochs: 10,
		callbacks: {
			onBatchEnd: async (batch, logs) => {
				loss = logs.loss.toFixed(5);
				console.log('LOSS: ' + loss);
			}
		}
	});
}

let rockSamples =0, paperSamples=0, scissorsSamples=0;

function handleButton(elem){
	switch(elem.id){
		case "0":
			rockSamples++;
			document.getElementById("rocksamples").innerText = "Rock samples:" + rockSamples;
		break;
		case "1":
			paperSamples++;
			document.getElementById("papersamples").innerText = "Paper samples:" + paperSamples;
		break;
		case "2":
			scissorsSamples++;
			document.getElementById("scissorssamples").innerText = "Scissors samples:" + scissorsSamples;
		break;
	}
	label = parseInt(elem.id);
	const img = webcam.capture();
	dataset.addExample(mobilenet.predict(img), label);
}


async function doTraining()
{
	await train();
}

function startPredicting(){
	isPredicting = true;
	predict();
}


function stopPredicting(){
	isPredicting = false;
	predict();
}


async function predict() {
	while (isPredicting) {
		//tf.tidy(() => mobilenet.predict(webcam.capture()));
		// Step 1: Get Prediciton
		// Step 2: Evaluate Prediction and Update UI
		// Step 3: Cleanup
		const predictedClass = tf.tidy( () => {
			let img = webcam.capture();
			const embeddings = mobilenet.predict(img);
			const predictions = model.predict(embeddings);
			console.log(predictions);
			return predictions.as1D().argMax();
		});
		const classId = (await predictedClass.data())[0];
		var predictionText = "";
		switch(classId){
			case 0:
				predictionText = "I see Rock";
				break;
			case 1:
				predictionText = "I see Paper";
				break;
			case 2:
				predictionText = "I see Scissors";
				break;
		}
		document.getElementById("prediction").innerText = predictionText;
		predictedClass.dispose();
		await tf.nextFrame();
	}
	window.requestAnimationFrame(predict);
}


window.requestAnimationFrame(predict);

