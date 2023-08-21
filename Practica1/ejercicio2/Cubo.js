
import * as THREE from '../libs/three.module.js'

class Cubo extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la grapadora
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);
    
    //Me creo el material MeshNormalMaterial
    var material = new THREE.MeshNormalMaterial();
    material.flatShading = true;
    material.needsUpdate = true;

    //Me creo la geometria del cubo con los valores iniciales de la GUI
    var geometria = new THREE.BoxBufferGeometry(this.guiControls.sizeX,this.guiControls.sizeY,this.guiControls.sizeZ);
    
    //Un Mesh es una geometria y un material
    this.cubo = new THREE.Mesh(geometria,material);
    this.cubo.position.set(50,50,0);

    this.add (this.cubo);
  }
  
  
  createGUI (gui,titleGui) {
    var that = this;
    
    // Controles para el escalado del cubo
    this.guiControls = new function () {
        this.sizeX = 3;
        this.sizeY = 3;
        this.sizeZ = 3;

         /* Un botón para dejarlo todo en su posición inicial
         Cuando se pulse se ejecutará esta función. 

         En este caso lo que estoy haciendo es crearme otra geometria, con los valores por defecto que me pongo aqui (3,3,3). Y me los vuelvo a declarar en 
         esta funcion reset porque los valores de la funcion de guiControls se van modificando conforme se interactue con la interfaz. Es decir, que si le 
         pongo x=10, y=10, z=10 con los sliders de la interfaz, las variables tienen esos valores ahora, y si intento crear una nueva geometria con esos valores, 
         no voy a cambiar nada, me estaría creando una geometria exactamente igual a la que tengo en ese momento*/
         this.reset = function () {
            this.sizeX = 3;
            this.sizeY = 3; 
            this.sizeZ = 3;
            that.cubo.geometry = new THREE.BoxBufferGeometry(this.sizeX, this.sizeY, this.sizeZ);
        }
    }

    // Se crea un apartado en la interfaz para los controles del cubo
    var folder = gui.addFolder (titleGui);
    // Estas lineas son las que añaden los componentes de la interfaz
    // Las tres cifras indican un valor mínimo, un máximo y el incremento
    folder.add(this.guiControls, 'sizeX', 1, 20, 0.1).name('Tamaño X: ').onChange(function () {
        that.cubo.geometry = new THREE.BoxBufferGeometry(that.guiControls.sizeX, that.guiControls.sizeY, that.guiControls.sizeZ);
      }).listen();
      folder.add(this.guiControls, 'sizeY', 1, 20, 0.1).name('Tamaño Y: ').onChange(function () {
        that.cubo.geometry = new THREE.BoxBufferGeometry(that.guiControls.sizeX, that.guiControls.sizeY, that.guiControls.sizeZ);
      }).listen();
      folder.add(this.guiControls, 'sizeZ', 1, 20, 0.1).name('Tamaño Z: ').onChange(function () {
        that.cubo.geometry = new THREE.BoxBufferGeometry(that.guiControls.sizeX, that.guiControls.sizeY, that.guiControls.sizeZ);
      }).listen();

    folder.add (this.guiControls, 'reset').name ('[ Reset ]');
  }
  
  
  update () {
    // Se actualiza el nodo  this.cubo con un valor de rotacion (esto es para que vaya rotando continuamente)
    this.cubo.rotateY(0.01);
  }
}

export { Cubo }
