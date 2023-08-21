

import * as THREE from '../libs/three.module.js'
import { MTLLoader } from '../libs/MTLLoader.js'
import { OBJLoader } from '../libs/OBJLoader.js'
import * as TWEEN from '../libs/tween.esm.js'

class Recorrido extends THREE.Object3D{
	constructor(gui, titleGui){
	  super();
  
	  this.createGUI(gui, titleGui);
  
	  // Nave espacial
	  var geometria = new THREE.ConeGeometry(1, 4, 3);
	  var textura = new THREE.TextureLoader().load('../imgs/textura-ajedrezada.jpg');
	  var material = new THREE.MeshPhongMaterial({map: textura});
  
	  this.nave_girada = new THREE.Mesh(geometria, material);
	  this.nave = new THREE.Object3D();
  
	  this.nave_girada.rotation.x = Math.PI/2;
  
	  // Recorrido en forma de 8 con un unico vector con el recorrido (tengo que jugar con los porcentajes)
	//   var recorrido = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(20, 10, -20),
	// 				   new THREE.Vector3(25, 0, 0), new THREE.Vector3(10, 5, 10),
	// 				   new THREE.Vector3(0, 0, 0), new THREE.Vector3(-20, -10, -20),
	// 				   new THREE.Vector3(-25, 0, 0), new THREE.Vector3(-10, -5, 10),
	// 				   new THREE.Vector3(0, 0, 0)];


    
    /*Estoy creando cada parte del recorrido con 2 curvas distintas, para no tener que trabajar con los porcentajes de los puntos de origen y destino.
    De esta manera, puedo poner que el origen sea p: 0 y el destino p: 1 en cada parte. 
    Si estiviera todo junto, tendria que poner los porcentajes del recorrido en el que quisiera hacer un tipo de animacion o la otra
    pero eso tiene el problema de que si aumento la distancia a recorrer de alguna de las partes, ya los porcentajes no cuadran y la nave no se detiene en el (0,0,0)
	*/

    // Forma parecida a un 8, con el centro de la animacion en el (0,0,0)
    // this.curve = new THREE.CatmullRomCurve3([
    //     new THREE.Vector3(0, 0, 0), new THREE.Vector3(20, 10, -20),
    //     new THREE.Vector3(25, 0, 0), new THREE.Vector3(10, 5, 10),
    //     new THREE.Vector3(7, 3, 20), new THREE.Vector3(0, 0, 0)
    // ]);
    
    // this.curve2 = new THREE.CatmullRomCurve3([
    //         new THREE.Vector3(0, 0, 0), new THREE.Vector3(-7, -3, -20),
    //         new THREE.Vector3(-20, -10, -20), new THREE.Vector3(-25, 0, 0),
    //         new THREE.Vector3(-10, -5, 10), new THREE.Vector3(0, 0, 0)
    // ]);

    //Forma mas irregular con varias alturas en el eje y
    this.curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0), new THREE.Vector3(20, 10, -20),
        new THREE.Vector3(25, 0, 0), new THREE.Vector3(10, 5, 10),
        new THREE.Vector3(7, 3, 20), new THREE.Vector3(0, 10, 0)
    ]);
    
    this.curve2 = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 10, 0), new THREE.Vector3(-3.5, 13.5, -10), new THREE.Vector3(0, 15, -20),
            new THREE.Vector3(-20, -10, -20), new THREE.Vector3(-25, 0, 0),
            new THREE.Vector3(-10, -5, 10), new THREE.Vector3(0, 0, 0)
    ]);
  
	  var puntos_curva1 = this.curve.getPoints(100);
	  var geometryLine1 = new THREE.BufferGeometry().setFromPoints(puntos_curva1);
  
	  // Para pintar el recorrido
	  var material_linea = new THREE.LineBasicMaterial({color: 0xFF0000});
	  var visible_curve1 = new THREE.Line(geometryLine1, material_linea);


      var puntos_curva2 = this.curve2.getPoints(100);
	  var geometryLine2 = new THREE.BufferGeometry().setFromPoints(puntos_curva2);
  
	  // Para pintar el recorrido
	  var visible_curve2 = new THREE.Line(geometryLine2, material_linea);
  
	  // Añadimos todo a la escena
	  this.nave.add(this.nave_girada);
	  this.add(this.nave);
	  this.add(visible_curve1);
      this.add(visible_curve2);
  
	  // Bucle rápido, 4 segundos en recorrerse
	  var origen1 = {p: 0};
	  var dest1 = {p: 1};
  
	  var bucle_rapido = new TWEEN.Tween(origen1).to(dest1, 4000).easing(TWEEN.Easing.Quadratic.InOut).onUpdate(()=>{
		  var pos = this.curve.getPointAt(origen1.p);
		  this.nave.position.copy(pos);
		  var tangente = this.curve.getTangentAt(origen1.p);
		  pos.add(tangente);
  
		  this.nave.lookAt(pos);
	  });
  
	  var origen2 = {p: 0};
	  var dest2 = {p: 1};
  
	  var bucle_lento = new TWEEN.Tween(origen2).to(dest2, 8000).easing(TWEEN.Easing.Quadratic.InOut).onUpdate(()=>{
		  var pos = this.curve2.getPointAt(origen2.p);
		  this.nave.position.copy(pos);
		  var tangente = this.curve2.getTangentAt(origen2.p);
		  pos.add(tangente);
  
		  this.nave.lookAt(pos);
	  })/*.onComplete(()=>{bucle_rapido.start();})*/; //Encadenamos infinitamente las animaciones así, con los chain de abajo
  
	  bucle_rapido.chain(bucle_lento);
      bucle_lento.chain(bucle_rapido);
	  bucle_rapido.start();
	}
  
	createGUI(gui, titleGui){
	  this.guiControls = new function(){
		this.bucle_izdo = true;
	  }
	}
  
	update(){
	  TWEEN.update();
	}
  }
  export {Recorrido}