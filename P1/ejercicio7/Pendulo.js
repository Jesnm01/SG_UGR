import * as THREE from '../libs/three.module.js'


class Pendulo extends THREE.Object3D {
	constructor(gui, titleGui) {
		super();

		// Se crea la parte de la interfaz que corresponde a la caja
		// Se crea primero porque otros métodos usan las variables que se definen para la interfaz
		this.createGUI(gui);

		// Se crean los materiales
		this.createMaterials();

		this.pendulo_sup = this.crearPenduloSup();
		this.pendulo_inf = this.crearPenduloInf();

		this.pendulo_inf.position.z = 1.5; //La suma de los z/2 de la caja grande y la pequeña
		this.peque_posicion_inicial = -2.5;
		this.pendulo_inf.position.y = this.peque_posicion_pequeamiento_inicial;

		this.Pendulo = new THREE.Object3D();
		this.Pendulo.add(this.pendulo_sup);
		this.Pendulo.add(this.pendulo_inf);

		this.add(this.Pendulo);
	};


	crearPenduloSup(){		
		//el nodo del que van a colgar las partes verdes, la roja y el eje, y que se va a devolver
		var pendulo_sup = new THREE.Object3D();

		var caja_total = new THREE.Object3D();

		this.h_rojo = 1;
		this.h_verde = 4;
		this.z_caja_grande = 2;

		//Caja verde de arriba
		var cajaGeomArriba = new THREE.BoxBufferGeometry(4,4,this.z_caja_grande);
		cajaGeomArriba.translate(0,2,0);
		this.cajaVerdeArriba = new THREE.Mesh(cajaGeomArriba,this.material_verde);
		

		//Caja verde de abajo
		var cajaGeomAbajo = new THREE.BoxBufferGeometry(4,4,this.z_caja_grande);
		cajaGeomAbajo.translate(0,-2,0);
		this.cajaVerdeAbajo = new THREE.Mesh(cajaGeomAbajo,this.material_verde);
		this.cajaVerdeAbajo.position.y = -this.h_rojo*this.guiControls.rojo_size;


		//Caja roja del centro
		var cajaGeomCentro = new THREE.BoxBufferGeometry(4,this.h_rojo,this.z_caja_grande);
		cajaGeomCentro.translate(0,-this.h_rojo/2,0);
		this.cajaRojaCentro = new THREE.Mesh(cajaGeomCentro, this.material_rojo);
		this.cajaRojaCentro.scale.y = this.guiControls.rojo_size;


		//Eje de rotacion
		var ejeGeom = new THREE.CylinderBufferGeometry(1,1,0.5,8);
		this.eje = new THREE.Mesh(ejeGeom, this.material_morado);
		this.eje.rotation.x = Math.PI/2;
		this.eje.position.z = this.z_caja_grande/2;


		caja_total.add(this.cajaVerdeArriba);
		caja_total.add(this.cajaRojaCentro);
		caja_total.add(this.cajaVerdeAbajo);
		caja_total.position.y = -2;

		pendulo_sup.add(caja_total);
		pendulo_sup.add(this.eje);


		return pendulo_sup;
	};

	crearPenduloInf(){
		this.h_azul = 1;
		this.z_caja_peque = 1;

		var pendulo_inf = new THREE.Object3D();

		//Caja Azul
		var cajaGeom = new THREE.BoxBufferGeometry(2,this.h_azul,this.z_caja_peque);
		cajaGeom.translate(0,-this.h_azul/2,0);
		this.cajaAzul = new THREE.Mesh(cajaGeom,this.material_azul);
		this.cajaAzul.scale.y = this.guiControls.pendulo_peque_size;
		this.cajaAzul.position.y = 1;


		//Eje de rotacion
		var ejeGeom = new THREE.CylinderBufferGeometry(0.5,0.5,0.3,8);
		this.eje2 = new THREE.Mesh(ejeGeom,this.material_verde);
		this.eje2.rotation.x = Math.PI/2;
		this.eje2.position.z = this.z_caja_peque/2;


		pendulo_inf.add(this.cajaAzul);
		pendulo_inf.add(this.eje2);

		return pendulo_inf;
	};

