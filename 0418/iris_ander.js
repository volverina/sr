// функція створення нейронної мережі
// num_layers - кількість шарів нейронної мережі (0 - вхідний шар, num_layers-1 - вихідний шар)

var num_layers; // кількість шарів у мережі

// модель нейронної мережі: nn_layers, W, b

var nn_layers; // кількість нейронів на кожному шарі

var F; // масив імен функцій активації та похідних для кожного шару

var g; // масив функцій активації для кожного шару

var dg; // масив похідних функцій активації для кожного шару

var W, dW; // матриці вагових коефіцієнтів та їх похідних

var b, db; // масив вільних членів та їх похідних

var Z, A; // значення кожного нейрону: Z, A

//const lambda = 2.5; // коефіцієнт регуляризації

const beta = 0.9; //0.98


// робота з матрицями

// створення матриці с rows рядків, columns стовпців та заповненою випадковими числами, якшо is_random встановлене, а інакше - 0
const make_matrix = (rows, columns, is_random) => {
  let arr = [];

  // creating two-dimensional array
  for (let i = 0; i < rows; i++) {
    arr[i] = [];
    for (let j = 0; j < columns; j++) {
	if(is_random)
      arr[i][j] = (Math.random()-0.5) * Math.sqrt(2/(6*3)); // для подолання ефекту лінійності
	else
      arr[i][j] = 0;
    }
  }
  return arr;
};


// транспонування матриці
function transpose(mtr)
{
	var num_row = mtr.length; 
	var num_col = mtr[0].length;

	var res = make_matrix(num_col, num_row);

	for(let i=0; i<num_row; i++)
		for(let j=0; j<num_col; j++)
			res[j][i] = mtr[i][j];
	return res;
}

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

// множення числа на матрицю
function mul_number(number, matrix)
{
	var num_row = matrix.length; 
	var num_col = matrix[0].length;

	var result = make_matrix(num_row, num_col, true);

	for(let i=0; i<num_row; i++)
		for(let j=0; j<num_col; j++)
			result[i][j] = number * matrix[i][j];

	return result;
}


