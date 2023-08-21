
class Tuberia extends THREE.Object3D{
    constructor(scene, altura, boundIzquierdo, boundDerecho, boundSuperior) {
      super();

      // this.altura_entrada_tuberia = 3;
      this.altura = altura /*- this.altura_entrada_tuberia*/;
      this.radio_soporte = 4;
      this.boundIzquierdo = boundIzquierdo;
      this.boundDerecho = boundDerecho;
      this.boundSuperior = boundSuperior;
      this.posicionY_inicial = boundSuperior - altura/2;
      this.outOfBound = false;
      this.scene = scene;
      this.rotado = false;

      // Creamos los materiales
      this.createMaterials();



      // Creamos la tuberia
      this.soporte_tuberia = new THREE.CylinderGeometry(this.radio_soporte,this.radio_soporte,this.altura,60);
      this.tuberiaFisica = new Physijs.CylinderMesh(this.soporte_tuberia, this.matTexturaFisica, 0);
      this.tuberiaFisica.position.y += this.altura/2;


      // var cilindro_arriba = new THREE.CylinderGeometry(this.radio_soporte+1.5,this.radio_soporte+1.5,this.altura_entrada_tuberia,80);
      // var hueco_cilindro = new THREE.CylinderGeometry(this.radio_soporte+0.5,this.radio_soporte+0.5,this.altura_entrada_tuberia-1,80);
      // hueco_cilindro.translate(0,1,0);


      // var cilindro_bsp = new ThreeBSP(cilindro_arriba);
      // var hueco_bsp = new ThreeBSP(hueco_cilindro);

      // var resultado = cilindro_bsp.subtract(hueco_bsp);

      // var tuberia_arriba_geom = resultado.toGeometry();


      // var entradaTuberiaFisica = new Physijs.CylinderMesh(cilindro_arriba, this.matFisicoTuberia);
      // entradaTuberiaFisica.position.set(0,this.altura/2,0);
      // scene.add(entradaTuberiaFisica);


      // this.tuberiaFisica.add(entradaTuberiaFisica);
      this.tuberiaFisica.position.z += 2;


      // Al crear el objeto medimos el tiempo actual medido en milisegundos
      // this.tiempoAnterior = Date.now();

      // Se tiene en un atributo la velocidad expresada como (unidades/segundo)
      // this.velocidad = 30;

    }


    
    createMaterials(){
      var mat_tuberia = new THREE.MeshPhongMaterial({color: 0x0a940d, specular: 0xffffff, shininess: 20 });

      mat_tuberia.side = THREE.DoubleSide;

      this.matFisicoTuberia = Physijs.createMaterial(mat_tuberia, 0.5, 0);

      this.matNormal = new THREE.MeshNormalMaterial(); //Material de prueba
      this.matNormal.side = THREE.DoubleSide;


      var texture = new THREE.TextureLoader().load('../../imgs/tuberia.png');
      var textura_cuerpo = new THREE.MeshPhongMaterial();
      textura_cuerpo.map = texture;

      this.matTexturaFisica = Physijs.createMaterial(textura_cuerpo, 0.9,0.3);

    }

    // Metodo que posiciona la tuberia en su punto inicial de aparicion, distinguiendo si es superior o inferior
    setPosicionInicio(es_tuberia_superior){
      if(es_tuberia_superior){
        this.tuberiaFisica.rotation.x = Math.PI;
        this.tuberiaFisica.__dirtyRotation = true;
        this.tuberiaFisica.position.x = this.boundDerecho;
        this.tuberiaFisica.position.y = this.posicionY_inicial;
        this.tuberiaFisica.__dirtyPosition = true;
      }
      else{
        if(!this.rotado){
          this.tuberiaFisica.rotation.y += Math.PI;
          this.rotado = true;
        }
        
        this.tuberiaFisica.position.x = this.boundDerecho;
        this.tuberiaFisica.__dirtyPosition = true;
      }
      // Volvemos a indicar que la tuberia ya no está outOfBound
      this.outOfBound = false;
      
    }

    isOutOfBound(){
      return this.outOfBound;
    }

    update () {
      
//       var tiempoActual = Date.now(); //En milisegundos
// console.log("Tiempo Anterior: ",this.tiempoAnterior/1000);
// console.log("Tiempo actual: ",tiempoActual/1000);

//       // Lo dividimos por 1000 para pasarlo a segundos (porque es mas intuitivo trabajar con segundos)
//       var segundosTranscurridos = (tiempoActual - this.tiempoAnterior)/1000;

//       this.tuberiaFisica.position.x -= this.velocidad * segundosTranscurridos;
//       this.tuberiaFisica.__dirtyPosition = true;

//       // No olvidarse de que el tiempo actual de ahora será el tiempo anterior del siguiente frame
//       this.tiempoAnterior = tiempoActual;


      this.tuberiaFisica.position.x -= this.scene.velocidad * 0.1;
      this.tuberiaFisica.__dirtyPosition = true;
      if(!this.outOfBound && this.tuberiaFisica.position.x < this.boundIzquierdo){
        this.outOfBound = true;
      }    
    }
  }