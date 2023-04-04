let markerVisible = { A: false, B: false, C: false };

AFRAME.registerComponent('registerevents', {
	init: function () {
		var marker = this.el;
	
		marker.addEventListener('markerFound', function() {
			console.log('markerFound', marker.id); 
			markerVisible[marker.id] = true;
		});

		marker.addEventListener('markerLost', function() {
			console.log('markerLost', marker.id); 
			markerVisible[marker.id] = false;
		});
	}
});


AFRAME.registerComponent('run', {
	init: function() {
		this.A = document.querySelector("#A");
		this.B = document.querySelector("#B");
		this.C = document.querySelector("#C");
		this.P = document.querySelector("#P");

		this.pA = new THREE.Vector3();
		this.pB = new THREE.Vector3();
		this.pC = new THREE.Vector3();

		let material = new THREE.MeshLambertMaterial({color:0xFF0000});
		let geometry=new THREE.CylinderGeometry( 0.05, 0.05, 1, 12);
		geometry.applyMatrix4( new THREE.Matrix4().makeTranslation( 0, 0.5, 0 ) );
		geometry.applyMatrix4( new THREE.Matrix4().makeRotationX( THREE.MathUtils.degToRad( 90 ) ) );
		this.cylinderAB = new THREE.Mesh( geometry, material );

		this.lineAB = document.querySelector('#lineAB').object3D;
		this.lineAB.add( this.cylinderAB );
		this.cylinderAB.visible = false;

		this.cylinderBC = new THREE.Mesh( geometry, material );
		this.lineBC = document.querySelector('#lineBC').object3D;
		this.lineBC.add( this.cylinderBC );
		this.cylinderBC.visible = false;

		this.cylinderCA = new THREE.Mesh( geometry, material );
		this.lineCA = document.querySelector('#lineCA').object3D;
		this.lineCA.add( this.cylinderCA );
		this.cylinderCA.visible = false;
	},

	tick: function (time, deltaTime) {
		let Pr = 0;
		if ( markerVisible["A"] && markerVisible["B"] ) {
			this.A.object3D.getWorldPosition(this.pA);
			this.B.object3D.getWorldPosition(this.pB);
			let distance = this.pA.distanceTo( this.pB );
			Pr += distance;
			this.lineAB.lookAt( this.pB );
			this.cylinderAB.scale.set(1,1,distance);
			this.cylinderAB.visible = true;
		}
		if ( markerVisible["B"] && markerVisible["C"] ) {
			this.B.object3D.getWorldPosition(this.pA);
			this.C.object3D.getWorldPosition(this.pB);
			let distance = this.pA.distanceTo( this.pB );
			Pr += distance;
			this.lineBC.lookAt( this.pC );
			this.cylinderBC.scale.set(1,1,distance);
			this.cylinderBC.visible = true;
		}
		if ( markerVisible["C"] && markerVisible["A"] ) {
			this.C.object3D.getWorldPosition(this.pC);
			this.A.object3D.getWorldPosition(this.pA);
			let distance = this.pC.distanceTo( this.pA );
			Pr += distance;
			this.lineCA.lookAt( this.pA );
			this.cylinderCA.scale.set(1,1,distance);
			this.cylinderCA.visible = true;
		}
		if (markerVisible["A"] && markerVisible["B"] && markerVisible["C"])
			this.P.setAttribute('value', "P = "+Pr);
		else
			this.P.setAttribute('value', "");
			
		if ( !markerVisible["A"] )
			this.cylinderAB.visible = this.cylinderCA.visible = false;
		if ( !markerVisible["B"] )
			this.cylinderAB.visible = this.cylinderBC.visible = false;
		if ( !markerVisible["C"] )
			this.cylinderCA.visible = this.cylinderBC.visible = false;
	}

});

