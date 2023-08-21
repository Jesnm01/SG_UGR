
import * as THREE from '../libs/three.module.js'
import { MTLLoader } from '../libs/MTLLoader.js'
import { OBJLoader } from '../libs/OBJLoader.js'
import * as TWEEN from '../libs/tween.esm.js'

class Elipse extends THREE.Object3D {
    constructor(gui) {
      super();
  
      this.createGUI(gui);
  
      this.elipse2D = new THREE.EllipseCurve(
        0,  0,            // ax, aY
        this.guiControls.radioX, this.guiControls.radioY           // xRadius, yRadius
      );
      // this.elipse2D.rotation.x = Math.PI/2;

      // const points = this.elipse2D.getPoints( 50 );
      // const geometry2 = new THREE.BufferGeometry().setFromPoints( points );

      // const material2 = new THREE.LineBasicMaterial( { color : 0xff0000 } );

      // // Create the final object to add to the scene
      // const ellipse = new THREE.Line( geometry2, material2 );

      // this.add(ellipse);

      //Convertimos la elipse2D en una elipse3D (le damos dimension en Z, y la "rotamos" poniendo las coordenadas de 'y' en la 'z' y poniendo la 'y' fija)
      var points = this.elipse2D.getPoints(100);
      var points3D = [];
      points.forEach(e => {points3D.push(new THREE.Vector3(e.x,2.5,e.y))
      });
      this.recorridoAnimacion = new THREE.CatmullRomCurve3(points3D);

      //Creamos la linea que va a seguir la bola (esto no hace falta realmente, es solo para verla en la escena)
      var geometryLine = new THREE.Geometry();
      geometryLine.vertices = this.recorridoAnimacion.getPoints(100);
      this.materialLinea = new THREE.LineBasicMaterial({color: '#000000'});
      this.linea = new THREE.Line (geometryLine, this.materialLinea );
      this.add(this.linea);

  
      //Creamos la shape, lo pasamos a geometria con extrusion y lo añadimos a la escena
      var shape = new THREE.Shape (points);
  
      var extrudeSettings = {
        depth: 5,
        bevelEnabled: false
      };
  
      var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
      geometry.rotateX(-Math.PI/2);
      var material = new THREE.MeshNormalMaterial({opacity:0.4,transparent:true}); //La opacidad solo tiene efecto si el transparent está a true
      this.elipse = new THREE.Mesh( geometry, material );

      this.add(this.elipse);
  
      
      //Creamos la esfera que va a girar
      var sphereGeom = new THREE.SphereGeometry( 1, 30, 30);
      var sphereMat = new THREE.MeshNormalMaterial();
  
      // Ya podemos construir el Mesh
      this.esfera = new THREE.Mesh (sphereGeom, sphereMat);
      this.add(this.esfera);
  
      //Animaciones con TWEEN
      var origen = { p : 0 };
      var destino = { p : 1 };
      // var that = this;
  
      var movimiento = new TWEEN.Tween(origen).to(destino, 4000).repeat(Infinity).onUpdate (()=>{
              var posicion = this.recorridoAnimacion.getPointAt(origen.p);
              this.esfera.position.copy(posicion);
              var tangente = this.recorridoAnimacion.getTangentAt(origen.p);
              posicion.add(tangente);
              this.esfera.lookAt(posicion);
        });
        movimiento.start();
    }

  
    createGUI (gui) {
      this.guiControls = new function () {
        this.radioX = 15;
        this.radioY = 10;
        this.ampliacion
      }
  
      // Se crea una sección para los controles de la elipse
      var folder = gui.addFolder ("Controles Elipse");
      var that = this;
  
      folder.add (this.guiControls, 'radioX', 5.0, 30.0, 0.5).name ('Radio X: ').onChange(()=> {this.crearNueva()});
      folder.add (this.guiControls, 'radioY', 5.0, 30.0, 0.5).name ('Radio Y: ').onChange(()=> {this.crearNueva()});
    }
  
