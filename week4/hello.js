AFRAME.registerComponent('hello-world', {
	init: function () {
		console.log('Hello, World!');
	}
});



AFRAME.registerComponent('my-component', {
	schema: {
		arrayProperty: {type: 'array', default: []},
		integerProperty: {type: 'int', default: 5}
	},
	init: function () {
		//console.log("integerProperty = ", integerProperty);
		//console.log("arrayProperty = ", arrayProperty);
	}
});
