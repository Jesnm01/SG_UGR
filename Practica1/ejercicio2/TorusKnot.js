
import * as THREE from '../libs/three.module.js'

class TorusKnot extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la grapadora
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);
    
    //Me creo el material MeshNormalMaterial
    var material = new THREE.MeshNormalMaterial();
    material.flatShading = true;
    material.needsUpdate = true;

    //Me creo la geometria del torusKnot con los valores iniciales de la GUI
    var geometria = new THREE.TorusKnotBufferGeometry(this.guiControls.radioTorusKnot, this.guiControls.radioTubo, this.guiControls.resolucionTorusKnot, this.guiControls.resolucionTubo);
    
    //Un Mesh es una geometria y un material
    this.torusKnot = new THREE.Mesh(geometria,material);
    this.torusKnot.position.set(10,10,40);

    this.add (this.torusKnot);
  }
  
  
  createGUI (gui,titleGui) {
    var that = this;
    
    // Controles para el escalado del torusKnot
    this.guiControls = new function () {
        this.radioTorusKnot = 3;
        this.radioTubo = 1;
        this.resolucionTorusKnot = 30;
        this.resolucionTubo = 8;

         /* Un botón para dejarlo todo en su posición inicial
         Cuando se pulse se ejecutará esta función. 

         En este caso lo que estoy haciendo es crearme otra geometria, con los valores por defecto que me pongo aqui (3,3,3). Y me los vuelvo a declarar en 
         esta funcion reset porque los valores de la funcion de guiControls se van modificando conforme se interactue con la interfaz. Es decir, que si le 
         pongo x=10, y=10, z=10 con los sliders de la interfaz, las variables tienen esos valores ahora, y si intento crear una nueva geometria con esos valores, 
         no voy a cambiar nada, me estaría creando una geometria exactamente igual a la que tengo en ese momento*/
         this.reset = function () {
            this.radioTorusKnot = 3;
            this.radioTubo = 1; 
            this.resolucionTorusKnot = 30;
            this.resolucionTubo = 8;
            that.torusKnot.geometry = new THREE.TorusKnotBufferGeometry(this.radioTorusKnot, this.radioTubo, this.resolucionTorusKnot, this.resolucionTubo);
        }
    }

    // Se crea un apartado en la interfaz para los controles del torusKnot
    var folder = gui.addFolder (titleGui);
    // Estas lineas son las que añaden los componentes de la interfaz
    // Las tres cifras indican un valor mínimo, un máximo y el incremento
    folder.add(this.guiControls, 'radioTorusKnot', 1, 30, 0.1).name('Radio TorusKnot: ').onChange(function () {
        that.torusKnot.geometry = new THREE.TorusKnotBufferGeometry(that.guiControls.radioTorusKnot, that.guiControls.radioTubo, that.guiControls.resolucionTorusKnot, that.guiControls.resolucionTubo);
      }).listen();
      folder.add(this.guiControls, 'radioTubo', 1, 7, 0.1).name('Radio Tubo: ').onChange(function () {
        that.torusKnot.geometry = new THREE.TorusKnotBufferGeometry(that.guiControls.radioTorusKnot, that.guiControls.radioTubo, that.guiControls.resolucionTorusKnot, that.guiControls.resolucionTubo);
      }).listen();
      folder.add(this.guiControls, 'resolucionTorusKnot', 30, 200, 1).name('Resolucion TorusKnot: ').onChange(function () {
        that.torusKnot.geometry = new THREE.TorusKnotBufferGeometry(that.guiControls.radioTorusKnot, that.guiControls.radioTubo, that.guiControls.resolucionTorusKnot, that.guiControls.resolucionTubo);
      }).listen();
      folder.add(this.guiControls, 'resolucionTubo', 8, 60, 1).name('Resolucion Tubo: ').onChange(function () {
        that.torusKnot.geometry = new THREE.TorusKnotBufferGeometry(that.guiControls.radioTorusKnot, that.guiControls.radioTubo, that.guiControls.resolucionTorusKnot, that.guiControls.resolucionTubo);
      }).listen();

    folder.add (this.guiControls, 'reset').name ('[ Reset ]');
  }
  
  
  update () {
    // Se actualiza el nodo  this.torusKnot con un valor de rotacion (esto es para que vaya rotando continuamente)
    this.torusKnot.rotateY(0.01);
  }
}

export { TorusKnot }
