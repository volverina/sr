// z = w*x+b - обчислення скалярного добутку
function getZ(x, w, b)
{
	if(x.length != w.length)
	{
		console.log("Розмірності векторів не співпадають");
		return "";
	}
	let result = 0;
	for (let i = 0; i < w.length; i++) 
		result += w[i]*x[i];
	result += b;
	return result;
}

//функція визначення втрат для логістичної регресії
const Loss = function(y, y_hat)
{
	return -(y*Math.log(y_hat)+(1-y)*Math.log(1-y_hat));
}

//логістична функція
const sigma = ((z) => {
	return 1/(1+Math.exp(-z));
});

//обчислення похідних
function newdwdb(dw, db, x, dz)
{
	for (let i = 0; i < x.length; i++) 
		dw[i] += x[i]*dz;
	db += dz;
	return [dw, db];
}


//логістична регресія
function logistic_regression(patterns, alpha, maxEpoch, eps, output)
{
	const numPatterns = patterns.length; // кількість образів

	const sizeInput = patterns[0].x.length; // кількість елементів у одному образі

	var w=Array(sizeInput), // масив вагових коефіцієнтів
		dw=Array(sizeInput); // масив похідних за ваговими коефіцієнтами

	for (let i = 0; i < w.length; i++) 
		w[i] = 0, dw[i] = 0; // встановлення початкового значення у 0

	var b = 0, // вільний член
		db = 0; // похідна за вільним членом

	let J_prev = 1e6;

	var epoch = 1;

	for(; epoch <= maxEpoch; epoch++) // кроки навчання
	{
		let J = 0; // значення функції вартості

		for (let i = 0; i < numPatterns; i++) // за кількістю шаблонів
		{
			let z = getZ(patterns[i].x, w, b); // лінійна комбінація
			let a = sigma(z);                  // логістична функція
			var l = Loss(patterns[i].y, a);    // визначення втрат
			J += l;				   // визначення вартості (помилки)
			var dz = a - patterns[i].y;	   // відхилення y - y_hat
			var res = newdwdb(dw, db, patterns[i].x, dz);
			dw = res[0], db = res[1];          // визначення похідних
		}

		J /= numPatterns; // середня помилка

		// середні значення похідних
		for (let i = 0; i < dw.length; i++) 
			dw[i] /= numPatterns;
		db /= numPatterns;

		// модифікація вагових коефіцієнтів та вільного члену
		for (let i = 0; i < w.length; i++) 
			w[i] -= alpha*dw[i];
		b -= alpha*db;

		if(output)
		{
			console.log("На кроці " + epoch +" J = " + J);
			console.log("w = ", w);
			console.log("b = ", b);
		}

		if(Math.abs(J_prev - J) < eps)
			break;
		J_prev = J;
	}

	return [w, b, J_prev, epoch];
}

// обчислити значення 
function predict(x, w, b)
{
	let z = getZ(x, w, b); // лінійна комбінація
	let a = sigma(z);                  // логістична функція
	return a;
}


// дані

const alpha=2; // швидкість навчання

const maxEpoch = 10000; // максимальна кількість ітерацій

const eps=0.00001; // точність (для збіжності процесу навчання)

const numPatterns = 6; // кількість образів

const sizeInput = 16; // кількість елементів у одному образі

const patterns = [ // масив об'єктів {x: масив, y: число}
 {x: [1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1], y:1},
 {x: [0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0], y:1},
 {x: [0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1], y:1},
 {x: [0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0], y:0},
 {x: [0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0], y:0},
 {x: [0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0], y:0},
];

let res = logistic_regression(patterns, alpha, maxEpoch, eps, false);
let w = res[0], b = res[1], J = res[2], epoch = res[3];

console.log("Зроблено " + epoch +" кроків, помилка J = " + J);
console.log("w = ", w);
console.log("b = ", b);

for(let i = 0; i < patterns.length; i++)
{
	let y_hat = predict(patterns[i].x, w, b);
	console.log("Для образу ", patterns[i].x, " еталонний y = ", patterns[i].y, ", а обчислений = ", y_hat);
}

let X = [
	0, 0, 0, 0,
	0, 0, 0, 0,
	0, 0, 0, 0,
	0, 0, 0, 0
];

document.addEventListener("DOMContentLoaded", () => {

	let button = document.querySelector("#count");
	button.addEventListener("click", () => {
		let y_hat = predict(X, w, b);
		let str = "класифіковано як ";
		if(y_hat >= 0.5)
			str += "літеру П з ймовірністю " + y_hat;
		else
			str += "квадрат з ймовірністю " + (1-y_hat);
		
//		console.log(str);
		const div = document.getElementById("text");
		div.innerHTML = str;
	});

	for(let i=0; i<16; i++)
	{
		let cb = document.getElementById(i+"");
//		console.log(i);
//		console.log(cb);
		cb.addEventListener('click', () => {
			if (X[i] == 0) 
				X[i] = 1;
			else 
				X[i] = 0;
//			console.log(X);
		});
	}

});

