
import * as THREE from '../libs/three.module.js'


class Reloj extends THREE.Object3D {
	constructor(gui, titleGui) {
		super();

		// Se crea la parte de la interfaz que corresponde a la caja
		// Se crea primero porque otros métodos usan las variables que se definen para la interfaz
		this.createGUI(gui, titleGui);
		
		// Se crean los materiales
		this.createMaterials();

		this.reloj = new THREE.Object3D();

		var radio = 30;

		//Creamos el minutero
		this.minutero = this.crearEsfera(this.material_rojo);
		this.minutero.position.set(radio-8,0,0); //como tiene 3 de radio las horas, para que esté separado lo pongo antes en la x
		
		this.minuteroBueno = new THREE.Object3D();
		this.minuteroBueno.add(this.minutero);

		this.reloj.add(this.minuteroBueno);
		
		//Creamos las horas
		for (var i = 0; i < 2*Math.PI; i+=Math.PI/6) {
			var hora = this.crearEsfera(this.material_verde);
			hora.position.set(radio * Math.cos(i), 0, radio * Math.sin(i));
			this.reloj.add(hora);
		}

		this.add(this.reloj);

		this.tiempoAnterior = Date.now();

	};


	crearEsfera(material){
		var geometria = new THREE.SphereBufferGeometry(3,30,30);
		var esfera_mesh = new THREE.Mesh(geometria,material);

		return esfera_mesh;
	}


	createMaterials() {
		this.material_rojo = new THREE.MeshPhongMaterial({
			color: 0xda1719,
			side: THREE.DoubleSide,
			// flatShading: true, //Sombreado plano
		});

		this.material_verde = new THREE.MeshPhongMaterial({
			color: 0x2F8823,
			side: THREE.DoubleSide,
			// flatShading: true, //Sombreado plano
		});
	};

	createGUI(gui, titleGui) {
		this.guiControls = new function () {
			this.velocidad = 0;

			this.reset = function () {
				this.velocidad = 0;
			}
		}

		var folder = gui.addFolder(titleGui);
		// Estas lineas son las que añaden los componentes de la interfaz
		// Las tres cifras indican un valor mínimo, un máximo y el incremento
		// El método   listen()   permite que si se cambia el valor de la variable en código, el deslizador de la interfaz se actualice
		folder.add(this.guiControls, 'velocidad', -12, 12, 0.1).name('Velocidad (marcas/s): ').listen();
		folder.add(this.guiControls, 'reset').name('[ Reset ]');
	};

	update() {
		//Crear la animacion
		var tiempoActual = Date.now();
		var segundosTranscurridos = (tiempoActual - this.tiempoAnterior)/1000;
		this.minuteroBueno.rotation.y += segundosTranscurridos * this.guiControls.velocidad/**Math.PI/6*/; //Lo del math.PI/6 no se porque hay que ponerlo, si esq hay que ponerlo
		this.tiempoAnterior = tiempoActual;
	};
}


export{Reloj}