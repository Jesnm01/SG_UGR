


import * as THREE from '../libs/three.module.js'
import * as TWEEN from '../libs/tween.esm.js'
import { ThreeBSP } from '../libs/ThreeBSP.js'

class ComeCocos extends THREE.Object3D{
	constructor(gui, titleGui){
		super();	
		
		// Creamos el material
		this.createMaterial();

		// Creamos las geometrias con las que modelar el comecocos mediante CSG
		var geometria_esfera = new THREE.SphereGeometry(2,40,40);
		var geometria_caja_corte = new THREE.BoxGeometry(10,5,10);
		var geometria_caja_corte2 = geometria_caja_corte.clone();
		geometria_caja_corte.translate(0,-2.5,0);
		geometria_caja_corte2.translate(0,2.5,0);

		var geometria_cilindro_agujero = new THREE.CylinderGeometry(0.3,0.3,5,30,30);
		geometria_cilindro_agujero.rotateX(Math.PI/2);
		geometria_cilindro_agujero.rotateY(Math.PI/2);
		geometria_cilindro_agujero.translate(0,1,1);


		var esfera_bsp = new ThreeBSP(geometria_esfera);
		var caja_bsp = new ThreeBSP(geometria_caja_corte);
		var caja2_bsp = new ThreeBSP(geometria_caja_corte2);
		var cilindro_bsp = new ThreeBSP(geometria_cilindro_agujero);

		var semiesfera_sup = esfera_bsp.subtract(caja_bsp);
		var semiesfera_sup_agujero = semiesfera_sup.subtract(cilindro_bsp);

		var semiesfera_inf = esfera_bsp.subtract(caja2_bsp);
		

		this.mesh_arriba = semiesfera_sup_agujero.toMesh(this.material_phong);
		this.mesh_abajo = semiesfera_inf.toMesh(this.material_phong);

		this.meshfinal = new THREE.Object3D();
		this.meshfinal.add(this.mesh_arriba);
		this.meshfinal.add(this.mesh_abajo);

		this.add(this.meshfinal);

		this.rotacion_boca = 0;
		this.abriendo_boca = true;


	  //Forma de la letra P en mayuscula
	  this.curve = new THREE.CatmullRomCurve3([
		  new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -20),
		  new THREE.Vector3(30, 0, -20), new THREE.Vector3(30, 0, 0),
		  new THREE.Vector3(15, 0, 0), new THREE.Vector3(15, 0, 30),
		  new THREE.Vector3(0, 0, 30), new THREE.Vector3(0, 0, 0),
	  ]);
    
  
	  var puntos_curva = this.curve.getPoints(100);
	  var geometryLine = new THREE.BufferGeometry().setFromPoints(puntos_curva);
  
	  // Para pintar el recorrido
	  var material_linea = new THREE.LineBasicMaterial({color: 0xFF0000});
	  var visible_curve = new THREE.Line(geometryLine, material_linea);

	  this.add(visible_curve);

  
	  // Bucle lento, 6 segundos en recorrerse
	  var origen1 = {p: 0};
	  var dest1 = {p: 0.54};
  
	  var bucle_lento = new TWEEN.Tween(origen1).to(dest1, 6000).easing(TWEEN.Easing.Quadratic.InOut).onUpdate(()=>{
		  var pos = this.curve.getPointAt(origen1.p);
		  this.meshfinal.position.copy(pos);
		  var tangente = this.curve.getTangentAt(origen1.p);
		  pos.add(tangente);
  
		  this.meshfinal.lookAt(pos);
	  });
  
	  // Bucle rapido, 4 segundos en recorrerse
	  var origen2 = {p: 0.54};
	  var dest2 = {p: 1};
  
	  var bucle_rapido = new TWEEN.Tween(origen2).to(dest2, 4000).easing(TWEEN.Easing.Quadratic.InOut).onUpdate(()=>{
		  var pos = this.curve.getPointAt(origen2.p);
		  this.meshfinal.position.copy(pos);
		  var tangente = this.curve.getTangentAt(origen2.p);
		  pos.add(tangente);
  
		  this.meshfinal.lookAt(pos);
	  });
  
	  //Encadenamos los bucles para hacer el recorrido infinito
	  bucle_lento.chain(bucle_rapido);
      bucle_rapido.chain(bucle_lento);
	  bucle_lento.start();
	}

	createMaterial(){
		this.phongSettings = {
			color: 0xf0e446,
			wireframe: false,
			specular: 0xffffff, //Blanco
			shininess: 4,
		}
		this.material_phong = new THREE.MeshPhongMaterial(this.phongSettings);
	};
  
	update(){
	  
		//Con estas condiciones abrimos y cerramos la boca
		if(this.abriendo_boca){
			this.mesh_abajo.rotation.x += 0.03;
			this.rotacion_boca += 0.03;
			
			if(this.rotacion_boca > 0.6){
				this.abriendo_boca = false;
			}
		}
		else{
			this.mesh_abajo.rotation.x -= 0.03;
			this.rotacion_boca -=0.03;

			if(this.rotacion_boca < 0.01){
				this.abriendo_boca = true;
			}
		}
		
	  TWEEN.update();
	}
  }
  export {ComeCocos}