	createMaterials() {
		this.material_rojo = new THREE.MeshPhongMaterial({
			color: 0xda1719,
			//side: THREE.DoubleSide,
			flatShading: true, //Sombreado plano
		});

		this.material_azul = new THREE.MeshPhongMaterial({
			color: 0x0b2fd4,
			// side: THREE.DoubleSide,
			flatShading: true, 
		});

		this.material_morado = new THREE.MeshPhongMaterial({
			color: 0xe269f0,
			// side: THREE.DoubleSide,
			flatShading: true, 
		});

		this.material_verde = new THREE.MeshPhongMaterial({
			color: 0x53d40b,
			// side: THREE.DoubleSide,
			flatShading: true, 
		});
	};

	createGUI(gui) {
		// Controles para el tamaño, la orientación y la posición de la caja

		this.guiControls = new function () {
			this.verTodo = true;
			this.verPeque = true;

			//Pendulo superior opciones
			this.rojo_size = 5;
			this.pendulo_sup_rotacion = 0;

			//Pendulo inferior opciones
			this.pendulo_peque_size = 10
			this.pendulo_inf_rotacion = 0;
			this.posicion_peque = 10;



			// Un botón para dejarlo todo en su posición inicial
			// Cuando se pulse se ejecutará esta función.
			this.reset = function () {
				this.verTodo = true;
				this.verPeque = true;

				//Pendulo superior opciones
				this.rojo_size = 5;
				this.pendulo_sup_rotacion = 0;

				//Pendulo inferior opciones
				this.pendulo_peque_size = 10;
				this.pendulo_inf_rotacion = 0;
				this.posicion_peque = 10;
			}
		}

		// Se crea una sección para los controles de la caja
		var folder = gui.addFolder("Pendulo Grande");
		var folder2 = gui.addFolder("Pendulo Pequeño");
		
		// Estas lineas son las que añaden los componentes de la interfaz
		// Las tres cifras indican un valor mínimo, un máximo y el incremento
		// El método   listen()   permite que si se cambia el valor de la variable en código, el deslizador de la interfaz se actualice
		folder.add(this.guiControls, 'verTodo').name('Ver Objeto: ');
		folder.add(this.guiControls, 'pendulo_sup_rotacion', -Math.PI/4, Math.PI/4, 0.1).name('Rotar: ').listen();
		folder.add(this.guiControls, 'rojo_size', 5, 10, 0.1).name('Tamaño Rojo: ').listen();

		folder2.add(this.guiControls, 'verPeque').name('Ver Objeto: ');
		folder2.add(this.guiControls, 'pendulo_inf_rotacion', -Math.PI/4, Math.PI/4, 0.1).name('Rotar: ').listen();
		folder2.add(this.guiControls, 'pendulo_peque_size', 10, 20, 0.1).name('Tamaño Azul: ').listen();
		folder2.add(this.guiControls, 'posicion_peque', 10, 90, 0.1).name('Posicion (%): ').listen();


		folder.add(this.guiControls, 'reset').name('[ Reset ]');
		folder2.add(this.guiControls, 'reset').name('[ Reset ]');

	};

	update() {
		this.cajaRojaCentro.scale.y = this.guiControls.rojo_size;
		this.Pendulo.rotation.z = this.guiControls.pendulo_sup_rotacion;
		this.cajaVerdeAbajo.position.y = -this.h_rojo*this.guiControls.rojo_size;

		this.cajaAzul.scale.y = this.guiControls.pendulo_peque_size;
		this.pendulo_inf.rotation.z = this.guiControls.pendulo_inf_rotacion;

		this.Pendulo.visible = this.guiControls.verTodo;
		this.pendulo_inf.visible = this.guiControls.verPeque;

		this.pendulo_inf.position.y = this.peque_posicion_inicial - (this.guiControls.posicion_peque * this.guiControls.rojo_size * 0.01);

		// Con independencia de cómo se escriban las 3 siguientes líneas, el orden en el que se aplican las transformaciones es:
		// Primero, el escalado
		// Segundo, la rotación en Z
		// Después, la rotación en Y
		// Luego, la rotación en X
		// Y por último la traslación
	};
}
export {Pendulo}

