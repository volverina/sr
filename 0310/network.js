// функція створення нейронної мережі
// num_layers - кількість шарів нейронної мережі (0 - вхідний шар, num_layers-1 - вихідний шар)

var num_layers; // кількість шарів у мережі

var nn_layers; // кількість нейронів на кожному шарів

var W; // матриці вагових коефіцієнтів

var b; // масив вільних членів

var A; // значення кожного нейрону


// робота з матрицями

const make_matrix = (rows, columns, is_random) => {
  let arr = [];
  let value = 0;

  // creating two-dimensional array
  for (let i = 0; i < rows; i++) {
    arr[i] = [];
    for (let j = 0; j < columns; j++) {
	if(is_random)
      arr[i][j] = (Math.random()-0.5) * 0.01;
	else
      arr[i][j] = 0;
    }
  }
  //console.log(arr);
  return arr;
};



// 
function add(m1, m2)
{
	if(m1.length!==m2.length || m1[0].length!==m2[0].length)	
		return "Matrix addition is unable due to different sizes";
	var num_row = m1.length; 
	var num_col = m1[0].length;

	var result = make_matrix(num_row, num_col, true);

	for(let i=0; i<num_row; i++)
		for(let j=0; j<num_col; j++)
			result[i][j] = m1[i][j] + m2[i][j];
	return result;
}

const mul = (m1, m2) => {
  if(m1[0].length !== m2.length)
    return ("Матриці не є сумірними: множення неможливе");
  num_row=m1.length;
  num_col=m2[0].length;
  var result = make_matrix(num_row, num_col, false);
  for(let i=0;i<num_row;i++)
    for(let j=0;j<num_col;j++)
      for(let k=0;k<m2.length;k++)
        result[i][j]+=m1[i][k]*m2[k][j];
  return result;
}


// створення порожньої нейронної мережі
const create_network = ((layers) => {
	// перевірка на правильність заповнення масиву
	if(layers.length < 2)
	{
		console.log("Неможливо створити нейронну мережу менш ніж з двома шарами");
		return "";
	}

	num_layers = layers.length; // кількість шарів у мережі

	// перевірка на правильність розмірності шарів
	for(let i=0;i<layers.length;i++)
		if(!Number.isInteger(layers[i]) || layers[i]<1)
		{
			console.log("Кількість нейронів має бути додатним цілим числом");
			return "";
		}

	nn_layers = layers;
	// створення масиву масивів значень нейронів у мережі
	A = [];
	// створення матриць вагових коефіцієнтів
	W = [];
	// створення масиву вільних членів
	b = [];
	for(let i=0;i<num_layers-1;i++) // кількість матриць = кількість шарів - 1
	{
		num_row = layers[i+1];
		num_col = layers[i];
		W.push(make_matrix(num_row, num_col, true));
		b.push(make_matrix(num_row, 1, false));
	}
	for(let i=0;i<num_layers;i++) 
		A.push(make_matrix(layers[i], 1, false));
});


//логістична функція
const sigma = ((z) => {
	return 1/(1+Math.exp(-z));
});


const sigma_activation = ((Z) => {
	var result = Z;
	for(let i=0;i<Z.length;i++)
		for(let j=0;j<Z[0].length;j++)
			result[i][j] = sigma(Z[i][j]);
	return result;
});

// обчислення значень нейронів
function forward(X)
{
	// 
	if(X.length !== nn_layers[0])
		return "Bad input size";
	for(let i=0;i<X.length;i++)
		A[0][i][0] = X[i];
	/*
	var Z1 = add( mul(W[0], A[0]), b[0]);
	A[1] = activation(Z1);

	var Z2 = add( mul(W[1], A[1]), b[1]);
	A[2] = activation(Z2);
	*/
	for(let i=1; i<num_layers; i++)
	{
		var Z = add( mul(W[i-1], A[i-1]), b[i-1]);
		A[i] = sigma_activation(Z);
	}

	return A[num_layers-1];
}

create_network([16, 8, 3, 2, 1]);
///*
console.log("Кількість шарів - " + num_layers);
console.log("Нейрони у шарах: ");
console.log(nn_layers);
console.log("Матриці вагових коефіцієнтів: ");
console.log(W);
console.log("Масив вільних членів: ");
console.log(b);
//*/
//const X = [1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1];

const patterns = [ // масив об'єктів {x: масив, y: число}
 {x: [1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1], y:1},
 {x: [0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0], y:1},
 {x: [0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1], y:1},
 {x: [0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0], y:0},
 {x: [0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0], y:0},
 {x: [0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0], y:0},
];

for(let i=0;i<patterns.length;i++)
{
	var y_hat = forward(patterns[i].x);
	console.log("Для входу ", patterns[i].x, " отримали y_hat = ", y_hat[0][0], " за еталонного y = ", patterns[i].y);
}

//console.log("Значення у нейронах мережі: ");
//console.log(A);

//console.log("y: ");
//console.log(y);


/*

//функція визначення втрат для логістичної регресії
const Loss = function(y, y_hat)
{
	return -(y*Math.log(y_hat)+(1-y)*Math.log(1-y_hat));
}

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


// дані

const alpha=2; // швидкість навчання

const maxEpoch = 10000; // максимальна кількість ітерацій

const eps=0.00001; // точність (для збіжності процесу навчання)

const numPatterns = 6; // кількість образів

const sizeInput = 16; // кількість елементів у одному образі

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

*/
