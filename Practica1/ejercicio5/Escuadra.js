// import THREE from 'three'
import * as THREE from '../libs/three.module.js'
import { ThreeBSP } from '../libs/ThreeBSP.js'


class Escuadra extends THREE.Object3D {
	constructor(gui, titleGui) {
		super();

		// Se crea la parte de la interfaz que corresponde a la caja
		// Se crea primero porque otros métodos usan las variables que se definen para la interfaz
		this.createGUI(gui, titleGui);

		// Se crea el material 
		this.createMaterials();

		//Se crean los objetos
        //Se crea el Shape
        this.shape = this.crearShape();
        //Opciones de Extrusion
        this.extrudeSettings = {
            steps: 10,
            depth: 0.1,
            bevelEnabled: true,
            bevelThickness: 1.5,
            bevelSize: 0,
            bevelOffset: 0,
            bevelSegments: 1,
            curveSegments: 20,
        }

        //Geometria del angulo
        var geometry_shape = new THREE.ExtrudeGeometry(this.shape, this.extrudeSettings);

        //Agujeros que van a ser cilindros como troncos de cono
        var geometry_cilindro = new THREE.CylinderGeometry(0.6,1,1,20,10);
        var geometry_cilindro_copia = geometry_cilindro.clone();

        geometry_cilindro_copia.rotateZ((Math.PI)/2);
        geometry_cilindro_copia.translate(0.5,2.5,0);
        
        geometry_cilindro.translate(7.5,0.5+9,0);
        // Este merge es para combinar las 2 geometrias del cilindro en 1 sola. Si quitara este merge, veré que el agujero de abajo no se hace
        // puesto que no le he hecho su BSP, su substract al shape ni nada. En cambio, si lo mergeo con el otro cilindro, van juntos
        geometry_cilindro.merge(geometry_cilindro_copia);


        // Se crean nodos BPS
		var shape_bps = new ThreeBSP(geometry_shape);
		var agujeros_bps = new ThreeBSP(geometry_cilindro);

		//Se construye el arbol binario con las operaciones
		var escuadra_bps = shape_bps.subtract(agujeros_bps);

        // var geometry = escuadra_bps.toGeometry();
        // var bufferGeometry = new THREE.BufferGeometry().fromGeometry(geometry);
        // this.meshresult = new THREE.Mesh(bufferGeometry, this.material_phong);
        // this.add(this.meshresult);

        // Esto es para hacer los pasos anteriores (crear geometria, crear BufferGeometry, y crear Mesh) en un solo metodo
		this.mesh = escuadra_bps.toMesh(this.material_phong);
        this.add(this.mesh);
        		
    }
    
    crearShape(){
        // Creo el Shape
        var shape = new THREE.Shape();

        shape.moveTo(0,0);
        shape.lineTo(0,10);
        shape.lineTo(10,10);
        shape.lineTo(10,9);
        shape.lineTo(4,9);
        shape.quadraticCurveTo(1,9,1,6);
        shape.lineTo(1,0);
        shape.lineTo(0,0);

        return shape;
    };

	createMaterials() {
        this.phongSettings = {
            color: 0x49ef4,
            // wireframe: false,
            specular: 0xffffff, //Blanco
            shininess: 50,
        }

		this.material_phong = new THREE.MeshPhongMaterial(this.phongSettings);
	};

	createGUI(gui, titleGui) {
		// Controles para ver y poner en alambres la escuadra
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

export {Escuadra}