class Figura extends THREE.Object3D{
	constructor(gui){
	  super();
  
	//  this.animGrande;
	  this.tiempoAnterior=Date.now();
  
	  this.dimPendGrande ={
		lado: 4,
		central: 5
	  }
	  this.dimPendPeq ={
		lado: 2,
		largo: 10,
		porcentaje: 0.1
	  }
  
	  // Creación de los elementos
	  this.penduloGrande = this.createPenduloGrande(this.dimPendGrande.lado,this.dimPendGrande.central);
	  this.penduloPeque = this.createPenduloPeq(this.dimPendPeq.lado,this.dimPendPeq.largo);
	  this.penduloPeque.position.set(0,-this.dimPendGrande.lado/2 -this.dimPendPeq.porcentaje*this.dimPendGrande.central,(this.dimPendPeq.lado+this.dimPendGrande.lado)/2);
	  // Creación de las GUI de los elementosS
	  this.createGUIBox(gui);
  
	  // Los añadimos a nuestro objeto
	  this.add(this.penduloGrande);
	  this.add(this.penduloPeque);
	}
  
	createPenduloGrande(lado,central){
	  var pendulo = new THREE.Object3D();
	  pendulo.cajaArriba = new THREE.Mesh(
		new THREE.BoxGeometry(lado,lado,lado),
		new THREE.MeshPhongMaterial( { color: 0x00ff00 } )
	  );
	  pendulo.cajaAbajo = new THREE.Mesh(
		new THREE.BoxGeometry(lado,lado,lado),
		new THREE.MeshPhongMaterial( { color: 0x00ff00 } )
	  );
	  pendulo.cajaCentral = new THREE.Mesh(
		new THREE.BoxGeometry(lado,central,lado),
		new THREE.MeshPhongMaterial( { color: 0xf4340d } )
	  );
	  pendulo.rosca =new THREE.Mesh(
		new THREE.CylinderGeometry(lado/4,lado/4,5*lado/4,8),
		new THREE.MeshPhongMaterial( { color: 0xc75cfa } )
	  );
  
	  pendulo.rosca.rotateX(Math.PI/2);
	  pendulo.cajaCentral.position.set(0,(-lado-central)/2,0);
	  pendulo.cajaAbajo.position.set(0,-lado-central,0);
  
	  pendulo.add(pendulo.rosca);
	  pendulo.add(pendulo.cajaArriba);
	  pendulo.add(pendulo.cajaCentral);
	  pendulo.add(pendulo.cajaAbajo);
  
	  return pendulo;
	}
  
