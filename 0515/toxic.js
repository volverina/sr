let isModelLoaded = false, model = null;


window.addEventListener("DOMContentLoaded", async () => {
	const threshold = 0.9;

	document.getElementById("buttonGetToxicValue").addEventListener("click", getToxicValue);

	model = await toxicity.load(threshold);
	isModelLoaded = true;

});



let getToxicValue = async () => {

	let textResult = document.getElementById("result");
	let textSource = document.getElementById("sentence");
	const sentences = [textSource.value];

	if(isModelLoaded)
	{
		let predictions = await (model.classify(sentences));
		if(predictions && predictions.length > 0)
		{
			// Handle Results
			//console.log(predictions);
			//textResult.innerHTML = "it is work";
			textResult.innerHTML = "Результат роботи моделі:<br>";
			for(let i=0;i<predictions.length;i++)
				textResult.innerHTML += predictions[i].label + //" - " + predictions[i].results[0].match + 
					" із ймовірністю " + predictions[i].results[0].probabilities[1] + "<br>";

		}
	}
	else
		textResult.innerHTML = "Model of text' toxicity is loaded just now, try again later";
}

