
import * as THREE from '../libs/three.module.js'

class Revolucion extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la grapadora
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);
    
    //Me creo el material MeshNormalMaterial para la figura de revolucion
    var material_lathe = new THREE.MeshNormalMaterial();
    material_lathe.side = THREE.DoubleSide; //Esto es para que pinte el lado de fuera y de dentro, de manera que cuando modifique el angulo de la revolucion, se vea por dentro tambien
    material_lathe.flatShading = true;
    material_lathe.needsUpdate = true;

    //Me creo el material LineBasicMaterial para estilizar la linea del perfil
    var material_line = new THREE.LineBasicMaterial({
      color: 0xfbff00,
      linewidth: 3, //Due to limitations of the OpenGL Core Profile with the WebGL renderer on most platforms linewidth will always be 1 regardless of the set value.
    });


    //Tengo que crear un array de vertices y añadirle los puntos de mi perfil
    this.points = [];

    this.points.push(new THREE.Vector3(0,0,0));
    this.points.push(new THREE.Vector3(1.5,0,0));
    this.points.push(new THREE.Vector3(1.5,0.5,0));

    this.points.push(new THREE.Vector3(1.2,0.8,0));
    this.points.push(new THREE.Vector3(0.8,1,0));
    this.points.push(new THREE.Vector3(0.8,2,0));
    this.points.push(new THREE.Vector3(0.6,2.6,0));

    this.points.push(new THREE.Vector3(0.7,2.7,0));
    this.points.push(new THREE.Vector3(0.8,2.9,0));
    this.points.push(new THREE.Vector3(0.7,3.1,0));
    this.points.push(new THREE.Vector3(0.3,3.3,0));
    this.points.push(new THREE.Vector3(0,5.3,0));


    //Para crear la figura por revolucion nos creamos un Mesh con un LatheBufferGeometry y el material
    this.latheObject = new THREE.Mesh(new THREE.LatheBufferGeometry(this.points, 12, 1.57, Math.PI * 2), material_lathe);
    
    //Esta linea esta en el origen de coordenas
    var lineGeometry = new THREE.Geometry();
    lineGeometry.vertices = this.points;
    this.line = new THREE.Line(lineGeometry, material_line);

    //Esta linea esta justo en el contorno de la figura
    var lineGeometry2 = new THREE.Geometry();
    lineGeometry2.vertices = this.points;
    this.line2 = new THREE.Line(lineGeometry2, material_line);

    this.add(this.latheObject);
    this.add(this.line);
    this.add(this.line2);
  }
  
  
  createGUI (gui,titleGui) {
    var that = this;
    
    // Controles para el escalado del latheObject
    this.guiControls = new function () {
        this.resolucion = 12;
        this.angulo = Math.PI * 2;

         /* Un botón para dejarlo todo en su posición inicial
         Cuando se pulse se ejecutará esta función. 

         En este caso lo que estoy haciendo es crearme otra geometria, con los valores por defecto que me pongo aqui. Y me los vuelvo a declarar en 
         esta funcion reset porque los valores de la funcion de guiControls se van modificando conforme se interactue con la interfaz. Es decir, que si le 
         pongo x=10, y=10, z=10 con los sliders de la interfaz, las variables tienen esos valores ahora, y si intento crear una nueva geometria con esos valores, 
         no voy a cambiar nada, me estaría creando una geometria exactamente igual a la que tengo en ese momento*/
         this.reset = function () {
            this.resolucion = 12;
            this.angulo = Math.PI * 2; 
            that.latheObject.geometry = new THREE.LatheBufferGeometry(that.points, this.resolucion, 1.57, this.angulo);
        }
    }

    // Se crea un apartado en la interfaz para los controles del latheObject
    var folder = gui.addFolder (titleGui);
    // Estas lineas son las que añaden los componentes de la interfaz
    // Las tres cifras indican un valor mínimo, un máximo y el incremento
    folder.add(this.guiControls, 'resolucion', 1, 64, 1).name('Resolucion: ').onChange(function () {
      that.latheObject.geometry = new THREE.LatheBufferGeometry(that.points, that.guiControls.resolucion, 1.57, that.guiControls.angulo);
    }).listen();
    folder.add(this.guiControls, 'angulo', 0.1, Math.PI * 2, 0.1).name('Angulo: ').onChange(function () {
      that.latheObject.geometry = new THREE.LatheBufferGeometry(that.points, that.guiControls.resolucion, 1.57, that.guiControls.angulo);
    }).listen();

    folder.add (this.guiControls, 'reset').name ('[ Reset ]');
  }
  
  //Aqui no se muy bien si tengo que poner algo.
  update () {
    
  }
}

export { Revolucion }