	createPenduloPeq(lado,largo){
	  var pendulo = new THREE.Object3D();
	  pendulo.caja = new THREE.Mesh(
		new THREE.BoxGeometry(lado,largo,lado),
		new THREE.MeshPhongMaterial( { color: 0x1d3aca } )
	  );
	  pendulo.rosca =new THREE.Mesh(
		new THREE.CylinderGeometry(lado/4,lado/4,5*lado/4,8), // Queremos que su tamaño sea la mitad del lado del péndulo de ancho y alto y que sobresalga un poco de profundo
		new THREE.MeshPhongMaterial( { color: 0xc75cfa } )
	  );
  
	  pendulo.rosca.rotateX(Math.PI/2);
	  pendulo.caja.position.set(0,(-largo+lado)/2,0);
  
	  pendulo.add(pendulo.rosca);
	  pendulo.add(pendulo.caja);
  
	  return pendulo;
	}
  
  
	createGUIBox(gui){
		var that = this;
  
		this.guiControls = {
		  centralPendGrande: 5,
		  anguloT: 0,
		  largoPendPeq: 10,
		  anguloP: 0,
		  animation1: false,
		  anima1Adelante: true, // la animación va hacia delante o hacia atrás
		  vel1: 0,
		  animation2: false,
		  anima2Adelante: true, // la animación va hacia delante o hacia atrás
		  vel2: 0
		};
  
		var folder = gui.addFolder('Pendulo Grande');
  
		folder.add(this.guiControls, 'centralPendGrande', 5,+10,0.1)
		  .name('Longitud: ')
		  .onChange( function(){
			that.penduloGrande.cajaCentral.scale.set(1,that.guiControls.centralPendGrande/that.dimPendGrande.central,1);
			that.penduloGrande.cajaCentral.position.set(0,(-that.dimPendGrande.lado-that.guiControls.centralPendGrande)/2,0);
			that.penduloGrande.cajaAbajo.position.set(0,-that.dimPendGrande.lado-that.guiControls.centralPendGrande,0);
			that.penduloPeque.position.set(0,-that.dimPendGrande.lado/2 -that.dimPendPeq.porcentaje*that.guiControls.centralPendGrande,(that.dimPendPeq.lado+that.dimPendGrande.lado)/2);
		  });
		folder.add(this.guiControls, 'anguloT', -Math.PI/4, Math.PI/4,0.1)
		  .name('Giro: ')
		  .onChange( function(){
			that.rotation.z=that.guiControls.anguloT;
		  }
		);
  
		folder = gui.addFolder('Pendulo Pequeño');
		folder.add(this.guiControls, 'largoPendPeq', 10,+20,0.1)
		  .name('Longitud: ')
		  .onChange( function(){
			that.penduloPeque.caja.scale.set(1,that.guiControls.largoPendPeq/that.dimPendPeq.largo,1);
			that.penduloPeque.caja.position.set(0,(-that.guiControls.largoPendPeq+that.dimPendPeq.lado)/2,0);
		});
		folder.add(this.guiControls, 'anguloT', -Math.PI/4, Math.PI/4,0.1)
		  .name('Giro: ')
		  .onChange( function(){
			that.penduloPeque.rotation.z=that.guiControls.anguloT;
		});
		folder.add(this.dimPendPeq, 'porcentaje', 0.1,0.9,0.01)
		  .name('Posicion(%): ')
		  .onChange( function(){
			  that.penduloPeque.position.set(0,-that.dimPendGrande.lado/2 -that.dimPendPeq.porcentaje*that.guiControls.centralPendGrande,(that.dimPendPeq.lado+that.dimPendGrande.lado)/2);
		});
  
		folder = gui.addFolder('Animación');
		folder.add(this.guiControls, 'animation1').name('Pendulo 1: ');
		folder.add(this.guiControls, 'vel1', 0, 2, 0.1).name('Velocidad 1: ')
		  .onFinishChange(function() {
			that.guiControls.anima1Ini=false;
			if (this.animGrande !== null && this.animGrande!==undefined)
			  this.animGrande.stop();
		  });
		folder.add(this.guiControls, 'animation2').name('Pendulo 2: ');
		folder.add(this.guiControls, 'vel2', 0, 2, 0.1).name('Velocidad 2: ');
  
  
	  }
  
	  update(){
		var tiempoActual = Date.now();
		var segundosTranscurridos = (tiempoActual-this.tiempoAnterior)/1000;
  
		if (this.guiControls.animation1) {
		  if (this.guiControls.anima1Adelante) {
			this.rotation.z+=this.guiControls.vel1*segundosTranscurridos;
			if (this.rotation.z >= Math.PI/4) {
			  this.guiControls.anima1Adelante = false;
			}
		  }else {
			this.rotation.z-=this.guiControls.vel1*segundosTranscurridos;
			if (this.rotation.z<= -Math.PI/4) {
			  this.guiControls.anima1Adelante=true;
			}
		  }
		}
		if (this.guiControls.animation2) {
		  if (this.guiControls.anima2Adelante) {
			this.penduloPeque.rotation.z+=this.guiControls.vel2*segundosTranscurridos;
			if (this.penduloPeque.rotation.z >= Math.PI/4) {
			  this.guiControls.anima2Adelante = false;
			}
		  }else {
			this.penduloPeque.rotation.z-=this.guiControls.vel2*segundosTranscurridos;
			if (this.penduloPeque.rotation.z<= -Math.PI/4) {
			  this.guiControls.anima2Adelante=true;
			}
		  }
		}
		this.tiempoAnterior= tiempoActual;
	  }
  } export{Figura}