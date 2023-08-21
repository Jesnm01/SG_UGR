class MuroContador extends THREE.Object3D{
    constructor(scene) {
      super();
      this.altura = 20;
      this.scene = scene;

      var matInvisible = new THREE.MeshBasicMaterial({wireframe: true, opacity: 0.0, transparent: true});
      var matFisico = Physijs.createMaterial(matInvisible, 0.5, 0);
       
      var geometria = new THREE.BoxGeometry(1,this.altura,4);
      this.muroFisico = new Physijs.BoxMesh(geometria,matFisico,0);
      this.muroFisico.position.y += 10;
      scene.add(this.muroFisico);

      // Listener para la colision con el muro contador. Lo quitamos de la escena y aumentamos la puntuacion
      var that = this;
      this.muroFisico.addEventListener('collision', function (objeto, v, r, n) {
        if(objeto == that.scene.nave.cuerpoFisico){
            objeto.setLinearVelocity(new THREE.Vector3(0.035,0,0));
                
            that.scene.remove(that.muroFisico);
            that.scene.puntuacion++;
            document.getElementById("puntuacion").innerHTML = that.scene.puntuacion;
        }
      });
    }
  
  
    // Metodo que actualiza
    update() {
      if(this.scene.tuberia_inferior_en_escena != null){
        var tuberia = this.scene.tuberia_inferior_en_escena;

        this.muroFisico.position.set(tuberia.tuberiaFisica.position.x + 15, 
                                     tuberia.tuberiaFisica.position.y + (tuberia.altura)/2 + this.altura/2,
                                     tuberia.tuberiaFisica.position.z);
        this.muroFisico.__dirtyPosition = true;
      }
    }

  }