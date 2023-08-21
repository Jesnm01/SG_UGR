
class Nave extends THREE.Object3D{
      constructor(scene, colores) {
        super();

        this.posY_inicial = 40;
        this.posX_inicial = -25;
        this.posZ_inicial = 2;
        this.litros_gasolina_iniciales = 51;
        this.litros_gasolina = this.litros_gasolina_iniciales;
  
        // Creamos los materiales
        this.createMaterials(colores);
  
        // Creamos los puntos para la geometria del cuerpo de la nave
        var points = this.createpoints();
        
  
        // Creamos la geometria del cuerpo
        var latheGeom = new THREE.LatheGeometry(points, 40, 0, 2*Math.PI);
        latheGeom.rotateZ(-Math.PI / 2);
        latheGeom.rotateX(Math.PI);
        
        this.cuerpoFisico = new Physijs.ConvexMesh(latheGeom, this.matFisicoCuerpo, 0);       
        this.cuerpoFisico.position.y += 3.1;
          
  
        /* * */ /* * */ /* * */ /* * */ /* * */ /* * */ /* * */ /* * */ /* * */ /* * */ /* * */ /* * */ /* * */ /* * */
  
        // Creamos la capsula
        var geom_capsula = new THREE.SphereGeometry(1.5,40,40);
        var capsulaFisica = new Physijs.SphereMesh(geom_capsula, this.matFisicoCapsula);
        capsulaFisica.position.set(2.6,0.5,2.2);
  
        // var geom_capsula_refuerzo = new THREE.SphereGeometry(1.51,40,40);
        // var capsulaRefuerzoFisica = new Physijs.SphereMesh(geom_capsula_refuerzo, this.matFisicoCapsulaRefuerzo);
        // capsulaRefuerzoFisica.position.set(2.6,0.5,2.3);

  
  
        // Creamos el marco de la ventana mediante BSP
        var marco = new THREE.CylinderGeometry(1.5,1.5,0.2,50);
        var hueco_cristal = new THREE.CylinderGeometry(1.25,1.25,0.2,50);

        marco.rotateX(Math.PI / 2);
        marco.rotateX(-THREE.Math.degToRad(15));

        hueco_cristal.rotateX(Math.PI / 2);
        hueco_cristal.rotateX(-THREE.Math.degToRad(15));


        var marcobsp = new ThreeBSP(marco);
        var cristalbsp = new ThreeBSP(hueco_cristal);

        var resultado = marcobsp.subtract(cristalbsp);

        var marco_geom = resultado.toGeometry();

        var marcoFisico = new Physijs.ConvexMesh(marco_geom, this.matFisicoPropulsor);
        marcoFisico.position.set(2.6,0.65,2.9);



        // // Creamos el cristal de la ventana
        var cristal_geom = hueco_cristal.clone();

        var cristalFisico = new Physijs.ConvexMesh(cristal_geom, this.matFisicoCristal);
        cristalFisico.position.set(2.6,0.65,2.9);
  
  
        /* * */ /* * */ /* * */ /* * */ /* * */ /* * */ /* * */ /* * */ /* * */ /* * */ /* * */ /* * */ /* * */ /* * */
  
  
        // Creamos el shape de las patas
        var shape = new THREE.Shape();
  
        // Centrado en el (0,0) para evitar que es collider esté descuadrado y la figura fisica haga cosas raras
        shape.moveTo(-1,-3);
        shape.lineTo(-1,1);
        shape.lineTo(1,3);
        shape.lineTo(1,-1)
        shape.lineTo(-1,-3);
  
        //Opciones de Extrusion
        var extrudeSettings = {
              depth: 0.4,
              bevelEnabled: false,
        }
  
        //Geometria de las patas de soporte
        var geometry_shape = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        geometry_shape.rotateZ(-Math.PI/2);
        // geometry_shape.translate(-1,-3,-0.2); //Esto es para colocar la geometria dentro del collider (si lo tenemos centrado en el (0,0) el shape parece que no hace falta)
  
  
        var pataFisica = new Physijs.BoxMesh(geometry_shape, this.matFisicoCabeza); //El convexMesh deberia de usarse lo mínimo, no está bien optimizado segun la teoria 
        pataFisica.rotation.z +=  THREE.Math.degToRad(12);
        pataFisica.position.set(-3.3,2.8,0);
  
    
        var pataFisica2 = new Physijs.BoxMesh(geometry_shape, this.matFisicoCabeza);
        pataFisica2.rotation.z +=  THREE.Math.degToRad(12);
        pataFisica2.rotation.x += THREE.Math.degToRad(120);
        pataFisica2.position.set(-3.35,-1.7,2.3);
    
  
        var pataFisica3 = new Physijs.BoxMesh(geometry_shape, this.matFisicoCabeza); 
        pataFisica3.rotation.z +=  THREE.Math.degToRad(10);
        pataFisica3.rotation.x -= THREE.Math.degToRad(120);
        pataFisica3.position.set(-3.4,-1.7,-2.3);
  
  
        /* * */ /* * */ /* * */ /* * */ /* * */ /* * */ /* * */ /* * */ /* * */ /* * */ /* * */ /* * */ /* * */ /* * */
  
        // Creamos la cabeza de la nave
        var cabeza_geom = new THREE.CylinderGeometry(0.01,2.58,3,70);
        cabeza_geom.rotateZ(-Math.PI/2);
  
        var cabezaFisica = new Physijs.ConeMesh(cabeza_geom, this.matFisicoCabeza);
        cabezaFisica.position.set(6.6,0,0);
  
  
        /* * */ /* * */ /* * */ /* * */ /* * */ /* * */ /* * */ /* * */ /* * */ /* * */ /* * */ /* * */ /* * */ /* * */
  
  
        // Creamos el propulsor de la nave
        var propulsor_geom = new THREE.CylinderGeometry(2.1,1.7,1,40);
        propulsor_geom.rotateZ(-Math.PI/2);
  
        var propulsorFisico = new Physijs.BoxMesh(propulsor_geom, this.matFisicoPropulsor);
        propulsorFisico.position.set(-5.4,0,0);
  
  
        /* * */ /* * */ /* * */ /* * */ /* * */ /* * */ /* * */ /* * */ /* * */ /* * */ /* * */ /* * */ /* * */ /* * */
  

        // Gomas de aislacion de la nave para la cabeza y el propulsor
        var gomaCabeza_torus = new THREE.TorusGeometry(2.63,0.07,22,50);
        gomaCabeza_torus.rotateY(Math.PI / 2);
        var gomaPropulsor_torus = new THREE.TorusGeometry(2.11,0.03,22,50);
        gomaPropulsor_torus.rotateY(Math.PI / 2);
  
        var gomaCabezaFisica = new Physijs.BoxMesh(gomaCabeza_torus, this.matFisicoPropulsor);
        gomaCabezaFisica.position.x += 5.1;
  
        var gomaPropulsorFisica2 = new Physijs.BoxMesh(gomaPropulsor_torus, this.matFisicoCabeza);
        gomaPropulsorFisica2.position.x += -4.9;
  
  
  
        /* * */ /* * */ /* * */ /* * */ /* * */ /* * */ /* * */ /* * */ /* * */ /* * */ /* * */ /* * */ /* * */ /* * */
  
  
        // Creamos el Fuego del propulsor
        var shape_fuego = new THREE.Shape();
  
        shape_fuego.moveTo(-1.2,1);
        shape_fuego.lineTo(-0.7,-1);
        shape_fuego.lineTo(-0.2,0);
        shape_fuego.lineTo(0,-0.5);
        shape_fuego.lineTo(0.2,0);
        shape_fuego.lineTo(0.7,-1);
        shape_fuego.lineTo(1.2,1);
        shape_fuego.lineTo(-1.2,1);
  
        //Opciones de Extrusion
        var extrudeFuego = {
        depth: 0.4,
        bevelEnabled: false,
        }
  
  
        var geometry_fuego = new THREE.ExtrudeGeometry(shape_fuego, extrudeFuego);
        geometry_fuego.translate(0,0,-0.2); //Aqui con el fuego parece ser que hace falta mover este poco de z (la mitad del depth) para poner bien el collider, cosa que con las patas no
        geometry_fuego.rotateZ(-Math.PI / 2);
  
  
        this.fuegoFisico = new Physijs.ConvexMesh(geometry_fuego, this.matFisicoFuegoAma); //El convexMesh deberia de usarse lo mínimo, no está bien optimizado
        this.fuegoFisico.position.x -= 6.6;
        this.fuegoFisico2 = new Physijs.ConvexMesh(geometry_fuego, this.matFisicoFuegoNar);
        this.fuegoFisico2.position.x -= 6.6;
        this.fuegoFisico3 = new Physijs.ConvexMesh(geometry_fuego, this.matFisicoFuegoRojo);
        this.fuegoFisico3.position.x -= 6.6;
        

        /* * */ /* * */ /* * */ /* * */ /* * */ /* * */ /* * */ /* * */ /* * */ /* * */ /* * */ /* * */ /* * */ /* * */

        // Creamos la jerarquia del modelo de la nave, y la añadimos a la escena
        // this.cuerpoFisico.add(marcoFisico);
        // this.cuerpoFisico.add(cristalFisico);
      //   this.cuerpoFisico.add(capsulaRefuerzoFisica);

        this.cuerpoFisico.add(capsulaFisica);
        this.cuerpoFisico.add(pataFisica);
        this.cuerpoFisico.add(pataFisica2);
        this.cuerpoFisico.add(pataFisica3);
        this.cuerpoFisico.add(cabezaFisica);
        this.cuerpoFisico.add(propulsorFisico);
        this.cuerpoFisico.add(gomaCabezaFisica);
        this.cuerpoFisico.add(gomaPropulsorFisica2);
        this.cuerpoFisico.add(this.fuegoFisico);
        this.cuerpoFisico.add(this.fuegoFisico2);
        this.cuerpoFisico.add(this.fuegoFisico3);
        scene.add(this.cuerpoFisico); 
  
  
  
        // Posicionamos la nave en su punto inicial
        this.cuerpoFisico.position.set(this.posX_inicial,this.posY_inicial,this.posZ_inicial);
        this.cuerpoFisico.__dirtyPosition = true;

  
      
        var that = this;

      // Le ponemos algun que otro listener de colision
        this.cuerpoFisico.addEventListener('collision', function(elOtroObjeto, velocidad, rotacion, normal){
            if((elOtroObjeto.name == "Tuberia") || (elOtroObjeto.name == "Suelo")){
              document.getElementById('game-over-menu').style.display = "block";

              // Ponemos el estado de la aplicacion a DEAD
              scene.applicationState = MyPhysiScene.DEAD;

              that.cuerpoFisico.scale.set(1,0.4,0.7);

              scene.loader.load(
                // resource URL
                '../audio/explosion_corta.mp3',
                
                // onLoad callback
                function ( audioBuffer ) {
                  // set the audio object buffer to the loaded object
                  scene.sonido.setBuffer( audioBuffer );
                  scene.sonido.setVolume(0.10);
                  scene.sonido.setLoop(false);

                  // play the audio
                  scene.sonido.stop();
                  scene.sonido.play();
                },null,null);

              // Llevamos el valor del contador superior, al menu del game over
              var puntuacion = parseInt(document.getElementById("puntuacion").innerHTML);

              document.getElementById("numero-puntuacion-game-over").innerHTML = puntuacion;


              if(puntuacion > parseInt(scene.mejor_puntuacion)){
                scene.mejor_puntuacion = puntuacion;
              }
              document.getElementById("mejor-puntuacion-game-over").innerHTML = scene.mejor_puntuacion;

            }
        });

      }