    crearNueva(){
      this.elipse2D = new THREE.EllipseCurve(
        0,  0,            // ax, aY
        this.guiControls.radioX, this.guiControls.radioY          // xRadius, yRadius
      );

      var points = this.elipse2D.getPoints(100);
      var points3D = [];
      points.forEach(e => {points3D.push(new THREE.Vector3(e.x,2.5,e.y))
      });
      this.recorridoAnimacion = new THREE.CatmullRomCurve3(points3D);
    
      var shape = new THREE.Shape (points);
      var extrudeSettings = {
        depth: 5,
        bevelEnabled: false
      };
  
      var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
      geometry.rotateX(-Math.PI/2);
      this.elipse.geometry = geometry;

      var geometryLine = new THREE.Geometry();
      geometryLine.vertices = this.recorridoAnimacion.getPoints(100);
      this.linea.geometry = geometryLine;  
    }
  
    update () {
      TWEEN.update();
    }
}
export {Elipse}


class Figura extends THREE.Object3D{
  constructor(gui){
    super();

    this.desfase = 0;
    this.radio = 1;
    this.altura = 2;
    this.animado = false;

    // Creación de los elementos
    var materialBola = new THREE.MeshNormalMaterial();
    var materialCilindro = new THREE.MeshNormalMaterial({transparent: true, opacity: 0.35});

    this.contenedor = new THREE.Object3D();
    this.contenedor.contenedor = new THREE.Object3D();
    this.contenedor.contenedor.bola = new THREE.Mesh(new THREE.SphereGeometry(0.25, 32, 32),materialBola);
    this.cilindro = new THREE.Mesh(new THREE.CylinderGeometry(this.radio,this.radio,this.altura,32),materialCilindro);

    this.contenedor.contenedor.bola.position.set(this.radio,0,0);

    this.contenedor.add(this.contenedor.contenedor);
    this.contenedor.contenedor.add(this.contenedor.contenedor.bola);
    // Creación de las GUI de los elementos
    this.createGUIBox(gui);

    // Los añadimos a nuestro objeto
    this.add(this.contenedor);
    this.add(this.cilindro);
  }

  createGUIBox(gui){
      var that = this;

      var folder = gui.addFolder('Controles');

      folder.add(this, 'desfase', 0, 5, 0.1)
        .name('Desfase: ')
        .onChange( function(){
          that.cilindro.scale.set(that.desfase + that.radio, 1, 1);
        });

    }

    animate(){
      var that = this;

      var coords = { x: 1 };
      var angulo = { ang: 0 };

      var rotacion = new TWEEN.Tween (angulo).to({ ang: 2 * Math.PI }, 4000).onUpdate( function () 
        {that.contenedor.contenedor.rotation.y = angulo.ang;}
        ).repeat(Infinity);

      rotacion.start();

      var traslacion = new TWEEN.Tween (coords).to({ x: -1 }, 2000).onUpdate(function ()
        {that.contenedor.position.x = coords.x * that.desfase;}
        ).yoyo(true).repeat(Infinity).easing(TWEEN.Easing.Quadratic.InOut);

      traslacion.start();

      TWEEN.update();

      this.animado = true;
    }

    update(){
      if(this.animado){
        TWEEN.update();
      }else{
        this.animate();
      }
    }
}
export {Figura}

class MyBola extends THREE.Object3D {
  constructor(gui, titleGui) {
      super();

      // Creamos la GUI
      this.createGUI(gui, titleGui);

      // Creamos el cilindro transparente
      var geoCilindro = new THREE.CylinderGeometry(this.guiControls.radioCilindro, this.guiControls.radioCilindro, 5.0, 32.0);
      var materialCilindro = new THREE.MeshNormalMaterial({opacity:0.35, transparent:true});
      this.cilindro = new THREE.Mesh(geoCilindro, materialCilindro);
      this.cilindro.position.set(0.0, 2.5, 0.0);

      // Nodo para el cilindro
      this.nodoCilindro = new THREE.Object3D();
      this.nodoCilindro.add(this.cilindro);

      // Creamos la bola
      var geoBola = new THREE.SphereGeometry(0.5, 32.0, 32.0);
      var matBola = new THREE.MeshNormalMaterial();
      this.bola = new THREE.Mesh(geoBola, matBola);
      this.bola.position.set(this.guiControls.radioCilindro+0.5, 0.5, 0.0);

      // Nodo bola
      this.nodoBola = new THREE.Object3D();
      this.nodoBola.add(this.bola);

      // Nodo final
      this.nodoFinal = new THREE.Object3D();
      this.nodoFinal.add(this.nodoCilindro);
      this.nodoFinal.add(this.nodoBola);

      // Origen y destino - Tween
      this.origen = {rotation: 0, x: 0.0, y: 0.0, z: 0.0};
      this.destino = {rotation: 2*Math.PI, x: 0.0, y: 5.0, z: 0.0};

      // Movimiento Tween
      var movimiento = new TWEEN.Tween(this.origen).to(this.destino, 4000);

      var that = this;
      movimiento.onUpdate(function() {
          that.nodoBola.rotation.y = that.origen.rotation;
          that.nodoBola.position.set(that.origen.x, that.origen.y, that.origen.z);
      });

      // Segunda parte del movimiento
      this.origen2 = {rotation: 0.0, x: 0.0, y: 5.0, z: 0.0};
      this.destino2 = {rotation: 2*Math.PI, x: 0.0, y: 0.0, z: 0.0};

      var movimiento2 = new TWEEN.Tween(this.origen2).to(this.destino2, 4000);
      
      movimiento2.onUpdate(function() {
          that.nodoBola.rotation.y = that.origen2.rotation;
          that.nodoBola.position.set(that.origen2.x, that.origen2.y, that.origen2.z);
      });

      // Generamos la animación infinita
      movimiento.chain(movimiento2);
      movimiento2.chain(movimiento);

      movimiento.start();

      this.add(this.nodoFinal);
  }

