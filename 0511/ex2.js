//import * as tf from 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.5.0';

addEventListener("DOMContentLoaded", () => {
	async function run() {
		const csvUrl = 'iris.csv';
		const trainingData = tf.data.csv(csvUrl, {
			columnConfigs: {
				species: {
					isLabel: true
				}
			}
		});

		const convertedData =
			trainingData.map(({xs, ys}) => {
				const labels = [
					ys.species == "setosa" ? 1 : 0,
					ys.species == "versicolor" ? 1 : 0,
					ys.species == "virginica" ? 1 : 0
				]
				return{ xs: Object.values(xs), ys:Object.values(labels)};
			}).batch(10);


		const model = tf.sequential();
		model.add(tf.layers.dense({inputShape: [4], activation: "sigmoid", units: 5}))
		//model.add(tf.layers.dense({activation: "sigmoid", units: 6}))
		model.add(tf.layers.dense({activation: "softmax", units: 3}));

		model.compile({loss: "categoricalCrossentropy", optimizer: tf.train.adam(0.06)});

		await model.fitDataset(convertedData, {
			epochs:200,
			callbacks:{
				onEpochEnd: async(epoch, logs) =>{
					console.log("Epoch: " + epoch + " Loss: " + logs.loss);
				}
			}
		});


		const testVal = tf.tensor2d([6.2, 2.8, 4.8, 1.8], [1, 4]);
		const prediction = model.predict(testVal);

            	const pIndex = tf.argMax(prediction, axis=1).dataSync();
            
            	const classNames = ["Setosa", "Versicolor", "Virginica"];
            
            	// alert(prediction)
            	alert(prediction);
            	alert(classNames[pIndex]);

	}

	run();
});


/*

model.compile({loss:'meanSquaredError', optimizer:'sgd'});

model.summary();

const xs = tf.tensor2d([-1.0, 0.0, 1.0, 2.0, 3.0, 4.0], [6, 1]);

const ys = tf.tensor2d([-3.0, -1.0, 2.0, 3.0, 5.0, 7.0], [6, 1]);


doTraining(model).then(() => {
	alert(model.predict(tf.tensor2d([10], [1,1])));
});

console.log(model);

async function doTraining(model){
	const history =
		await model.fit(xs, ys, { 
				epochs: 500,
				callbacks:{
					onEpochEnd: async (epoch, logs) =>{
						console.log("Epoch:" + epoch + " Loss:" + logs.loss);
				}
			}
		});
}
*/
