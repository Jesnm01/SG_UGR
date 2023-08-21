
import * as THREE from '../libs/three.module.js'

class Corazon extends THREE.Object3D {
  constructor(gui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la grapadora
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui);
    
    //Me creo el shape del corazon
    var shape = new THREE.Shape();

    
    shape.moveTo(0,0);
    //Con el quadraticCurveTo, los 2 primeros argumentos son el punto de control, y los otros 2, es el punto destino
    //Con el bezierCurveTo, tenemos 4 argumentos para puntos de control, y el punto destino
    shape.quadraticCurveTo(5,4,5,7.5);
    shape.bezierCurveTo(5,11.5,0.5,11.5,0,8);
    shape.bezierCurveTo(-0.5,11.5,-5,11.5,-5,7.5);
    shape.quadraticCurveTo(-5,4,0,0);


    var material = new THREE.MeshPhongMaterial({
        color: 0xff0000,
        flatShading: true,
        needsUpdate: true,
      });

    const extrudeSettings = {
        depth: 1,
        steps: 0,
        bevelEnabled: true,
        bevelThickness: 0.6,
        bevelSize: 0.6,
        bevelOffset: 0,
        bevelSegments: 30,
        curveSegments: 50,
    };

    this.geometry = new THREE.ExtrudeBufferGeometry(shape,extrudeSettings);
    this.mesh = new THREE.Mesh(this.geometry,material);

    /* Para poder hacer una rotacion sobre el eje Z (y roten alrededor del (0,0)) y que no se incline durante esa rotacion
    es decir, que siempre esté como mirando hacia +Z, tenemos que aplicarle otra rotacion sobre el eje Z a lo que es la figura en si
    para contrarestar la inclinacion que toma cuando rota sobre el eje Z estando desplazado en el eje X
    Para eso, me creo un Object3D y lo traslado en el eje X, de manera que cuando me haga otro Object3D con este último, cuando rote el nuevo Object3D
    se rotará respecto a la figura desplazada. Mientras que si aplico una rotacion sobre el eje Z al primer Object3D, lo hará respecto a sí misma
    O eso me ha parecido entender. Digamos que es como varias "capas" con la misma figura, pero a cada capa se le aplica una rotacion distinta*/
    this.object3d = new THREE.Object3D();
    this.object3d.position.x = 12;

    this.object3d.add(this.mesh);
 
    this.nodo = new THREE.Object3D();
    this.nodo.add(this.object3d);
 
    this.add(this.nodo);
    //this.add(this.mesh);
  }
  
  
  createGUI (gui) {
    
  }
  
  
  update () {
    this.nodo.rotateZ(0.01);
    this.object3d.rotateZ(-0.01);
    this.mesh.rotateY(0.02);
  }
}

export { Corazon }
