
import * as THREE from '../libs/three.module.js'

class Torus extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la grapadora
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);
    
    //Me creo el material MeshNormalMaterial
    var material = new THREE.MeshNormalMaterial();
    material.flatShading = true;
    material.needsUpdate = true;

    //Me creo la geometria del torus con los valores iniciales de la GUI
    var geometria = new THREE.TorusBufferGeometry(this.guiControls.radioTorus, this.guiControls.radioTubo, this.guiControls.resolucionTorus, this.guiControls.resolucionTubo);
    
    //Un Mesh es una geometria y un material
    this.torus = new THREE.Mesh(geometria,material);
    this.torus.position.set(40,10,10);

    this.add (this.torus);
  }
  
  
  createGUI (gui,titleGui) {
    var that = this;
    
    // Controles para el escalado del torus
    this.guiControls = new function () {
        this.radioTorus = 3;
        this.radioTubo = 1;
        this.resolucionTorus = 3;
        this.resolucionTubo = 3;

         /* Un botón para dejarlo todo en su posición inicial
         Cuando se pulse se ejecutará esta función. 

         En este caso lo que estoy haciendo es crearme otra geometria, con los valores por defecto que me pongo aqui (3,3,3). Y me los vuelvo a declarar en 
         esta funcion reset porque los valores de la funcion de guiControls se van modificando conforme se interactue con la interfaz. Es decir, que si le 
         pongo x=10, y=10, z=10 con los sliders de la interfaz, las variables tienen esos valores ahora, y si intento crear una nueva geometria con esos valores, 
         no voy a cambiar nada, me estaría creando una geometria exactamente igual a la que tengo en ese momento*/
         this.reset = function () {
            this.radioTorus = 3;
            this.radioTubo = 1; 
            this.resolucionTorus = 3;
            this.resolucionTubo = 3;
            that.torus.geometry = new THREE.TorusBufferGeometry(this.radioTorus, this.radioTubo, this.resolucionTorus, this.resolucionTubo);
        }
    }

    // Se crea un apartado en la interfaz para los controles del torus
    var folder = gui.addFolder (titleGui);
    // Estas lineas son las que añaden los componentes de la interfaz
    // Las tres cifras indican un valor mínimo, un máximo y el incremento
    folder.add(this.guiControls, 'radioTorus', 1, 30, 0.1).name('Radio Torus: ').onChange(function () {
        that.torus.geometry = new THREE.TorusBufferGeometry(that.guiControls.radioTorus, that.guiControls.radioTubo, that.guiControls.resolucionTorus, that.guiControls.resolucionTubo);
      }).listen();
      folder.add(this.guiControls, 'radioTubo', 1, 10, 0.1).name('Radio Tubo: ').onChange(function () {
        that.torus.geometry = new THREE.TorusBufferGeometry(that.guiControls.radioTorus, that.guiControls.radioTubo, that.guiControls.resolucionTorus, that.guiControls.resolucionTubo);
      }).listen();
      folder.add(this.guiControls, 'resolucionTorus', 1, 40, 1).name('Resolucion Torus: ').onChange(function () {
        that.torus.geometry = new THREE.TorusBufferGeometry(that.guiControls.radioTorus, that.guiControls.radioTubo, that.guiControls.resolucionTorus, that.guiControls.resolucionTubo);
      }).listen();
      folder.add(this.guiControls, 'resolucionTubo', 1, 60, 1).name('Resolucion Tubo: ').onChange(function () {
        that.torus.geometry = new THREE.TorusBufferGeometry(that.guiControls.radioTorus, that.guiControls.radioTubo, that.guiControls.resolucionTorus, that.guiControls.resolucionTubo);
      }).listen();

    folder.add (this.guiControls, 'reset').name ('[ Reset ]');
  }
  
  
  update () {
    // Se actualiza el nodo  this.torus con un valor de rotacion (esto es para que vaya rotando continuamente)
    this.torus.rotateY(0.01);
  }
}

export { Torus }