  createGUI(gui, titleGui) {
      this.guiControls = new function() {
          this.radioCilindro = 1.0;
      }

      var that = this;
      
      var folder = gui.addFolder (titleGui);
      folder.add (this.guiControls, 'radioCilindro', 1.0, 5.0, 0.5).name ('Radio: ').listen()
          .onChange(function(radio) {
              var newGeo = new THREE.CylinderGeometry(radio, radio, 5.0, 32.0);
              that.cilindro.geometry = newGeo;
              that.bola.position.set(radio+0.5, 0.0, 0.0);
          });
  }

  update() {
      TWEEN.update();
  }
}
export {MyBola}

class Bola extends THREE.Object3D{
  constructor(gui,titleGui){
    super();

    this.createGUI(gui,titleGui);

    var geom_cil = new THREE.CylinderGeometry(5, 5, 12, 32);
    var geom_bola = new THREE.SphereGeometry(1, 32, 32);

    var mat_cil = new THREE.MeshNormalMaterial({opacity: 0.35, transparent:true});
    var mat_bola = new THREE.MeshNormalMaterial();
    mat_bola.flatShading = true;
    mat_bola.needsUpdate = true;

    this.cilindro = new THREE.Mesh(geom_cil, mat_cil);
    this.bola_salto = new THREE.Mesh(geom_bola, mat_bola);
    this.bola = new THREE.Object3D();

    this.cilindro.position.y = 6;
    this.bola_salto.position.set(5, 1.5, 0);

    this.add(this.cilindro);
    this.bola.add(this.bola_salto);
    this.add(this.bola);
  }

  createGUI(gui,titleGui){
    this.guiControls = new function(){
      this.radio_cil = 5;

      this.rotacion_bola_x = this.radio_cil;
      this.posicion_bola_y = 1.5;

      this.lim_sup = false;
      this.lim_inf = true;
    }

    var folder = gui.addFolder(titleGui);

    folder.add(this.guiControls, 'radio_cil', 2, 10, 1).name('Radio del cilindro: ').listen();
  }

  update(){
    this.cilindro.scale.set(this.guiControls.radio_cil/5, 1, this.guiControls.radio_cil/5);
    this.guiControls.rotacion_bola_x += 0.01;

    if(!this.guiControls.lim_sup){
      this.guiControls.posicion_bola_y += 0.1;

      if(this.guiControls.posicion_bola_y + 0.1 >= 10.5){
        this.guiControls.lim_sup = true;
        this.guiControls.lim_inf = false;
      }
    }

    else if(!this.guiControls.lim_inf){
      this.guiControls.posicion_bola_y -= 0.1;

      if(this.guiControls.posicion_bola_y - 0.1 <= 1.5){
        this.guiControls.lim_sup = false;
        this.guiControls.lim_inf = true;
      }
    }

    this.bola_salto.position.set(this.guiControls.radio_cil, this.guiControls.posicion_bola_y, 0);
    this.bola.rotation.y = this.guiControls.rotacion_bola_x;
  }
}
export {Bola}