// import THREE from 'three'
import * as THREE from '../libs/three.module.js'
import { ThreeBSP } from '../libs/ThreeBSP.js'


class Tuerca extends THREE.Object3D {
	constructor(gui, titleGui) {
		super();

		// Se crea la parte de la interfaz que corresponde a la caja
		// Se crea primero porque otros métodos usan las variables que se definen para la interfaz
		this.createGUI(gui, titleGui);

		// Se crea el material
		this.createMaterials();

		//Se crean los objetos. Necesitamos 2 cilindros (uno con 6 caras y otro para el agujero), una esfera para hacer los picos, y un toroide finito para las muescas de la tuerca
        var geometry_cilindro = new THREE.CylinderGeometry(5,5,3,8);
        var geometry_esfera = new THREE.SphereGeometry(5.05,40,40);
        var geometry_agujero = new THREE.CylinderGeometry(2.7,2.7,3,90);
        var geometry_espiral = new THREE.TorusGeometry(2.7,0.05,10,30);


        // Los colocamos en su sitio
        geometry_cilindro.translate(0,1.5,0);
        geometry_esfera.translate(0,1.5,0);
        geometry_agujero.translate(0,1.5,0);

        //Tengo que crearme varios espirales y colocarlos, por lo que me clono el original y los voy colocando encima 
        geometry_espiral.rotateX((Math.PI)/2);
        var espiral_copia_solo = geometry_espiral.clone();
        for (var i=1; i<=20; i++){
            var auxiliar = espiral_copia_solo.clone();
            auxiliar.translate(0,i*0.15,0);
            geometry_espiral.merge(auxiliar);
        }

        // Creamos los nodos BSP
        var cilindro_bsp = new ThreeBSP(geometry_cilindro);
        var esfera_bsp = new ThreeBSP(geometry_esfera);
        var agujero_bsp = new ThreeBSP(geometry_agujero);
        var muescas_bsp = new ThreeBSP(geometry_espiral);

        // Y operamos: al cilindro le hacemos interseccion con la esfera, y a eso le quitamos el agujero. Luego las muescas con los toriodes
        var cilindro_menos_esfera = cilindro_bsp.intersect(esfera_bsp);
        var tuerca_con_agujero = cilindro_menos_esfera.subtract(agujero_bsp);
        var tuerca_bsp = tuerca_con_agujero.subtract(muescas_bsp);

        // Hacemos el mesh y lo añadimos
        this.mesh = tuerca_bsp.toMesh(this.material_phong);

        this.mesh.position.set(15,0,0);

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

        this.material_normal = new THREE.MeshNormalMaterial();
		this.material_normal.flatShading = false;
		this.material_normal.needsUpdate = true;
	};

	createGUI(gui, titleGui) {
		// Controles para ver y poner en alambres la tuerca
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
        this.material_normal.wireframe = this.guiControls.wireframe;

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

export {Tuerca}