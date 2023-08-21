
import * as THREE from '../libs/three.module.js'
import * as TWEEN from '../libs/tween.esm.js'


class Bola extends THREE.Object3D {
  constructor(gui, titleGui) {
      super();

      // Creamos la GUI
      this.createGUI(gui, titleGui);

      // Creamos el cilindro transparente
      this.altura_cilindro = 10.0;
      var geomCilindro = new THREE.CylinderGeometry(this.guiControls.radioCilindro, this.guiControls.radioCilindro, this.altura_cilindro, 40.0);
      var materialCilindro = new THREE.MeshNormalMaterial({opacity:0.4, transparent:true});
      this.cilindro = new THREE.Mesh(geomCilindro, materialCilindro);
      this.cilindro.position.set(0.0, this.altura_cilindro/2, 0.0);

      // Nodo para el cilindro
      this.nodoCilindro = new THREE.Object3D();
      this.nodoCilindro.add(this.cilindro);

      // Creamos la bola
      var geomBola = new THREE.SphereGeometry(0.5, 40, 40);
      var matBola = new THREE.MeshNormalMaterial();
      this.bola = new THREE.Mesh(geomBola, matBola);
      this.bola.position.set(this.guiControls.radioCilindro, 0.5, 0.0);

      // Nodo bola
      this.nodoBola = new THREE.Object3D();
      this.nodoBola.add(this.bola);

      // Nodo final
      this.nodoFinal = new THREE.Object3D();
      this.nodoFinal.add(this.nodoCilindro);
      this.nodoFinal.add(this.nodoBola);

      // Origen y destino - Tween
      this.tiempoAnimacion = 1000;

      this.origen = {rotation: 0, x: 0.0, y: 0.0, z: 0.0};
      this.destino = {rotation: Math.PI/2, x: 0.0, y: this.altura_cilindro-1, z: 0.0};

      // Movimiento Tween
      var movimiento = new TWEEN.Tween(this.origen).to(this.destino, this.tiempoAnimacion).onUpdate(() =>{
        this.nodoBola.rotation.y = this.origen.rotation;
        this.nodoBola.position.set(this.origen.x, this.origen.y, this.origen.z);
      });


      // Segunda parte del movimiento
      this.origen2 = {rotation: Math.PI/2, x: 0.0, y: this.altura_cilindro-1, z: 0.0};
      this.destino2 = {rotation: Math.PI, x: 0.0, y: 0.0, z: 0.0};

      var movimiento2 = new TWEEN.Tween(this.origen2).to(this.destino2, this.tiempoAnimacion).onUpdate(()=> {
        this.nodoBola.rotation.y = this.origen2.rotation;
        this.nodoBola.position.set(this.origen2.x, this.origen2.y, this.origen2.z);
      });

       // Tercera parte del movimiento
       this.origen3 = {rotation: Math.PI, x: 0.0, y: 0.0, z: 0.0};
       this.destino3 = {rotation: 4.71239 /*en radianes*/, x: 0.0, y: this.altura_cilindro-1, z: 0.0};
 
       var movimiento3 = new TWEEN.Tween(this.origen3).to(this.destino3, this.tiempoAnimacion).onUpdate(()=> {
         this.nodoBola.rotation.y = this.origen3.rotation;
         this.nodoBola.position.set(this.origen3.x, this.origen3.y, this.origen3.z);
       });

       // Cuarta parte del movimiento
       this.origen4 = {rotation: 4.71239, x: 0.0, y: this.altura_cilindro-1, z: 0.0};
       this.destino4 = {rotation: Math.PI*2, x: 0.0, y: 0.0, z: 0.0};
 
       var movimiento4 = new TWEEN.Tween(this.origen4).to(this.destino4, this.tiempoAnimacion).onUpdate(()=> {
         this.nodoBola.rotation.y = this.origen4.rotation;
         this.nodoBola.position.set(this.origen4.x, this.origen4.y, this.origen4.z);
       });

      // Generamos la animación infinita
      movimiento.chain(movimiento2);
      movimiento2.chain(movimiento3);
      movimiento3.chain(movimiento4);
      movimiento4.chain(movimiento);

      movimiento.start();

      this.add(this.nodoFinal);
  }

  createGUI(gui, titleGui) {
      this.guiControls = new function() {
          this.radioCilindro = 5.0;
      }

      var that = this;
      
      var folder = gui.addFolder (titleGui);
      folder.add (this.guiControls, 'radioCilindro', 5.0, 20.0, 0.5).name ('Radio: ').listen()
          .onChange(function(radio) {
              var nuevaGeom = new THREE.CylinderGeometry(radio, radio,  that.altura_cilindro, 40);
              that.cilindro.geometry = nuevaGeom;
              that.bola.position.set(radio, 0.5, 0.0);
          });
  }

  update() {
      TWEEN.update();
  }
}
export {Bola}