// m1 - m2 == m1 + (-m2) == m1 + (-1)*m2
function sub(m1, m2)
{
	return add(m1, mul_number(-1, m2));
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
const create_network = ((layers, func) => {
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

	nn_layers = deepCopy(layers);
	F = deepCopy(func);
	// створення масиву масивів значень нейронів у мережі
	A = [];
	Z = [];
	// створення матриць вагових коефіцієнтів та їх похідних
	W = [];
	dW = [];
	// створення масиву вільних членів та їх похідних
	b = [];
	db = [];
	// створення масиву функцій активації для кожного шару
	g = []; 
	// створення масиву похідних функцій активації для кожного шару
	dg = []; 

	for(let i=0;i<num_layers-1;i++) // кількість матриць = кількість шарів - 1
	{
		var num_row = layers[i+1];
		var num_col = layers[i];
		W.push(make_matrix(num_row, num_col, true));
		b.push(make_matrix(num_row, 1, false));
		dW.push(make_matrix(num_row, num_col, true));
		db.push(make_matrix(num_row, 1, false));
	}
	
	for(let i=0;i<num_layers;i++) 
	{
		A.push(make_matrix(layers[i], 1, false));
		Z.push(make_matrix(layers[i], 1, false));
		g.push(get_g(func[i]));
		dg.push(get_dg(func[i]));
	}
});



//логістична функція
const sigma = ((z) => {
	return 1/(1+Math.exp(-z));
});


//похідна логістичної функції
const dsigma = ((a) => {
	return a*(1-a);
});



//лінійна функція
const linear = ((z) => {
	return z;
});


//лінійна функція - похідна
const dlinear = ((a) => {
	return 1;
});


//обмежена лінійна функція
const ReLU = ((z) => {
	return Math.max(0,z);
});


//обмежена лінійна функція - похідна
const dReLU = ((a) => {
	if(a>=0)
		return 1;
	else
		return 0;
});


//обмежена лінійна функція с витоком
const LeakyReLU = ((z) => {
	return Math.max(0.01*z,z);
});


//обмежена лінійна функція с витоком - похідна
const dLeakyReLU = ((z) => {
	if(a>=0)
		return 1;
	else
		return 0.01;
});


//гіперболічний тангенс 
const tanh = ((z) => {
	return (Math.exp(z) - Math.exp(-z))/(Math.exp(z) + Math.exp(-z));
});


//гіперболічний тангенс - похідна
const dtanh = ((a) => {
	return 1-a*a;
});


// масив співвідношень назв функцій та їх похідних
const activation_functions = [
	["sigma", sigma, dsigma],	
	["linear", linear, dlinear],	
	["relu", ReLU, dReLU],	
	["leakyrelu", LeakyReLU, dLeakyReLU],	
	["tanh", tanh, dtanh],	
];


function get_g(func_name)
{
	for(let i=0;i<activation_functions.length;i++)
		if(func_name===activation_functions[i][0])
			return activation_functions[i][1];
	return "Не знайдена функція активації";
}


function get_dg(func_name)
{
	for(let i=0;i<activation_functions.length;i++)
		if(func_name===activation_functions[i][0])
			return activation_functions[i][2];
	return "Не знайдена похідна функції активації";
}


// виконання активації для вектора Z
const activation = ((Z, func) => {
	var result = Z;
	for(let i=0;i<Z.length;i++)
		for(let j=0;j<Z[0].length;j++)
			result[i][j] = func(Z[i][j]);
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
	{
		Z[0][i][0] = X[i];
		A[0][i][0] = g[0](X[i]);
	}
	// обчислення шарів, розпочинаючи з першого прихованого
	for(let i=1; i<num_layers; i++)
	{
		Z[i] = add( mul(W[i-1], A[i-1]), b[i-1]); // лінійна комбінація
		A[i] = activation(Z[i], g[i]); // активація вектора (матриця з 1 стовпцем)
	}

	return A[num_layers-1];
}


// обчислення значень похідних
function backward(Y) // backpropagation: зворотнє поширення помилки
{
	// перевірка розмірність
	if(Y.length !== nn_layers[num_layers-1])
		return "Bad output size";
	// останній шар нейронів - вихід

	let Y_matrix = make_matrix(Y.length, 1);
	for(let i=0;i<Y.length;i++)
		Y_matrix[i][0] = Y[i];

	// обчислення похідних, розпочинаючи з останнього шару
	var dZ_last = sub(A[num_layers-1], Y_matrix); //помилка на останньому шарі: dz[2] = a[2] -y

	dW[num_layers-2] = deepCopy(mul(dZ_last, transpose(A[num_layers-2]))); // dW[2] = dz[2] * a[1]T
	db[num_layers-2] = deepCopy(dZ_last); // db[2] = dz[2]

	let m = patterns.length;

	for(let i=num_layers-3; i>=0; i--)
	{
		//console.log("i = ", i);

		var diff = activation(Z[i+1], dg[i+1]);

		dZ_last = deepCopy(mul(transpose(W[i+1]),dZ_last)); // * activation(Z[i], dg[i])

		var dZ_last_copy = deepCopy(dZ_last);
		for(let j=0;j<diff.length;j++)
			dZ_last_copy[j][0] = dZ_last[j][0] * diff[j][0];
		dZ_last = deepCopy(dZ_last_copy);

		dW[i] = deepCopy(mul(dZ_last, transpose(A[i]))); 
		db[i] = deepCopy(dZ_last);
	}

	return [dW, db];
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
const func_J = (patterns, lambda) => {
	let J = 0; // значення функції вартості

	const numPatterns = patterns.length; // кількість образів

	for(let i=0;i<numPatterns;i++)
	{
		var y_hat = forward(normalize(patterns[i].x));
		var l = Loss(patterns[i].y, y_hat);    // визначення втрат
		J += l;				   // визначення вартості (помилки)
	}

	J /= numPatterns; // середня помилка

	// регуляризація
	let reg = 0;
	for(let i=0;i<W.length;i++)
		for(let j=0;j<W[i].length;j++)
			for(let k=0;k<W[i][j].length;k++)
				reg += W[i][j][k]*W[i][j][k];

	return J + (lambda/(2*numPatterns))*reg;
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
function f_attempt(patterns, alpha, lambda)
{
	// зберігаємо копію масивів вільних членів та вагових коефіцієнтів
	let b_old = deepCopy(b);
	let W_old = deepCopy(W);

	let old_J = func_J(patterns, lambda); // обчислюємо початкове значення помилки

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
	let new_J = func_J(patterns, lambda);
	
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


// чисельне обчислення похідних
const derive = (coeffs, patterns) => {
	let ders = deepCopy(coeffs); // матриця похідних

	let numrows = coeffs.length;
	let numcols = coeffs[0].length;
	const dx = 0.000001;

	for(let i=0;i<numrows;i++)
		for(let j=0;j<numcols;j++)
		{
			const old = coeffs[i][j];
			coeffs[i][j] = old - dx;
			J_before = func_J(patterns, lambda);
			coeffs[i][j] = old + dx;
			J_after = func_J(patterns, lambda);
			ders[i][j] = (J_after - J_before) / (2*dx);
			coeffs[i][j] = old;
		}

	return ders;
}


// навчання мережі методом градієнтного спуску з чисельними похідними
// patterns - образи, на яких відбувається навчання
// alpha - швидкість навчання
// max_epoch - гранична кількість спроб навчання
// epsilon - бажана точність навчання
const train_grad_desc_num_der = (patterns, alpha, max_epoch, epsilon) => {
	let new_J = epsilon+1;
	
	for(let epoch = 0; epoch < max_epoch; epoch++) // ітерації спроб навчання
	{

		for(let i=0; i<num_layers-1; i++)
		{
			var dW_i = derive(W[i], patterns); // матриця похідних вагових коефіцієнтів
			var db_i = derive(b[i], patterns); // масив похідних вільних членів
			//
			// beta / momentum
			//
			W[i] = sub(W[i], mul_number(alpha, dW_i));
			b[i] = sub(b[i], mul_number(alpha, db_i));
		}
	
		new_J = func_J(patterns, lambda);
		console_log.innerHTML +=  ("На кроці " + epoch +" J = " + new_J);
		console.log("На кроці " + epoch +" J = " + new_J);

		if(new_J<epsilon) // при досягненні точності
			break;
	}	
	return new_J;
}


// навчання мережі методом градієнтного спуску з аналітичними похідними
// patterns - образи, на яких відбувається навчання
// alpha - швидкість навчання
// max_epoch - гранична кількість спроб навчання
// epsilon - бажана точність навчання
const train_grad_desc_an_der = (patterns, alpha, lambda, max_epoch, epsilon) => {
	let new_J = epsilon+1;
	let num_patters = patterns.length;
	
	for(let epoch = 0; epoch < max_epoch; epoch++) // ітерації спроб навчання
	{
		for(let k=0;k<num_patters;k++) // стохастичний градієнтний спуск
		{
			forward(normalize(patterns[k].x));
			backward(patterns[k].y);
			for(let i=0; i<num_layers-1; i++)
			{
				W[i] = sub(W[i], mul_number(alpha/num_patters, dW[i]));
				b[i] = sub(b[i], mul_number(alpha/num_patters, db[i]));
			}
		}

		new_J = func_J(patterns, lambda);
		console_log.innerHTML +=  ("На кроці " + epoch +" J = " + new_J);
		console.log("На кроці " + epoch +" J = " + new_J);

		if(new_J<epsilon) // при досягненні точності
			break;
	}	
	return new_J;
}

// для нормалізації входу

var mu = [];
var sigma2 = [];

function countmusigma(patterns) {
	let m=patterns.length;
	let input_length = patterns[0].x.length;
	
	for(let j=0;j<input_length;j++)		
	{
		let sum = 0, sum2 =0;
		for(let i=0;i<m;i++)
		{
			sum += patterns[i].x[j];
			sum2 += patterns[i].x[j]*patterns[i].x[j];
		}
		mu.push(sum / m);
		sigma2.push(sum2 / m);
	}
}


function normalize(X) {
	var norm_X = [];

	for(let i=0;i<X.length;i++)
		norm_X.push( (X[i]-mu[i])/sigma2[i]  );

	return norm_X;
}


// training set - навчальна вибірка
const patterns = [ // масив об'єктів {x: масив, y: масив}
	{x: [5.1, 3.5, 1.4, 0.2], y: [1, 0, 0]},
	{x: [4.9, 3, 1.4, 0.2], y: [1, 0, 0]},
	{x: [4.7, 3.2, 1.3, 0.2], y: [1, 0, 0]},
	{x: [5.7, 3.8, 1.7, 0.3], y: [1, 0, 0]},
	{x: [5.1, 3.8, 1.5, 0.3], y: [1, 0, 0]},
	{x: [5.4, 3.4, 1.7, 0.2], y: [1, 0, 0]},
	{x: [5.1, 3.7, 1.5, 0.4], y: [1, 0, 0]},
	{x: [4.6, 3.6, 1, 0.2], y: [1, 0, 0]},
	{x: [5.1, 3.3, 1.7, 0.5], y: [1, 0, 0]},
	{x: [4.8, 3.4, 1.9, 0.2], y: [1, 0, 0]},
	{x: [5, 3, 1.6, 0.2], y: [1, 0, 0]},
	{x: [5, 3.4, 1.6, 0.4], y: [1, 0, 0]},
	{x: [5.2, 3.5, 1.5, 0.2], y: [1, 0, 0]},
	{x: [5.2, 3.4, 1.4, 0.2], y: [1, 0, 0]},
	{x: [4.7, 3.2, 1.6, 0.2], y: [1, 0, 0]},
	{x: [4.8, 3.1, 1.6, 0.2], y: [1, 0, 0]},
	{x: [5.4, 3.4, 1.5, 0.4], y: [1, 0, 0]},
	{x: [5.2, 4.1, 1.5, 0.1], y: [1, 0, 0]},
	{x: [5.5, 4.2, 1.4, 0.2], y: [1, 0, 0]},
	{x: [4.9, 3.1, 1.5, 0.2], y: [1, 0, 0]},
	{x: [5, 3.2, 1.2, 0.2], y: [1, 0, 0]},
	{x: [5.5, 3.5, 1.3, 0.2], y: [1, 0, 0]},
	{x: [4.9, 3.6, 1.4, 0.1], y: [1, 0, 0]},
	{x: [4.4, 3, 1.3, 0.2], y: [1, 0, 0]},
	{x: [5.1, 3.4, 1.5, 0.2], y: [1, 0, 0]},
	{x: [5, 3.5, 1.3, 0.3], y: [1, 0, 0]},
	{x: [4.5, 2.3, 1.3, 0.3], y: [1, 0, 0]},
	{x: [4.4, 3.2, 1.3, 0.2], y: [1, 0, 0]},
	{x: [5, 3.5, 1.6, 0.6], y: [1, 0, 0]},
	{x: [5.1, 3.8, 1.9, 0.4], y: [1, 0, 0]},
	{x: [4.8, 3, 1.4, 0.3], y: [1, 0, 0]},
	{x: [5.1, 3.8, 1.6, 0.2], y: [1, 0, 0]},
	{x: [4.6, 3.2, 1.4, 0.2], y: [1, 0, 0]},
	{x: [5.3, 3.7, 1.5, 0.2], y: [1, 0, 0]},
	{x: [5, 3.3, 1.4, 0.2], y: [1, 0, 0]},
	{x: [7, 3.2, 4.7, 1.4], y: [0, 1, 0]},
	{x: [6.4, 3.2, 4.5, 1.5], y: [0, 1, 0]},
	{x: [6.9, 3.1, 4.9, 1.5], y: [0, 1, 0]},
	{x: [5.5, 2.3, 4, 1.3], y: [0, 1, 0]},
	{x: [6.5, 2.8, 4.6, 1.5], y: [0, 1, 0]},
	{x: [5.7, 2.8, 4.5, 1.3], y: [0, 1, 0]},
	{x: [6.3, 3.3, 4.7, 1.6], y: [0, 1, 0]},
	{x: [4.9, 2.4, 3.3, 1], y: [0, 1, 0]},
	{x: [6.1, 2.8, 4.7, 1.2], y: [0, 1, 0]},
	{x: [6.4, 2.9, 4.3, 1.3], y: [0, 1, 0]},
	{x: [6.6, 3, 4.4, 1.4], y: [0, 1, 0]},
	{x: [6.8, 2.8, 4.8, 1.4], y: [0, 1, 0]},
	{x: [6.7, 3, 5, 1.7], y: [0, 1, 0]},
	{x: [6, 2.9, 4.5, 1.5], y: [0, 1, 0]},
	{x: [5.7, 2.6, 3.5, 1], y: [0, 1, 0]},
	{x: [5.5, 2.4, 3.8, 1.1], y: [0, 1, 0]},
	{x: [5.5, 2.4, 3.7, 1], y: [0, 1, 0]},
	{x: [5.8, 2.7, 3.9, 1.2], y: [0, 1, 0]},
	{x: [6, 2.7, 5.1, 1.6], y: [0, 1, 0]},
	{x: [5.4, 3, 4.5, 1.5], y: [0, 1, 0]},
	{x: [6, 3.4, 4.5, 1.6], y: [0, 1, 0]},
	{x: [6.7, 3.1, 4.7, 1.5], y: [0, 1, 0]},
	{x: [6.3, 2.3, 4.4, 1.3], y: [0, 1, 0]},
	{x: [5.6, 3, 4.1, 1.3], y: [0, 1, 0]},
	{x: [5.5, 2.5, 4, 1.3], y: [0, 1, 0]},
	{x: [5.5, 2.6, 4.4, 1.2], y: [0, 1, 0]},
	{x: [6.1, 3, 4.6, 1.4], y: [0, 1, 0]},
	{x: [5.8, 2.6, 4, 1.2], y: [0, 1, 0]},
	{x: [5, 2.3, 3.3, 1], y: [0, 1, 0]},
	{x: [5.6, 2.7, 4.2, 1.3], y: [0, 1, 0]},
	{x: [5.7, 3, 4.2, 1.2], y: [0, 1, 0]},
	{x: [5.7, 2.9, 4.2, 1.3], y: [0, 1, 0]},
	{x: [6.2, 2.9, 4.3, 1.3], y: [0, 1, 0]},
	{x: [5.1, 2.5, 3, 1.1], y: [0, 1, 0]},
	{x: [5.7, 2.8, 4.1, 1.3], y: [0, 1, 0]},
	{x: [6.3, 3.3, 6, 2.5], y: [0, 0, 1]},
	{x: [5.8, 2.7, 5.1, 1.9], y: [0, 0, 1]},
	{x: [7.1, 3, 5.9, 2.1], y: [0, 0, 1]},
	{x: [6.3, 2.9, 5.6, 1.8], y: [0, 0, 1]},
	{x: [6.5, 3, 5.8, 2.2], y: [0, 0, 1]},
	{x: [7.6, 3, 6.6, 2.1], y: [0, 0, 1]},
	{x: [4.9, 2.5, 4.5, 1.7], y: [0, 0, 1]},
	{x: [7.3, 2.9, 6.3, 1.8], y: [0, 0, 1]},
	{x: [6.7, 2.5, 5.8, 1.8], y: [0, 0, 1]},
	{x: [7.2, 3.6, 6.1, 2.5], y: [0, 0, 1]},
	{x: [6.5, 3.2, 5.1, 2], y: [0, 0, 1]},
	{x: [6.4, 2.7, 5.3, 1.9], y: [0, 0, 1]},
	{x: [6.8, 3, 5.5, 2.1], y: [0, 0, 1]},
	{x: [5.7, 2.5, 5, 2], y: [0, 0, 1]},
	{x: [5.8, 2.8, 5.1, 2.4], y: [0, 0, 1]},
	{x: [6.4, 3.2, 5.3, 2.3], y: [0, 0, 1]},
	{x: [6.5, 3, 5.5, 1.8], y: [0, 0, 1]},
	{x: [7.7, 3.8, 6.7, 2.2], y: [0, 0, 1]},
	{x: [7.7, 2.6, 6.9, 2.3], y: [0, 0, 1]},
	{x: [6, 2.2, 5, 1.5], y: [0, 0, 1]},
	{x: [6.9, 3.2, 5.7, 2.3], y: [0, 0, 1]},
	{x: [5.6, 2.8, 4.9, 2], y: [0, 0, 1]},
	{x: [7.7, 2.8, 6.7, 2], y: [0, 0, 1]},
	{x: [6.3, 2.7, 4.9, 1.8], y: [0, 0, 1]},
	{x: [6.7, 3.3, 5.7, 2.1], y: [0, 0, 1]},
	{x: [7.2, 3.2, 6, 1.8], y: [0, 0, 1]},
	{x: [6.2, 2.8, 4.8, 1.8], y: [0, 0, 1]},
	{x: [6.1, 3, 4.9, 1.8], y: [0, 0, 1]},
	{x: [6.4, 2.8, 5.6, 2.1], y: [0, 0, 1]},
	{x: [7.2, 3, 5.8, 1.6], y: [0, 0, 1]},
	{x: [7.4, 2.8, 6.1, 1.9], y: [0, 0, 1]},
	{x: [7.9, 3.8, 6.4, 2], y: [0, 0, 1]},
	{x: [6.4, 2.8, 5.6, 2.2], y: [0, 0, 1]},
	{x: [6.2, 3.4, 5.4, 2.3], y: [0, 0, 1]},
	{x: [5.9, 3, 5.1, 1.8], y: [0, 0, 1]},
];

// test set - вибірка для перевірки (не навчаємо на ній)
const patterns_test = [ // масив об'єктів {x: масив, y: масив}
	{x: [4.6, 3.1, 1.5, 0.2], y: [1, 0, 0]},
	{x: [5, 3.6, 1.4, 0.2], y: [1, 0, 0]},
	{x: [5.4, 3.9, 1.7, 0.4], y: [1, 0, 0]},
	{x: [4.6, 3.4, 1.4, 0.3], y: [1, 0, 0]},
	{x: [5, 3.4, 1.5, 0.2], y: [1, 0, 0]},
	{x: [4.4, 2.9, 1.4, 0.2], y: [1, 0, 0]},
	{x: [4.9, 3.1, 1.5, 0.1], y: [1, 0, 0]},
	{x: [5.4, 3.7, 1.5, 0.2], y: [1, 0, 0]},
	{x: [4.8, 3.4, 1.6, 0.2], y: [1, 0, 0]},
	{x: [4.8, 3, 1.4, 0.1], y: [1, 0, 0]},
	{x: [4.3, 3, 1.1, 0.1], y: [1, 0, 0]},
	{x: [5.8, 4, 1.2, 0.2], y: [1, 0, 0]},
	{x: [5.7, 4.4, 1.5, 0.4], y: [1, 0, 0]},
	{x: [5.4, 3.9, 1.3, 0.4], y: [1, 0, 0]},
	{x: [5.1, 3.5, 1.4, 0.3], y: [1, 0, 0]},
	{x: [6.6, 2.9, 4.6, 1.3], y: [0, 1, 0]},
	{x: [5.2, 2.7, 3.9, 1.4], y: [0, 1, 0]},
	{x: [5, 2, 3.5, 1], y: [0, 1, 0]},
	{x: [5.9, 3, 4.2, 1.5], y: [0, 1, 0]},
	{x: [6, 2.2, 4, 1], y: [0, 1, 0]},
	{x: [6.1, 2.9, 4.7, 1.4], y: [0, 1, 0]},
	{x: [5.6, 2.9, 3.6, 1.3], y: [0, 1, 0]},
	{x: [6.7, 3.1, 4.4, 1.4], y: [0, 1, 0]},
	{x: [5.6, 3, 4.5, 1.5], y: [0, 1, 0]},
	{x: [5.8, 2.7, 4.1, 1], y: [0, 1, 0]},
	{x: [6.2, 2.2, 4.5, 1.5], y: [0, 1, 0]},
	{x: [5.6, 2.5, 3.9, 1.1], y: [0, 1, 0]},
	{x: [5.9, 3.2, 4.8, 1.8], y: [0, 1, 0]},
	{x: [6.1, 2.8, 4, 1.3], y: [0, 1, 0]},
	{x: [6.3, 2.5, 4.9, 1.5], y: [0, 1, 0]},
	{x: [6.3, 2.8, 5.1, 1.5], y: [0, 0, 1]},
	{x: [6.1, 2.6, 5.6, 1.4], y: [0, 0, 1]},
	{x: [7.7, 3, 6.1, 2.3], y: [0, 0, 1]},
	{x: [6.3, 3.4, 5.6, 2.4], y: [0, 0, 1]},
	{x: [6.4, 3.1, 5.5, 1.8], y: [0, 0, 1]},
	{x: [6, 3, 4.8, 1.8], y: [0, 0, 1]},
	{x: [6.9, 3.1, 5.4, 2.1], y: [0, 0, 1]},
	{x: [6.7, 3.1, 5.6, 2.4], y: [0, 0, 1]},
	{x: [6.9, 3.1, 5.1, 2.3], y: [0, 0, 1]},
	{x: [5.8, 2.7, 5.1, 1.9], y: [0, 0, 1]},
	{x: [6.8, 3.2, 5.9, 2.3], y: [0, 0, 1]},
	{x: [6.7, 3.3, 5.7, 2.5], y: [0, 0, 1]},
	{x: [6.7, 3, 5.2, 2.3], y: [0, 0, 1]},
	{x: [6.3, 2.5, 5, 1.9], y: [0, 0, 1]},
	{x: [6.5, 3, 5.2, 2], y: [0, 0, 1]},
];



// визначення типу ірису
function getIris(p)
{
	let max_p = Math.max(p[0], p[1], p[2]);
	if(max_p == p[0])
		return "setosa";
	else 
		if(max_p == p[1])
			return "versicolor";
		else
			return "virginica";
}

let istrain = false;

create_network([4, 9, 6, 3], ["linear", "sigma", "sigma", "sigma"]); // створення 4-шарової мережі: на вході - 4, у 1 прихованому шарі - 9, у 2 прихованому шарі - 6, на виході - 3; з сигмоїдальною функцією активації на усіх шарах, крім входу

//var _y_hat = forward(patterns[0].x);
//var _ders = backward(patterns[0].y);

countmusigma(patterns);
console.log(mu);
console.log(sigma2);

// створити та навчити нейронну мережу
const main = () => {
	// виведення архітектури мережі: ч. 1
	console_log.innerHTML = "<p>" + ("Кількість шарів - " + num_layers);
	console_log.innerHTML += "<p>" +  "Нейрони у шарах: " + (nn_layers) + "<p>";

	const numPatterns = patterns.length; // кількість образів

	let J = 0; // значення функції вартості

	//console.log("Матриці вагових коефіцієнтів: ", W);
	//console.log("Масив вільних членів: ", b);

	
	let alpha = parseFloat(document.getElementById("alpha").value);
	let lambda = parseFloat(document.getElementById("lambda").value);
	let numepoch = parseFloat(document.getElementById("numepoch").value);
	let epsilon = parseFloat(document.getElementById("epsilon").value);

/*
	let J_after = train_random (patterns, alpha, 50, 0.000001); // навчання методом Монте-Карло на patterns з швидкістю alpha, не більше ніж за 50 ітерацій та з граничною точністю 0.000001
	let J_after = train_grad_desc_num_der(patterns, alpha, 50, 0.000001); // навчання методом градієнтного спуску з чисельними похідними на patterns з швидкістю alpha, не більше ніж за 50 ітерацій та з граничною точністю 0.000001
*/
	let J_after = train_grad_desc_an_der(patterns, alpha, lambda, numepoch, epsilon); // навчання методом градієнтного спуску з аналітичними похідними на patterns з швидкістю alpha, не більше ніж за 500 ітерацій та з граничною точністю 0.000001

	let num_err = 0;

	// тестування навченості (training set)

	console_log.innerHTML += "<p>" +  "<h2>Перевірка на навчальній вибірці:</h2>";

	for(let i=0;i<numPatterns;i++)
	{
		var y_hat = forward(normalize(patterns[i].x)); // визначаємо передбачуване значення y_hat
		console_log.innerHTML += "<p>" +  ("Для входу " + patterns[i].x + " отримали y_hat = " + y_hat + " (" + getIris(y_hat) + ")" + " за еталонного y = " + patterns[i].y + " (" + getIris(patterns[i].y) + ")" );
		if (getIris(y_hat) === getIris(patterns[i].y))
			;//console_log.innerHTML += "<b>OK</b>";
		else
		{
			//console_log.innerHTML += "<b><s>OK</s></b>";
			num_err++;
		}
	}

	console_log.innerHTML += "<p>" +  ("J = " + J_after); // результуюча помилка
	console_log.innerHTML += "<p>" +  "Правильно визначено, % = " + 100.0*(numPatterns - num_err)/numPatterns ; // помилка класифікації
	console_log.innerHTML += "<p>" +  "Неправильно визначено, % = " + 100.0*(num_err)/numPatterns ; // помилка класифікації

	// тестування навченості (test set)

	num_err = 0;

	console_log.innerHTML += "<p>" +  "<h2>Перевірка на тестовій вибірці:</h2>";

	let numPatterns_test = patterns_test.length;

	for(let i=0;i<numPatterns_test;i++)
	{
		var y_hat = forward(normalize(patterns_test[i].x)); // визначаємо передбачуване значення y_hat
		console_log.innerHTML += "<p>" +  ("Для входу " + patterns_test[i].x + " отримали y_hat = " + y_hat + " (" + getIris(y_hat) + ")" + " за еталонного y = " + patterns_test[i].y + " (" + getIris(patterns_test[i].y) + ")" );
		if (getIris(y_hat) === getIris(patterns_test[i].y))
			;//console_log.innerHTML += "<b>OK</b>";
		else
		{
			//console_log.innerHTML += "<b><s>OK</s></b>";
			num_err++;
		}
	}

	console_log.innerHTML += "<p>" +  ("J = " + J_after); // результуюча помилка
	console_log.innerHTML += "<p>" +  "Правильно визначено, % = " + 100.0*(numPatterns_test - num_err)/numPatterns_test ; // помилка класифікації
	console_log.innerHTML += "<p>" +  "Неправильно визначено, % = " + 100.0*(num_err)/numPatterns_test ; // помилка класифікації


	// виведення архітектури мережі: ч. 2 (після навчання)
	//console_log.innerHTML += "<p>" +  ("Матриці вагових коефіцієнтів: ");
	//console_log.innerHTML += "<p>" +  (W);
	//console_log.innerHTML += "<p>" +  ("Масив вільних членів: ");
	//console_log.innerHTML +=  (b);

	istrain = true;
}


// по завантаженні документа
document.addEventListener("DOMContentLoaded", () => {

	let button = document.querySelector("#count"); // кнопка для обчислення результату за уведеними користувачем даними

	let start = document.getElementById("start"); // кнопка для навчання мережі

	console_log = document.getElementById("log");

	start.addEventListener("click", main); // main виконується по натисканню кнопки "start"

	button.addEventListener("click", () => { //  виконується по натисканню кнопки "count"

		let SL = document.getElementById("SL").value;
		let SW = document.getElementById("SW").value;
		let PL = document.getElementById("PL").value;
		let PW = document.getElementById("PW").value;

		if(SL === "" || SW === "" || PL === "" || PW === "")
		{
			alert("Уведіть 4 параметри");
			return;
		}
		// Х містить 
		let X = [
			parseFloat(SL), parseFloat(SW), parseFloat(PL), parseFloat(PW)
		];

		let y_hat = forward(normalize(X)); // обчислити значення
		//console_log.innerHTML +=  (y_hat); 
		let str = "класифіковано як " + getIris(y_hat) + " [" + y_hat + "]";
		
		const div = document.getElementById("text");
		div.innerHTML = str;
	});


	document.getElementById("download").addEventListener("click", () => { //  виконується по натисканню кнопки "download"
		if(!istrain)
		{
			alert("Неможливо завантажити ненавчену модель");
			return;
		}
		// модель
		var model = {
			model_layers: nn_layers,
			model_func: F,
			model_weights: [W, b]
		};
		
		var str = JSON.stringify(model);

		const link = document.createElement("a");
		link.download = "model_iris_F.json";
		link.href = URL.createObjectURL(new Blob([str]));
		link.click();
	});

	document.querySelector('#upload').addEventListener('submit', (event) => { //  виконується по натисканню кнопки "upload"
		
		let file = document.querySelector('#model');

		event.preventDefault(); // Stop the form from reloading the page

		if (!file.value.length)
		{
			alert("Оберіть файл моделі для завантаження");
			return;
		}

		let reader = new FileReader();

		reader.onload = (event) => {
			let str = event.target.result;
			let model = JSON.parse(str);
			//console.log('string', str);
			//console.log('json', json);
			nn_layers = deepCopy(model.model_layers);
			W = deepCopy(model.model_weights[0]);
			b = deepCopy(model.model_weights[1]);
			F = deepCopy(model.model_func);
			istrain = true;

			// створення масиву масивів значень нейронів у мережі
			A = [];
			Z = [];
			// створення масиву функцій активації для кожного шару
			g = []; 
			// створення масиву похідних функцій активації для кожного шару
			dg = []; 

			for(let i=0;i<nn_layers.length;i++) 
			{
				A.push(make_matrix(nn_layers[i], 1, false));
				Z.push(make_matrix(nn_layers[i], 1, false));
				g.push(get_g(F[i]));
				dg.push(get_dg(F[i]));
			}
			dW = deepCopy(W);
			db = deepCopy(b);

		};

		reader.readAsText(file.files[0]);

	});

});