      // Metodo para resetear la posicion de la nave (se llamará normalmente cuando empiece una nueva partida)
      resetear(){
        this.cuerpoFisico.position.set(this.posX_inicial,this.posY_inicial,this.posZ_inicial);
        this.cuerpoFisico.__dirtyPosition = true;
        this.cuerpoFisico.setLinearVelocity(new THREE.Vector3(0,0,0)); //Por si se reinicia una partida nada mas chocarse con algo, para que la nave no mantenga el impulso de rebote tras chocarse
        this.litros_gasolina = this.litros_gasolina_iniciales;
        this.cuerpoFisico.scale.set(1,1,1);
      }

      getLitrosGasolina(){
        return this.litros_gasolina;
      }
  
      // Creamos el repertorio de materiales que usamos en la nave
      createMaterials(colores){
          
        if (colores == "primero"){
          var mat_cuerpo = new THREE.MeshPhongMaterial({color: 0xe7efde,  shininess: 20 });
          var mat_cabeza = new THREE.MeshPhongMaterial({color: 0xd14b4b, specular: 0xffffff, shininess: 20});
          var mat_cristal_capsula = new THREE.MeshPhongMaterial({color: 0x41e8c4, transparent: false, opacity: 0.9, specular: 0xffffff, shininess: 20});
        }
        else{
          var mat_cuerpo = new THREE.MeshPhongMaterial({color: 0xded646,  shininess: 20 });
          var mat_cabeza = new THREE.MeshPhongMaterial({color: 0x000000, specular: 0xffffff, shininess: 20});
          var mat_cristal_capsula = new THREE.MeshPhongMaterial({color: 0x7c81c2, transparent: false, opacity: 0.9, specular: 0xffffff, shininess: 20});
        }
        
        
        var mat_cristal = new THREE.MeshPhongMaterial({color: 0x36e6d1 });
       
        var mat_cristal_refuerzo = new THREE.MeshPhongMaterial({color: 0x000000, wireframe: true});

        var mat_propulsor = new THREE.MeshPhongMaterial({color: 0x474646, specular: 0xffffff, shininess: 20});
        var mat_fuego_amarillo = new THREE.MeshPhongMaterial({color: 0xffd21c, specular: 0xffffff, shininess: 20 });
        var mat_fuego_naranja = new THREE.MeshPhongMaterial({color: 0xf09a32, specular: 0xffffff, shininess: 20 });
        var mat_fuego_rojo = new THREE.MeshPhongMaterial({color: 0xf04f32, specular: 0xffffff, shininess: 20 });
        mat_cuerpo.side = THREE.DoubleSide;
        mat_cabeza.side = THREE.DoubleSide;
        mat_cristal.side = THREE.DoubleSide;

        this.matNormal = new THREE.MeshNormalMaterial();  //Material de pruebas
        this.matNormal.side = THREE.DoubleSide;

        this.matFisicoCuerpo = Physijs.createMaterial(mat_cuerpo, 0.5, 0);
        this.matFisicoCabeza = Physijs.createMaterial(mat_cabeza, 0.5, 0);
        this.matFisicoCristal = Physijs.createMaterial(mat_cristal, 0.5, 0);

        this.matFisicoCapsula = Physijs.createMaterial(mat_cristal_capsula, 0.5, 0);
        this.matFisicoCapsulaRefuerzo = Physijs.createMaterial(mat_cristal_refuerzo, 0.5, 0);

        this.matFisicoPropulsor = Physijs.createMaterial(mat_propulsor, 0.5, 0);
        this.matFisicoFuegoAma = Physijs.createMaterial(mat_fuego_amarillo, 0.5, 0);
        this.matFisicoFuegoNar = Physijs.createMaterial(mat_fuego_naranja, 0.5, 0);
        this.matFisicoFuegoRojo = Physijs.createMaterial(mat_fuego_rojo, 0.5, 0);


        // var texture = new THREE.TextureLoader().load('../../imgs/ferrari.jpg');
        // var textura_cuerpo = new THREE.MeshPhongMaterial();
        // textura_cuerpo.map = texture;

        // var texturaBase = new THREE.TextureLoader().load('../models/textures/Metal_Pattern_005_basecolor.jpg');
        // var texturaBump = new THREE.TextureLoader().load('../models/textures/Metal_Pattern_005_roughness.jpg');
        // var textura_cuerpo = new THREE.MeshPhongMaterial();
        // textura_cuerpo.map = texturaBase;
        // textura_cuerpo.normalMap = texturaBump;

        // this.matTexturaFisica = Physijs.createMaterial(textura_cuerpo, 0.9,0.3);
      }
  
