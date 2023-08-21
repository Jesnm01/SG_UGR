
import * as THREE from '../libs/three.module.js'

class Cono extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la grapadora
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);
    
    //Me creo el material MeshNormalMaterial
    var material = new THREE.MeshNormalMaterial();
    material.flatShading = true;
    material.needsUpdate = true;

    //Me creo la geometria del cono con los valores iniciales de la GUI
    var geometria = new THREE.ConeBufferGeometry(this.guiControls.radio,this.guiControls.altura,this.guiControls.resolucion);
    
    //Un Mesh es una geometria y un material
    this.cono = new THREE.Mesh(geometria,material);
    this.cono.position.set(0,50,60);

    this.add (this.cono);
  }
  
  
  createGUI (gui,titleGui) {
    var that = this;
    
    // Controles para el escalado del cono
    this.guiControls = new function () {
        this.radio = 3;
        this.altura = 3;
        this.resolucion = 3;

         /* Un botón para dejarlo todo en su posición inicial
         Cuando se pulse se ejecutará esta función. 

         En este caso lo que estoy haciendo es crearme otra geometria, con los valores por defecto que me pongo aqui (3,3,3). Y me los vuelvo a declarar en 
         esta funcion reset porque los valores de la funcion de guiControls se van modificando conforme se interactue con la interfaz. Es decir, que si le 
         pongo x=10, y=10, z=10 con los sliders de la interfaz, las variables tienen esos valores ahora, y si intento crear una nueva geometria con esos valores, 
         no voy a cambiar nada, me estaría creando una geometria exactamente igual a la que tengo en ese momento*/
         this.reset = function () {
            this.radio = 3;
            this.altura = 3; 
            this.resolucion = 3;
            that.cono.geometry = new THREE.ConeBufferGeometry(this.radio, this.altura, this.resolucion);
        }
    }

    // Se crea un apartado en la interfaz para los controles del cono
    var folder = gui.addFolder (titleGui);
    // Estas lineas son las que añaden los componentes de la interfaz
    // Las tres cifras indican un valor mínimo, un máximo y el incremento
    folder.add(this.guiControls, 'radio', 1, 20, 0.1).name('Radio Base: ').onChange(function () {
        that.cono.geometry = new THREE.ConeBufferGeometry(that.guiControls.radio, that.guiControls.altura, that.guiControls.resolucion);
      }).listen();
      folder.add(this.guiControls, 'altura', 1, 20, 0.1).name('Altura: ').onChange(function () {
        that.cono.geometry = new THREE.ConeBufferGeometry(that.guiControls.radio, that.guiControls.altura, that.guiControls.resolucion);
      }).listen();
      folder.add(this.guiControls, 'resolucion', 1, 30, 1).name('Resolucion: ').onChange(function () {
        that.cono.geometry = new THREE.ConeBufferGeometry(that.guiControls.radio, that.guiControls.altura, that.guiControls.resolucion);
      }).listen();

    folder.add (this.guiControls, 'reset').name ('[ Reset ]');
  }
  
  
  update () {
    // Se actualiza el nodo  this.cono con un valor de rotacion (esto es para que vaya rotando continuamente)
    this.cono.rotateY(0.01);
  }
}

export { Cono }
