// import THREE from 'three'
import * as THREE from '../libs/three.module.js'
import { ThreeBSP } from '../libs/ThreeBSP.js'


class Taza extends THREE.Object3D {
	constructor(gui, titleGui) {
		super();

		// Se crea la parte de la interfaz que corresponde a la caja
		// Se crea primero porque otros métodos usan las variables que se definen para la interfaz
		this.createGUI(gui, titleGui);

		// Se crea el material
		this.createMaterials();

		//Se crean los objetos. Necesitamos 2 cilindros (uno de más radio y otro de menos radio) y un toroide
        var geometry_cilindro_externo = new THREE.CylinderGeometry(5,5,10,90);
        var geometry_cilindro_interno = new THREE.CylinderGeometry(4.5,4.5,9,90);
        var geometry_asa = new THREE.TorusGeometry(2.5,0.8,60,60);

        // Los colocamos en su sitio
        geometry_cilindro_externo.translate(0,5,0);
        geometry_asa.translate(5,0.5+4.5,0);
        geometry_cilindro_interno.translate(0,4.5+1,0);

        // Creamos los nodos BSP
        var cilindro_externo_bsp = new ThreeBSP(geometry_cilindro_externo);
        var asa_bsp = new ThreeBSP(geometry_asa);
        var cilindro_interno_bsp = new ThreeBSP(geometry_cilindro_interno);

        // Y operamos: al externo le pegamos el asa. Y luego, al resultado le quitamos el interno
        var externo_con_asa = cilindro_externo_bsp.union(asa_bsp);
        var taza_bsp = externo_con_asa.subtract(cilindro_interno_bsp);

        // Hacemos el mesh y lo añadimos
        this.mesh = taza_bsp.toMesh(this.material_phong);
		// var prueba = taza_bsp.toGeometry();
		// prueba.rotateY(Math.PI /2);
		// this.mesh = new THREE.Mesh(prueba, this.material_phong);

        this.mesh.position.set(-16,0,0);
		this.add(this.mesh);


    }

	createMaterials() {
        this.phongSettings = {
            color: 0x49ef4,
            wireframe: false,
            specular: 0xffffff, //Blanco
            shininess: 9,
        }

		this.material_phong = new THREE.MeshPhongMaterial(this.phongSettings);
	};

	createGUI(gui, titleGui) {
		// Controles para ver y poner en alambres la taza
		this.guiControls = new function () {
			this.ver = true;
            this.wireframe = false;

			// Un botón para dejarlo todo en su posición inicial
			this.reset = function () {
				this.ver = true;
                this.wireframe = false;
			}
		}

		// Se crea una sección para los controles de la caja
		var folder = gui.addFolder(titleGui);
		// Estas lineas son las que añaden los componentes de la interfaz
		folder.add(this.guiControls, 'ver').name('Ver Objeto: ').listen();
        folder.add(this.guiControls, 'wireframe').name('Alambrado: ').listen();
		folder.add(this.guiControls, 'reset').name('[ Reset ]');
	};

	update() {
		 this.mesh.visible = this.guiControls.ver;
         this.material_phong.wireframe = this.guiControls.wireframe;
		 this.mesh.rotation.x += 0.003;
		 this.mesh.rotation.y += 0.010;

        // Con independencia de cómo se escriban las 3 siguientes líneas, el orden en el que se aplican las transformaciones es:
		// Primero, el escalado
		// Segundo, la rotación en Z
		// Después, la rotación en Y
		// Luego, la rotación en X
		// Y por último la traslación
	};
}

export {Taza}