      // Metodo para crear los puntos del cuerpo de la nave
      createpoints(){
          var points = [];

      // Los -5.125 es para poner el centro de la geometria en el (0,0). Por que si no, luego el collider hace cosas raras al rotar o trasladar la geometria
        points.push (new THREE.Vector3(0,0-5.125,0));
        points.push (new THREE.Vector3(2,0.25-5.125,0));
        points.push (new THREE.Vector3(2.1,0.25-5.125,0));
        points.push (new THREE.Vector3(2.15,0.5-5.125,0));
        points.push (new THREE.Vector3(2.2,0.75-5.125,0));
        points.push (new THREE.Vector3(2.25,1-5.125,0));
        points.push (new THREE.Vector3(2.3,1.25-5.125,0));
        points.push (new THREE.Vector3(2.35,1.5-5.125,0));
        points.push (new THREE.Vector3(2.4,1.75-5.125,0));
        points.push (new THREE.Vector3(2.45,2-5.125,0));
        points.push (new THREE.Vector3(2.5,2.25-5.125,0));
        points.push (new THREE.Vector3(2.55,2.5-5.125,0));
        points.push (new THREE.Vector3(2.6,2.75-5.125,0));
        points.push (new THREE.Vector3(2.65,3-5.125,0));
        points.push (new THREE.Vector3(2.7,3.25-5.125,0));
        points.push (new THREE.Vector3(2.75,3.5-5.125,0));
        points.push (new THREE.Vector3(2.8,3.75-5.125,0));
        points.push (new THREE.Vector3(2.85,4-5.125,0));
        points.push (new THREE.Vector3(2.9,4.25-5.125,0));
        points.push (new THREE.Vector3(2.95,4.5-5.125,0));
        points.push (new THREE.Vector3(3,4.75-5.125,0));
        points.push (new THREE.Vector3(3.05,5-5.125,0));
        points.push (new THREE.Vector3(3.1,5.25-5.125,0));
        points.push (new THREE.Vector3(3.075,5.5-5.125,0));
        points.push (new THREE.Vector3(3.05,5.75-5.125,0));
        points.push (new THREE.Vector3(3.025,6-5.125,0));
        points.push (new THREE.Vector3(3,6.25-5.125,0));
        points.push (new THREE.Vector3(2.975,6.5-5.125,0));
        points.push (new THREE.Vector3(2.95,6.75-5.125,0));
        points.push (new THREE.Vector3(2.925,7-5.125,0));
        points.push (new THREE.Vector3(2.9,7.25-5.125,0));
        points.push (new THREE.Vector3(2.875,7.5-5.125,0));
        points.push (new THREE.Vector3(2.85,7.75-5.125,0));
        points.push (new THREE.Vector3(2.825,8-5.125,0));
        points.push (new THREE.Vector3(2.8,8.25-5.125,0));
        points.push (new THREE.Vector3(2.775,8.5-5.125,0));
        points.push (new THREE.Vector3(2.75,8.75-5.125,0));
        points.push (new THREE.Vector3(2.725,9-5.125,0));
        points.push (new THREE.Vector3(2.7,9.25-5.125,0));
        points.push (new THREE.Vector3(2.675,9.5-5.125,0));
        points.push (new THREE.Vector3(2.65,9.75-5.125,0));
        points.push (new THREE.Vector3(2.625,10-5.125,0));
        points.push (new THREE.Vector3(2.6,10.25-5.125,0));
        points.push (new THREE.Vector3(0,10.2-5.125,0));
  
        return points;
      }
  
      
      // Basicamente se intenta simular una animacion para el fuego
      update () {
          this.fuegoFisico.rotation.x += 1.5;
          this.fuegoFisico.__dirtyRotation = true;
          this.fuegoFisico2.rotation.x += 0.8;
          this.fuegoFisico2.__dirtyRotation = true;
          this.fuegoFisico3.rotation.x += 1.2;
          this.fuegoFisico3.__dirtyRotation = true;
          
      }
    }