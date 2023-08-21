
import * as THREE from '../libs/three.module.js'

class Barrido extends THREE.Object3D {
  constructor(gui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la grapadora
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui);
    
    //Me creo el shape del contorno que voy a aplicarle el barrido (es como el fantasma de las diapos)
    var shape = this.createShape();

    var path = new THREE.CatmullRomCurve3([
        new THREE.Vector3(20,-5,0),
        new THREE.Vector3(30,5,-10),
        new THREE.Vector3(40,5,-5),
        new THREE.Vector3(50,5,0),
    ]);
 
    this.extrudeSettings = {
        depth: 1,
        steps: 50,
        bevelEnabled: true,
        bevelThickness: 0.6,
        bevelSize: 0.6,
        bevelOffset: 0,
        bevelSegments: 30,
        curveSegments: 50,
        extrudePath: path 
    };

    var material = new THREE.MeshNormalMaterial({
        flatShading: true,
        needsUpdate: true,
      });

    this.geometry = new THREE.ExtrudeBufferGeometry(shape,this.extrudeSettings);
    this.mesh = new THREE.Mesh(this.geometry,material);

    this.mesh.scale.set(0.5,0.5,0.5);
    this.mesh.position.set(20,-5,0);

    this.add(this.mesh);
  }

  createShape(){
    var shape = new THREE.Shape();  
    shape.moveTo(10,10);
    shape.lineTo(10,40);
    shape.bezierCurveTo(15,25,25,25,30,40);
    shape.splineThru([new THREE.Vector2(32,30), new THREE.Vector2(28,20), new THREE.Vector2(30,10)]);
    shape.quadraticCurveTo(20,15,10,10);

    var hole = new THREE.Shape();
    hole.absellipse(16,24,2,3,0,Math.PI * 2);
    var hole2 = new THREE.Shape();
    hole2.absellipse(23,24,2,3,0,Math.PI * 2);

    var hole3 = new THREE.Shape();
    hole3.absarc(20,17,2,Math.PI,Math.PI*2);
    
    shape.holes.push(hole);
    shape.holes.push(hole2);
    shape.holes.push(hole3);

    return shape;
  }
  
  
  createGUI (gui) {
  
  }
  
  
   update () {

  }
}

export { Barrido }