class MyBola extends THREE.Object3D {
  constructor(gui) {
    super();

    this.createGUI(gui);

    this.momento = 0;

    this.variacion = new THREE.Vector2(0,20);
    this.tiempo = new THREE.Vector2(0,1);

    this.subiendo = true;

    this.tiempoAnterior = Date.now();

    this.velocidadRotacion = Math.PI/2;

    var cylinderGeom = new THREE.CylinderGeometry(this.guiControls.radius, this.guiControls.radius, 20, 20);
    var cylinderMat = new THREE.MeshNormalMaterial({opacity:0.35,transparent:true});
    this.cylinder = new THREE.Mesh (cylinderGeom, cylinderMat);
    this.add(this.cylinder);

    var pelotaGeom = new THREE.SphereGeometry(1, 10, 10);
    var materialPelota = new THREE.MeshNormalMaterial();
    this.pelotaA = new THREE.Mesh(pelotaGeom, materialPelota);

    this.pelotaB = new THREE.Object3D();
    this.pelotaB.add(this.pelotaA);

    this.add(this.pelotaB);

  }

  createGUI (gui) {
    // Controles para el tamaño, la orientación y la posición de la caja
    this.guiControls = new function () {
      this.radius = 10;
    }

    // Se crea una sección para los controles de la caja
    var folder = gui.addFolder ("Controles Cilindro :");
    var that = this;
    // Estas lineas son las que añaden los componentes de la interfaz
    // Las tres cifras indican un valor mínimo, un máximo y el incremento
    // El método   listen()   permite que si se cambia el valor de la variable en código, el deslizador de la interfaz se actualice
    folder.add (this.guiControls, 'radius', 5, 20.0, 0.1).name ('Radio : ').onChange(function(value){that.crearNueva()});
  }

  crearNueva(){
    var cylinderGeom = new THREE.CylinderGeometry( this.guiControls.radius,this.guiControls.radius, 20, 20);
    this.cylinder.geometry = cylinderGeom;
  }

  funcionAD(landa){
    return -2 * landa*landa*landa + 3 * landa*landa;
  }

  valor(t){
    var landa = ( t - this.tiempo.x ) / ( this.tiempo.y - this.tiempo.x );
    var valor = this.variacion.x + this.funcionAD(landa) * (this.variacion.y - this.variacion.x);
    return valor;
  }

  update () {
    this.cylinder.position.y = 10;

    this.pelotaA.position.x = this.guiControls.radius;

    var tiempoActual = Date.now();
    var segundos = (tiempoActual - this.tiempoAnterior)/1000;
    this.pelotaB.rotation.y  += segundos * this.velocidadRotacion;

    this.pelotaB.position.y = this.valor(this.momento);

    if(this.momento < this.tiempo.y && this.subiendo){
      this.momento += segundos;
      if(this.momento >= this.tiempo.y) this.subiendo = false;
    }
    else{
      this.momento -= segundos;
      if(this.momento <= this.tiempo.x) this.subiendo = true;
    }

    this.tiempoAnterior = tiempoActual;
  }
}export {MyBola}

class BolaSaltarina extends THREE.Object3D {
  constructor(gui, titleGui) {
    super();

    this.createGUI(gui, titleGui);

    var geometriaCilindro = new THREE.CylinderGeometry(5.0, 5.0, 20.0, 100);
    var materialCilindro = new THREE.MeshNormalMaterial({
      opacity: 0.35,
      transparent: true,
    });

    this.cilindro = new THREE.Mesh(geometriaCilindro,materialCilindro);
    this.cilindro.position.y = 10.0;
    this.add(this.cilindro);

    this.alpha = 0.0;
    this.beta = 0.0;
    this.gamma = 0.0;

    var geometriaEsfera = new THREE.SphereGeometry(1.0,100,100);
    var materialEsfera = new THREE.MeshNormalMaterial();
    this.esfera = new THREE.Mesh(geometriaEsfera,materialEsfera);
    this.esfera.position.set(5.0, 11.5, 0);
    this.add(this.esfera);

  }

  createGUI (gui, titleGui) {
    this.guiControls = new function() {
    this.extension = 1.0;
  }
    
    var folder = gui.addFolder(titleGui);
    folder.add(this.guiControls,'extension', 0.5, 5.0, 0.1).name('Extensión: ').listen();
  }

  update() {
    this.cilindro.scale.x = this.guiControls.extension;
    this.cilindro.scale.z = this.guiControls.extension;
    this.alpha -= 0.05;
    this.beta -= 0.05;
    this.gamma += 0.15;

    this.esfera.position.set(5.0 * Math.cos(this.alpha) * this.guiControls.extension, 8.0 * Math.sin(this.gamma) + 10.0, 5.0 * Math.sin(this.beta) * this.guiControls.extension);
  }
}
export { BolaSaltarina }














class MyBola2 extends THREE.Object3D{
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
}export {MyBola2}