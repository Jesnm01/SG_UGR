
import * as THREE from '../libs/three.module.js'

class Icosaedro extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la grapadora
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);
    
    //Me creo el material MeshNormalMaterial
    var material = new THREE.MeshNormalMaterial();
    material.flatShading = true;
    material.needsUpdate = true;

    //Me creo la geometria del icosaedro con los valores iniciales de la GUI
    var geometria = new THREE.IcosahedronBufferGeometry(this.guiControls.radio,this.guiControls.detalle);
    
    //Un Mesh es una geometria y un material
    this.icosaedro = new THREE.Mesh(geometria,material);
    this.icosaedro.position.set(10,-30,60);

    this.add (this.icosaedro);
  }
  
  
  createGUI (gui,titleGui) {
    var that = this;
    
    // Controles para el escalado del icosaedro
    this.guiControls = new function () {
        this.radio = 3;
        this.detalle = 0;

         /* Un botón para dejarlo todo en su posición inicial
         Cuando se pulse se ejecutará esta función. 

         En este caso lo que estoy haciendo es crearme otra geometria, con los valores por defecto que me pongo aqui (3,3,3). Y me los vuelvo a declarar en 
         esta funcion reset porque los valores de la funcion de guiControls se van modificando conforme se interactue con la interfaz. Es decir, que si le 
         pongo x=10, y=10, z=10 con los sliders de la interfaz, las variables tienen esos valores ahora, y si intento crear una nueva geometria con esos valores, 
         no voy a cambiar nada, me estaría creando una geometria exactamente igual a la que tengo en ese momento*/
         this.reset = function () {
            this.radio = 3;
            this.detalle = 0; 
            that.icosaedro.geometry = new THREE.IcosahedronBufferGeometry(this.radio, this.detalle);
        }
    }

    // Se crea un apartado en la interfaz para los controles del icosaedro
    var folder = gui.addFolder (titleGui);
    // Estas lineas son las que añaden los componentes de la interfaz
    // Las tres cifras indican un valor mínimo, un máximo y el incremento
    folder.add(this.guiControls, 'radio', 1, 20, 0.1).name('Radio: ').onChange(function () {
        that.icosaedro.geometry = new THREE.IcosahedronBufferGeometry(that.guiControls.radio, that.guiControls.detalle);
      }).listen();
      folder.add(this.guiControls, 'detalle', 0, 3, 1).name('Detalle: ').onChange(function () {
        that.icosaedro.geometry = new THREE.IcosahedronBufferGeometry(that.guiControls.radio, that.guiControls.detalle);
      }).listen();

    folder.add (this.guiControls, 'reset').name ('[ Reset ]');
  }
  
  
  update () {
    // Se actualiza el nodo  this.icosaedro con un valor de rotacion (esto es para que vaya rotando continuamente)
    this.icosaedro.rotateY(0.01);
  }
}

export { Icosaedro }
