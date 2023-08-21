
import * as THREE from '../libs/three.module.js'

class Esfera extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la grapadora
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);
    
    //Me creo el material MeshNormalMaterial
    var material = new THREE.MeshNormalMaterial();
    material.flatShading = true;
    material.needsUpdate = true;

    //Me creo la geometria del esfera con los valores iniciales de la GUI
    var geometria = new THREE.SphereBufferGeometry(this.guiControls.radio,this.guiControls.resolucion_vertical,this.guiControls.resolucion_horizontal);
    
    //Un Mesh es una geometria y un material
    this.esfera = new THREE.Mesh(geometria,material);
    this.esfera.position.set(10,60,10);

    this.add (this.esfera);
  }
  
  
  createGUI (gui,titleGui) {
    var that = this;
    
    // Controles para el escalado del esfera
    this.guiControls = new function () {
        this.radio = 3;
        this.resolucion_vertical = 3;
        this.resolucion_horizontal = 3;

         /* Un botón para dejarlo todo en su posición inicial
         Cuando se pulse se ejecutará esta función. 

         En este caso lo que estoy haciendo es crearme otra geometria, con los valores por defecto que me pongo aqui (3,3,3). Y me los vuelvo a declarar en 
         esta funcion reset porque los valores de la funcion de guiControls se van modificando conforme se interactue con la interfaz. Es decir, que si le 
         pongo x=10, y=10, z=10 con los sliders de la interfaz, las variables tienen esos valores ahora, y si intento crear una nueva geometria con esos valores, 
         no voy a cambiar nada, me estaría creando una geometria exactamente igual a la que tengo en ese momento*/
         this.reset = function () {
            this.radio = 3;
            this.resolucion_vertical = 3; 
            this.resolucion_horizontal = 3;
            that.esfera.geometry = new THREE.SphereBufferGeometry(this.radio, this.resolucion_vertical, this.resolucion_horizontal);
        }
    }

    // Se crea un apartado en la interfaz para los controles del esfera
    var folder = gui.addFolder (titleGui);
    // Estas lineas son las que añaden los componentes de la interfaz
    // Las tres cifras indican un valor mínimo, un máximo y el incremento
    folder.add(this.guiControls, 'radio', 1, 20, 0.1).name('Radio: ').onChange(function () {
        that.esfera.geometry = new THREE.SphereBufferGeometry(that.guiControls.radio, that.guiControls.resolucion_vertical, that.guiControls.resolucion_horizontal);
      }).listen();
      folder.add(this.guiControls, 'resolucion_vertical', 1, 30, 1).name('Res. Vertical: ').onChange(function () {
        that.esfera.geometry = new THREE.SphereBufferGeometry(that.guiControls.radio, that.guiControls.resolucion_vertical, that.guiControls.resolucion_horizontal);
      }).listen();
      folder.add(this.guiControls, 'resolucion_horizontal', 1, 30, 1).name('Res Horizontal: ').onChange(function () {
        that.esfera.geometry = new THREE.SphereBufferGeometry(that.guiControls.radio, that.guiControls.resolucion_vertical, that.guiControls.resolucion_horizontal);
      }).listen();

    folder.add (this.guiControls, 'reset').name ('[ Reset ]');
  }
  
  
  update () {
    // Se actualiza el nodo  this.esfera con un valor de rotacion (esto es para que vaya rotando continuamente)
    this.esfera.rotateY(0.01);
  }
}

export { Esfera }
