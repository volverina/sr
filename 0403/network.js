// функція створення нейронної мережі
// num_layers - кількість шарів нейронної мережі (0 - вхідний шар, num_layers-1 - вихідний шар)

var num_layers; // кількість шарів у мережі

// модель нейронної мережі: nn_layers, W, b

var nn_layers; // кількість нейронів на кожному шарі

var W; // матриці вагових коефіцієнтів

var b; // масив вільних членів

var A; // значення кожного нейрону



// робота з матрицями

// створення матриці с rows рядків, columns стовпців та заповненою випадковими числами, якшо is_random встановлене, а інакше - 0
const make_matrix = (rows, columns, is_random) => {
  let arr = [];

  // creating two-dimensional array
  for (let i = 0; i < rows; i++) {
    arr[i] = [];
    for (let j = 0; j < columns; j++) {
	if(is_random)
      arr[i][j] = (Math.random()-0.5) * 0.01; // для подолання ефекту лінійності
	else
      arr[i][j] = 0;
    }
  }
  return arr;
};



// додавання матриць
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

// множення матриць
const mul = (m1, m2) => {
  if(m1[0].length !== m2.length)
    return ("Матриці не є сумірними: множення неможливе");
  var num_row=m1.length;
  var num_col=m2[0].length;
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
		console_log.innerHTML +=  ("Неможливо створити нейронну мережу менш ніж з двома шарами");
		return "";
	}

	num_layers = layers.length; // кількість шарів у мережі

	// перевірка на правильність розмірності шарів
	for(let i=0;i<layers.length;i++)
		if(!Number.isInteger(layers[i]) || layers[i]<1)
		{
			console_log.innerHTML +=  ("Кількість нейронів має бути додатним цілим числом");
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
		var num_row = layers[i+1];
		var num_col = layers[i];
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


// виконання активації для вектора Z
const sigma_activation = ((Z) => {
	var result = Z;
	for(let i=0;i<Z.length;i++)
		for(let j=0;j<Z[0].length;j++)
			result[i][j] = sigma(Z[i][j]);
	return result;
});


// обчислення значень нейронів
function forward(X) // predict
{
	// перевірка розмірність
	if(X.length !== nn_layers[0])
		return "Bad input size";
	// перший шар нейронів - вхід
	for(let i=0;i<X.length;i++)
		A[0][i][0] = X[i];
	// обчислення шарів, розпочинаючи з першого прихованого
	for(let i=1; i<num_layers; i++)
	{
		var Z = add( mul(W[i-1], A[i-1]), b[i-1]); // лінійна комбінація
		A[i] = sigma_activation(Z); // активація вектора (матриця з 1 стовпцем)
	}

	return A[num_layers-1];
}


// функція визначення втрат для логістичної регресії
const Loss = function(y, y_hat)
{
	let result = 0;
	if(Array.isArray(y))
		for(let i=0; i<y.length; i++)
			result += -(y[i]*Math.log(y_hat[i])+(1-y[i])*Math.log(1-y_hat[i]));
	else
		result = -(y*Math.log(y_hat)+(1-y)*Math.log(1-y_hat));
	return result;
}

// функція вартості
const func_J = (patterns) => {
	let J = 0; // значення функції вартості

	const numPatterns = patterns.length; // кількість образів

	for(let i=0;i<numPatterns;i++)
	{
		var y_hat = forward(patterns[i].x);
		var l = Loss(patterns[i].y, y_hat);    // визначення втрат
		J += l;				   // визначення вартості (помилки)
	}

	J /= numPatterns; // середня помилка
	return J;
}


// "глибоке" копіювання
function deepCopy(obj) {
  if (typeof obj === 'object') {
    if (Array.isArray(obj)) {
      var l = obj.length;
      var r = new Array(l);
      for (var i = 0; i < l; i++) {
        r[i] = deepCopy(obj[i]);
      }
      return r;
    } else {
      var r = {};
      r.prototype = obj.prototype;
      for (var k in obj) {
        r[k] = deepCopy(obj[k]);
      }
      return r;
    }
  }
  return obj;
}


// спроба покращити навченість мережі на образах patterns із швидкістю alpha (стала навчання)
function f_attempt(patterns, alpha)
{
	// зберігаємо копію масивів вільних членів та вагових коефіцієнтів
	let b_old = deepCopy(b);
	let W_old = deepCopy(W);

	let old_J = func_J(patterns); // обчислюємо початкове значення помилки

	// у випадковий спосіб змінити значення масивів вільних членів та вагових коефіцієнтів
	for(let i=0;i<W.length;i++)
		for(let j=0;j<W[i].length;j++)
			for(let k=0;k<W[i][j].length;k++)
				W[i][j][k] += (Math.random()-0.5) * alpha;
	for(let i=0;i<b.length;i++)
		for(let j=0;j<b[i].length;j++)
			for(let k=0;k<b[i][j].length;k++)
				b[i][j][k] += (Math.random()-0.5) * alpha;

	// обчислюємо значення помилки після "навчання"
	let new_J = func_J(patterns);
	
	if(new_J < old_J) // якщо помилка стала менше
		return [true, new_J]; // повертаємо значення true як ознаку успішного навчання та new_J - нове значення помилки
	else
	{
		W = deepCopy(W_old); // повертаємо значення масивів вільних членів та вагових коефіцієнтів
		b = deepCopy(b_old); // до збереження через невдачу у навчанні
		return [false, old_J];  // повертаємо значення false як ознаку неуспішного навчання та old_J - старе значення помилки
	}
}


// навчання мережі методом Монте-Карло
// patterns - образи, на яких відбувається навчання
// alpha - швидкість навчання
// max_epoch - гранична кількість спроб навчання
// epsilon - бажана точність навчання
const train_random = (patterns, alpha, max_epoch, epsilon) => {
	let new_J = epsilon+1;
	
	for(let epoch = 0; epoch < max_epoch; epoch++) // ітерації спроб навчання
	{
		for(let attempt = 0; attempt<10; attempt++) // до 10 спроб зміни
		{
			let res = f_attempt(patterns, alpha); // спроба
			if(res[0]) // за успішної спроби
			{
				new_J = res[1];
				console_log.innerHTML +=  ("На кроці " + epoch +" J = " + new_J);
				break;
			}
		}
		if(new_J<epsilon) // при досягненні точності
			break;
	}	
	return new_J;
}


	const patterns = [ // масив об'єктів {x: масив, y: число}
	 {x: [1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1], y:1},
	 {x: [0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0], y:1},
	 {x: [0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1], y:1},
	 {x: [0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0], y:0},
	 {x: [0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0], y:0},
	 {x: [0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0], y:0},
	];


// створити та навчити нейронну мережу
const main = () => {
	create_network([16, 2, 1]); // створення тришарової мережі: на вході - 16, у прихованому шарі - 2, на виході - 1
	// виведення архітектури мережі: ч. 1
	console_log.innerHTML += "<p>" + ("Кількість шарів - " + num_layers);
	console_log.innerHTML += "<p>" +  "Нейрони у шарах: " + (nn_layers) + "<p>";

	const numPatterns = patterns.length; // кількість образів

	let J = 0; // значення функції вартості

	// навчання методом Монте-Карло на patterns з швидкістю 0.1, не більше ніж за 1000 ітерацій та з граничною точністю 0.000001
	let J_after = train_random(patterns, 0.1, 1000, 0.000001);

	// тестування навченості
	for(let i=0;i<numPatterns;i++)
	{
		var y_hat = forward(patterns[i].x); // визначаємо передбачуване значення y_hat
		console_log.innerHTML += "<p>" +  ("Для входу " + patterns[i].x + " отримали y_hat = " + y_hat[0][0] + " за еталонного y = " + patterns[i].y);
	}

	console_log.innerHTML += "<p>" +  ("J = " + J_after); // результуюча помилка

	// виведення архітектури мережі: ч. 2 (після навчання)
	console_log.innerHTML += "<p>" +  ("Матриці вагових коефіцієнтів: ");
	console_log.innerHTML += "<p>" +  (W);
	console_log.innerHTML += "<p>" +  ("Масив вільних членів: ");
	console_log.innerHTML +=  (b);

}


// Х містить 0, якщо елемент не обрано, та 1, якщо обрано

let X = [
	0, 0, 0, 0,
	0, 0, 0, 0,
	0, 0, 0, 0,
	0, 0, 0, 0
];


// по завантаженні документа
document.addEventListener("DOMContentLoaded", () => {

	let button = document.querySelector("#count"); // кнопка для обчислення результату за уведеними користувачем даними

	let start = document.getElementById("start"); // кнопка для навчання мережі

	console_log = document.getElementById("log");

	start.addEventListener("click", main); // main виконується по натисканню кнопки "start"

	button.addEventListener("click", () => { //  виконується по натисканню кнопки "count"
		let y_hat = forward(X); // обчислити значення
		//console_log.innerHTML +=  (y_hat); 
		let str = "класифіковано як ";
		if(y_hat >= 0.5)
			str += "літеру П з ймовірністю " + y_hat;
		else
			str += "квадрат з ймовірністю " + (1-y_hat);
		
		const div = document.getElementById("text");
		div.innerHTML = str;
	});


	document.getElementById("download").addEventListener("click", () => { //  виконується по натисканню кнопки "download"
		// модель
		var model = {
			model_layers: nn_layers,
			model_weights: [W, b]
		};
		
		var str = JSON.stringify(model);

		const link = document.createElement("a");
		link.download = "model.json";
		link.href = URL.createObjectURL(new Blob([str]));
		link.click();
	});




	//  опрацювання натискання на елементи вибору 
	for(let i=0; i<16; i++)
	{
		let cb = document.getElementById(i+"");
		cb.addEventListener('click', () => {
			if (X[i] == 0) 
				X[i] = 1;
			else 
				X[i] = 0;
		});
	}

});



/*

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
			console_log.innerHTML +=  ("На кроці " + epoch +" J = " + J);
			console_log.innerHTML +=  ("w = ", w);
			console_log.innerHTML +=  ("b = ", b);
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

console_log.innerHTML +=  ("Зроблено " + epoch +" кроків, помилка J = " + J);
console_log.innerHTML +=  ("w = ", w);
console_log.innerHTML +=  ("b = ", b);

for(let i = 0; i < patterns.length; i++)
{
	let y_hat = predict(patterns[i].x, w, b);
	console_log.innerHTML +=  ("Для образу ", patterns[i].x, " еталонний y = ", patterns[i].y, ", а обчислений = ", y_hat);
}


*/
