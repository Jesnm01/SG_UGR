
import * as THREE from '../libs/three.module.js'

class Cilindro extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la grapadora
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);
    
    //Me creo el material MeshNormalMaterial
    var material = new THREE.MeshNormalMaterial();
    material.flatShading = true;
    material.needsUpdate = true;

    //Me creo la geometria del cilindro con los valores iniciales de la GUI
    var geometria = new THREE.CylinderBufferGeometry(this.guiControls.radioTop, this.guiControls.radioBottom, this.guiControls.altura, this.guiControls.resolucion);
    
    //Un Mesh es una geometria y un material
    this.cilindro = new THREE.Mesh(geometria,material);
    this.cilindro.position.set(60,-30,10);

    this.add (this.cilindro);
  }
  
  
  createGUI (gui,titleGui) {
    var that = this;
    
    // Controles para el escalado del cilindro
    this.guiControls = new function () {
        this.radioTop = 3;
        this.radioBottom = 3;
        this.altura = 3;
        this.resolucion = 5;

         /* Un botón para dejarlo todo en su posición inicial
         Cuando se pulse se ejecutará esta función. 

         En este caso lo que estoy haciendo es crearme otra geometria, con los valores por defecto que me pongo aqui (3,3,3). Y me los vuelvo a declarar en 
         esta funcion reset porque los valores de la funcion de guiControls se van modificando conforme se interactue con la interfaz. Es decir, que si le 
         pongo x=10, y=10, z=10 con los sliders de la interfaz, las variables tienen esos valores ahora, y si intento crear una nueva geometria con esos valores, 
         no voy a cambiar nada, me estaría creando una geometria exactamente igual a la que tengo en ese momento*/
         this.reset = function () {
            this.radioTop = 3;
            this.radioBottom = 3; 
            this.altura = 3;
            this.resolucion = 5;
            that.cilindro.geometry = new THREE.CylinderBufferGeometry(this.radioTop, this.radioBottom, this.altura, this.resolucion);
        }
    }

    // Se crea un apartado en la interfaz para los controles del cilindro
    var folder = gui.addFolder (titleGui);
    // Estas lineas son las que añaden los componentes de la interfaz
    // Las tres cifras indican un valor mínimo, un máximo y el incremento
    folder.add(this.guiControls, 'radioTop', 1, 20, 0.1).name('Radio Top: ').onChange(function () {
        that.cilindro.geometry = new THREE.CylinderBufferGeometry(that.guiControls.radioTop, that.guiControls.radioBottom, that.guiControls.altura, that.guiControls.resolucion);
      }).listen();
      folder.add(this.guiControls, 'radioBottom', 1, 20, 0.1).name('Radio Bottom: ').onChange(function () {
        that.cilindro.geometry = new THREE.CylinderBufferGeometry(that.guiControls.radioTop, that.guiControls.radioBottom, that.guiControls.altura, that.guiControls.resolucion);
      }).listen();
      folder.add(this.guiControls, 'altura', 1, 40, 0.1).name('Altura: ').onChange(function () {
        that.cilindro.geometry = new THREE.CylinderBufferGeometry(that.guiControls.radioTop, that.guiControls.radioBottom, that.guiControls.altura, that.guiControls.resolucion);
      }).listen();
      folder.add(this.guiControls, 'resolucion', 1, 30, 1).name('Resolucion: ').onChange(function () {
        that.cilindro.geometry = new THREE.CylinderBufferGeometry(that.guiControls.radioTop, that.guiControls.radioBottom, that.guiControls.altura, that.guiControls.resolucion);
      }).listen();

    folder.add (this.guiControls, 'reset').name ('[ Reset ]');
  }
  
  
  update () {
    // Se actualiza el nodo  this.cilindro con un valor de rotacion (esto es para que vaya rotando continuamente)
    this.cilindro.rotateY(0.01);
  }
}

export { Cilindro }
