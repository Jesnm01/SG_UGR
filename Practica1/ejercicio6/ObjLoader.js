
 import * as THREE from '../libs/three.module.js'
 import { MTLLoader } from '../libs/MTLLoader.js'
 import { OBJLoader } from '../libs/OBJLoader.js'


class ObjLoader extends THREE.Object3D {
	constructor(gui, titleGui) {
		super();

		// Se crea la parte de la interfaz que corresponde a la caja
		// Se crea primero porque otros métodos usan las variables que se definen para la interfaz
		this.createGUI(gui, titleGui);

		var that = this;
		var mtlLoader = new MTLLoader();
		mtlLoader.load("../models/porsche911/911.mtl", function(materials) {
			materials.preload();
			var objLoader = new OBJLoader();
			objLoader.setMaterials(materials);
			objLoader.load("../models/porsche911/Porsche_911_GT2.obj", function(modelo3D) {
				that.add(modelo3D);
				console.log(modelo3D);
			});
		});

        //Valores completamente arbitrarios la verdad, no se como escalarlo bien
        this.scale.set(3,3,3);
        this.position.y = 1.8;

	}


	createGUI(gui, titleGui) {
		// Controles para el tamaño, la orientación y la posición de la caja

		this.guiControls = new function () {
			this.ver = true;
			this.animacion = true;

			// Un botón para dejarlo todo en su posición inicial
			// Cuando se pulse se ejecutará esta función.
			this.reset = function () {
				this.ver = true;
				this.animacion = true;
			}
		}

		// Se crea una sección para los controles de la caja
		var folder = gui.addFolder(titleGui);
		// Estas lineas son las que añaden los componentes de la interfaz
		// Las tres cifras indican un valor mínimo, un máximo y el incremento
		// El método   listen()   permite que si se cambia el valor de la variable en código, el deslizador de la interfaz se actualice
		folder.add(this.guiControls, 'ver').name('Ver Objeto: ');
		folder.add(this.guiControls, 'animacion').name('Animacion: ');
		folder.add(this.guiControls, 'reset').name('[ Reset ]');
	};

	update() {
        this.visible = this.guiControls.ver; //Aqui esto estaba puesto con children, ver de que va esto

        if(this.guiControls.animacion){
        this.rotation.y += 0.005;
        }
		
		// Primero, el escalado
		// Segundo, la rotación en Z
		// Después, la rotación en Y
		// Luego, la rotación en X
		// Y por último la traslación
	};
}

export{ObjLoader}