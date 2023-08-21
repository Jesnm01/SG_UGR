
import * as THREE from '../libs/three.module.js'
import * as TWEEN from '../libs/tween.esm.js'


class Bola extends THREE.Object3D {
  constructor(gui, titleGui) {
      super();

      // Creamos la GUI
      this.createGUI(gui, titleGui);

      // Creamos el cilindro transparente
      this.altura_cilindro = 5.0;
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
      this.origen = {rotation: 0, x: 0.0, y: 0.0, z: 0.0};
      this.destino = {rotation: 2*Math.PI, x: 0.0, y: this.altura_cilindro-1, z: 0.0};

      // Movimiento Tween
      var movimiento = new TWEEN.Tween(this.origen).to(this.destino, 4000).onUpdate(() =>{
        this.nodoBola.rotation.y = this.origen.rotation;
        this.nodoBola.position.set(this.origen.x, this.origen.y, this.origen.z);
      });


      // Segunda parte del movimiento
      this.origen2 = {rotation: 0.0, x: 0.0, y: this.altura_cilindro-1, z: 0.0};
      this.destino2 = {rotation: 2*Math.PI, x: 0.0, y: 0.0, z: 0.0};

      var movimiento2 = new TWEEN.Tween(this.origen2).to(this.destino2, 4000).onUpdate(()=> {
        this.nodoBola.rotation.y = this.origen2.rotation;
        this.nodoBola.position.set(this.origen2.x, this.origen2.y, this.origen2.z);
    });

      // Generamos la animación infinita
      movimiento.chain(movimiento2);
      movimiento2.chain(movimiento);

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
