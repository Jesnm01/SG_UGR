class Gasolina extends THREE.Object3D{
    constructor(scene, boundIzquierdo, boundDerecho) {
      super();
      this.posX_inicial = 60;
      this.posZ_inicial = 2;
      this.posY_inicial = 45;
      this.scene = scene;
      this.outOfBound = false;
      this.boundIzquierdo = boundIzquierdo;
      this.boundDerecho = boundDerecho;
      this.cantidad_gasolina_bidon = 3;
      // this.velocidad = 40;

      // Para poder detectar colisiones con un modelo cargado de disco (el bidon de gasolina), tenemos que hacer manualmente un collider Fisico (una caja, o una esfera), y añadirle dentro el modelo
      this.meshGasolina = new THREE.Object3D();
        
      this.createGasolina();
      this.meshGasolina.scale.set(2,2,2);

      // Collider fisico 
      var colliderGeometry = new THREE.SphereGeometry(3, 20, 20);
      var matInvisible = new THREE.MeshBasicMaterial({wireframe: true, opacity: 0.0, transparent: true});
      var matFisico = Physijs.createMaterial(matInvisible, 0.5, 0);
        
      this.colliderGasolina = new Physijs.SphereMesh(
        colliderGeometry,
        matFisico,
        0
      );

      this.colliderGasolina.position.set(this.posX_inicial, this.posY_inicial, this.posZ_inicial);

      this.colliderGasolina.add(this.meshGasolina);

      // Añadir el collider a la escena
      scene.add(this.colliderGasolina);

      var that = this;
      this.colliderGasolina.addEventListener('collision', function (objeto, v, r, n) {
        if(objeto == that.scene.nave.cuerpoFisico){
          if(objeto.position.y > this.position.y){
            objeto.setLinearVelocity(new THREE.Vector3(0.04,-2,0));
          }
          else{
            objeto.setLinearVelocity(new THREE.Vector3(0.04,15,0));
          }

          that.scene.remove(that.colliderGasolina);

          that.scene.nave.litros_gasolina += that.cantidad_gasolina_bidon;
        }
      });
      
    }
  
    //Crear el aspecto
    createGasolina() {
	  var that = this;
      var materialLoader = new THREE.MTLLoader();
      var objectLoader = new THREE.OBJLoader();

      materialLoader.load('../models/Gas Can.mtl', function (materials) {
        objectLoader.setMaterials (materials);
        objectLoader.load('../models/Gas Can.obj', function(object){
            var modelo = object;
            that.meshGasolina.add(modelo);
        },null,null);
      });
    }

    isOutOfBound(){
      return this.outOfBound;
    }


    // Metodo que posiciona la tuberia en su punto inicial de aparicion, teniendo en cuenta el valor aleatorio que se le pasa por parámetro
    setPosicionInicio(posY){
      this.colliderGasolina.position.y = posY;
      this.colliderGasolina.position.x = this.boundDerecho;
      this.colliderGasolina.__dirtyPosition = true;

      this.outOfBound = false;
    }
  
  
    // Metodo que actualiza
    update() {

      // var tiempoActual = Date.now(); //En milisegundos

      // // Lo dividimos por 1000 para pasarlo a segundos (porque es mas intuitivo trabajar con segundos)
      // var segundosTranscurridos = (tiempoActual - this.tiempoAnterior)/1000;

      // this.colliderGasolina.position.x -= this.velocidad * segundosTranscurridos;
      // this.colliderGasolina.__dirtyPosition = true;

      // // No olvidarse de que el tiempo actual de ahora será el tiempo anterior del siguiente frame
      // this.tiempoAnterior = tiempoActual;

      this.meshGasolina.rotation.y += 0.03;
      this.colliderGasolina.__dirtyRotation = true;
      this.colliderGasolina.position.x -= this.scene.velocidad * 0.08;
      this.colliderGasolina.__dirtyPosition = true;
        
      if(!this.outOfBound && this.colliderGasolina.position.x < this.boundIzquierdo){
        this.outOfBound = true;
      }
    }
  }