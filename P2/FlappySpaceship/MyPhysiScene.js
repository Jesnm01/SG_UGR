class MyPhysiScene extends Physijs.Scene {

  constructor() {
    // El gestor de hebras
    Physijs.scripts.worker = './physijs/physijs_worker.js'
    // El motor de física de bajo nivel, en el cual se apoya Physijs
    Physijs.scripts.ammo = './ammo.js'
    super();

    // Variables importantes de la escena
    this.applicationState = MyPhysiScene.MENU;
    this.limite_superior_pantalla = 90; //Estos valores son para una posicion concreta de la camara y un lookAt (se ha sacado probando)
    this.limite_izquierdo_pantalla = -60;
    this.limite_derecho_pantalla = 60;
    this.hueco_para_nave = 20;
    this.num_tuberias = 10;
    this.puntuacion = 0;
    this.mejor_puntuacion = 0;
    this.velocidad = parseFloat(document.getElementById("myRange").value);
    this.ruta_fondo = '../imgs/fondo_extended.png';
    this.cambio_fondo = false;
    this.colores = "primero";


    // Crear el visualizador, pasándole el lienzo sobre el que realizar los renderizados.
    this.renderer = this.createRenderer();

    // Se establece el valor de la gravedad, negativo, los objetos caen hacia abajo
    this.setGravity(new THREE.Vector3(0,-150,0));


    
    // Creamos un display para visualizar estadísticas de rendiemiento
    this.stats = new Stats();
    document.body.appendChild(this.stats.dom);


    // Se crean el suelo y el background
    this.createGround ();
    this.createBackGround();

    // Se crean y añaden luces a la escena
    this.createLights();

    // Creamos la camara
    this.createCamera();


    // Creamos la nave
    this.nave = new Nave(this, this.colores);


    // Creamos las estructuras de datos para almacenar el repertorio de tuberias
    this.tuberias_inferiores = [];
    this.tuberias_superiores = [];
    this.tuberia_inferior_en_escena = null;
    this.tuberia_superior_en_escena = null;

    this.createTuberias(this.num_tuberias);

    // Creamos el objeto coleccionable: gasolina
    this.gasolina = new Gasolina(this, this.limite_izquierdo_pantalla, this.limite_derecho_pantalla);

    // Creamos el muro invisible contador
    this.muroContador = new MuroContador(this, this.limite_izquierdo_pantalla, this.limite_derecho_pantalla);


    // console.log(THREE.REVISION);

    // Iniciamos la musica principal del juego 
    this.iniciarAudio();
  }

  iniciarAudio(){
    // instantiate a listener
    var audioListener = new THREE.AudioListener();

    // add the listener to the camera
    this.camera.add( audioListener );

    // instantiate audio object
    this.sonido = new THREE.Audio( audioListener );

    // add the audio object to the scene
    this.add( this.sonido );

    // instantiate a loader
    this.loader = new THREE.AudioLoader();

    var that = this;
    // load a resource
    this.loader.load(
      // resource URL
      '../audio/Pamgaea.mp3',
      
      // onLoad callback
      function ( audioBuffer ) {
        // set the audio object buffer to the loaded object
        that.sonido.setBuffer( audioBuffer );
        that.sonido.setVolume(0.25);
        that.sonido.setLoop(true);

        // play the audio
        that.sonido.play();
      },null,null);
  }



  // Metodo para crear el conjunto completo de tuberias, tanto inferiores como superiores
  createTuberias(n){
    var element1 = null;
    var element2 = null;
    var random_abajo = null;
    var random_arriba = null;
    for(var i = 0; i < n; i++){
      random_abajo = getRandomInt(10,60); //Altura minima=10; Altura maxima=60 para dejar un hueco de unas 20 unidades para que pase la nave. (90 - 10 - 60 = 20)
      random_arriba = this.limite_superior_pantalla - random_abajo - this.hueco_para_nave;

      // Tuberia de abajo
      element1 = new Tuberia(this, random_abajo, this.limite_izquierdo_pantalla, this.limite_derecho_pantalla, this.limite_superior_pantalla);
      element1.tuberiaFisica.name = "Tuberia";

      // Tuberia complementaria de arriba
      element2 = new Tuberia(this, random_arriba, this.limite_izquierdo_pantalla, this.limite_derecho_pantalla, this.limite_superior_pantalla);
      element2.tuberiaFisica.name = "Tuberia";


      // Las insertamos en los arrays correspondientes
      this.tuberias_inferiores.push(element1);
      this.tuberias_superiores.push(element2);
      
    }
  }

  createGround () {    
    var geomSuelo = new THREE.BoxGeometry (150,20,15);
    
    // El material se hará con una textura
    var texture = new THREE.TextureLoader().load('../../imgs/suelo.png');
    var materialGround = new THREE.MeshPhongMaterial ({map: texture});

    var matFisico = Physijs.createMaterial(materialGround, 0.9,0.3);

    this.sueloFisico = new Physijs.BoxMesh(geomSuelo, matFisico, 0);
    this.sueloFisico.position.y -= 10;
    this.sueloFisico.name = "Suelo";

    
    // Que no se nos olvide añadirlo a la escena, que en este caso es this
    this.add (this.sueloFisico);
  }

  createBackGround () {
    var geometryBackGround = new THREE.BoxGeometry (120,90,1);
    geometryBackGround.translate(0,45,-5);
    
    var texture = new THREE.TextureLoader().load(this.ruta_fondo);
    var materialBackGround = new THREE.MeshPhongMaterial ({map: texture});
    
    this.background = new THREE.Mesh (geometryBackGround, materialBackGround);
    
    // Que no se nos olvide añadirlo a la escena, que en este caso es this
    this.add (this.background);
  }

  
  // Codigo basado en este hilo de stackoverflow: https://stackoverflow.com/questions/29884485/threejs-canvas-size-based-on-container
  createRenderer() {
    // Se recibe el lienzo sobre el que se van a hacer los renderizados. Un div definido en el html.

    // Se instancia un Renderer WebGL con el lienzo sobre el que se van a hacer los redenrizados (en este caso, un elemento html <canvas>)
    var renderer = new THREE.WebGLRenderer({canvas: document.querySelector("canvas")});

    // Se establece un color de fondo en las imágenes que genera el render
    renderer.setClearColor(new THREE.Color(0x474B4E), 1.0);

    // Se establece el tamaño, se aprovecha la totalidad de la ventana del navegador
    // renderer.setSize(window.innerWidth, window.innerHeight);

    // La visualización se muestra en el lienzo recibido
    // $(myCanvas).append(renderer.domElement);

    return renderer;
  }

  // Metodo para ajustar el viewport de la escena al tamaño que fijemos para el canvas mediante el html y css
  resizeCanvasToDisplaySize(camera) {
    const canvas = this.renderer.domElement;
    // look up the size the canvas is being displayed
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    // adjust displayBuffer size to match
    if (canvas.width !== width || canvas.height !== height) {
      // you must pass false here or three.js sadly fights the browser
      this.renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
  }


  // Se procesa el impulso de la nave cuando se pulse el ratón en la pantalla
  onMouseDown (event) {
    // Le damos impulso a la nave solamente cuando pulsemos el boton izquierdo del raton (event.which)
    // Si applicationState es JUGANDO, habilitamos el impulso. En otro caso, no hacemos nada, porque estaremos en el menu o muertos
    if(this.applicationState == MyPhysiScene.JUGANDO){
      if(event.which == 1){
        this.impulsarNave();
      }
    }
  }

  // En esta funcion comprobamos que estamos jugando, y si lo estamos, y el evento del listener es una de las 2 teclas (W, flecha arriba) que se haga impulso)
  onKeyDown(event){
    if(this.applicationState == MyPhysiScene.JUGANDO){
      if((event.code == "KeyW")  || (event.code == "ArrowUp") || (event.code == "Space")){ //La barra espaciadora da problemas porque los navegadores mantienen el focus en el boton de Jugar tras pulsarle con el raton, y cuando pensamos que vamos a darle un impulo a la nave, estamos dandole al boton de Jugar de nuevo, reseteando la partida. Por eso, quitamos el boton una vez estamos jugando
        this.impulsarNave();
      }
    }
  }

  // Funcion para aplicarle un impulso a la nave 
  impulsarNave(){
    var fuerza_impulso = 1600;
    var direccion_impulso = new THREE.Vector3(0,1,0);
    var effect = direccion_impulso.normalize().multiplyScalar(fuerza_impulso);
    this.nave.cuerpoFisico.applyCentralImpulse(effect);
  }


  createLights () {
    // Se crea una luz ambiental, evita que se vean complentamente negras las zonas donde no incide de manera directa una fuente de luz
    // La luz ambiental solo tiene un color y una intensidad
    // Se declara como   var   y va a ser una variable local a este método
    //    se hace así puesto que no va a ser accedida desde otros métodos
    var ambientLight = new THREE.AmbientLight(0xccddee, 1);
    // La añadimos a la escena
    this.add (ambientLight);
    
    // Se crea una luz focal que va a ser la luz principal de la escena
    // La luz focal, además tiene una posición, y un punto de mira
    // Si no se le da punto de mira, apuntará al (0,0,0) en coordenadas del mundo
    // En este caso se declara como   this.atributo   para que sea un atributo accesible desde otros métodos.
    this.spotLight = new THREE.SpotLight(0xffffff, 0.1);
    this.spotLight.position.set( 100, 40, 80 );
    this.add (this.spotLight);

    this.spotLight2 = new THREE.SpotLight(0xffffff, 0.1);
    this.spotLight2.position.set( 50, 40, 100 );
    this.add (this.spotLight2);
  }

  createCamera () {
    // Para crear una cámara le indicamos
    //   El ángulo del campo de visión vértical en grados sexagesimales
    //   La razón de aspecto ancho/alto
    //   Los planos de recorte cercano y lejano
    this.camera = new THREE.PerspectiveCamera(45, 2, 1, 1000); //la razon de aspecto aqui nos da igual cual sea, porque en el metodo de resizeCanvasToDisplaySize ajustamos la razon de aspecto de la camara dependiendo del tamaño del canvas
    // También se indica dónde se coloca
    this.camera.position.set (0, 37, 120); //(0, 37, 120)

    // Y hacia dónde mira
    var look = new THREE.Vector3 (0,37,0);
    this.camera.lookAt(look);
    this.add (this.camera);


    // Para el control de cámara usamos una clase que ya tiene implementado los movimientos de órbita
    //this.cameraControl = new THREE.TrackballControls (this.camera, this.renderer.domElement);
    
    // Se configuran las velocidades de los movimientos
    // this.cameraControl.rotateSpeed = 3;
    // this.cameraControl.zoomSpeed = 2;
    // this.cameraControl.panSpeed = 0.5;
    // // Debe orbitar con respecto al punto de mira de la cámara
    // this.cameraControl.target = look;
  }

  getCamera () {
    // En principio se devuelve la única cámara que tenemos
    // Si hubiera varias cámaras, este método decidiría qué cámara devuelve cada vez que es consultado
    return this.camera;
  }


  aniadirTuberias(){
    // Vamos a tener solo 1 tuberia en escena. Mientras tanto, que no añada más.
    if(this.tuberia_inferior_en_escena == null){
      var tuberia_para_mostrar = getRandomInt(0,this.num_tuberias);

      this.tuberia_inferior_en_escena = this.tuberias_inferiores[tuberia_para_mostrar];
      this.tuberia_superior_en_escena = this.tuberias_superiores[tuberia_para_mostrar];

      this.tuberia_inferior_en_escena.setPosicionInicio(false);
      this.tuberia_superior_en_escena.setPosicionInicio(true);
      
      this.add(this.tuberia_inferior_en_escena.tuberiaFisica);
      this.add(this.tuberia_superior_en_escena.tuberiaFisica);


      this.add(this.muroContador.muroFisico); 
    }
  }

  retirarTuberias(){
    // Lo eliminamos de la escena y poner la variable a null
    this.remove(this.tuberia_inferior_en_escena.tuberiaFisica);
    this.tuberia_inferior_en_escena = null;

    this.remove(this.tuberia_superior_en_escena.tuberiaFisica);
    this.tuberia_superior_en_escena = null;        
  }

  // Reseteamos la posicion de la gasolina, esté donde esté en la escena en ese momento
  resetearGasolina(){
    this.remove(this.gasolina.colliderGasolina);
    this.aniadirGasolina();
  }

  // Añadimos la gasolina de nuevo a la escena con una altura aleatoria en dicho rango
  aniadirGasolina(){

    var posicionY_gasolina = getRandomInt(10, 80);

    this.add(this.gasolina.colliderGasolina);
    
    this.gasolina.setPosicionInicio(posicionY_gasolina);
    this.gasolina.colliderGasolina.__dirtyPosition = true;

  }

  // Retiramos la gasolina de la escena cuando llega al bound izquierdo
  retirarGasolina(){
    if(this.gasolina.isOutOfBound()){
      this.remove(this.gasolina.colliderGasolina);
    }
  }



  // Recolocamos todos los elementos de la escena en su sitio de inicio
  resetearEscena(){
    this.nave.resetear();
    this.retirarTuberias();
    this.resetearGasolina();
    document.getElementById("game-over-menu").style.display = "none";
    this.puntuacion = 0;
    document.getElementById("puntuacion").innerHTML = this.puntuacion;

    if(this.applicationState == MyPhysiScene.JUGANDO){
      this.sonido.play();
    }
  }

  

  update () {
    //Le decimos al renderizador "visualiza la escena que te indico usando la cámara que te estoy pasando"
    this.resizeCanvasToDisplaySize(this.getCamera());
    this.renderer.render (this, this.getCamera());



    // Esto es para intentar controlar que la nave no se vaya por encima de las tuberias. Lo que tiene, es que si nos mantenemos mucho en la zona de gravedad elevada, luego la nave baja muy rapido y es complicado que no se la pegue con el suelo
    if(this.nave.cuerpoFisico.position.y > 90){
      this.setGravity(new THREE.Vector3(0,-500,0));
    }
    else{
      this.setGravity(new THREE.Vector3(0,-100,0))
    }

    // Si no estamos muertos, que se muevan las tuberias.
    if(this.applicationState != MyPhysiScene.DEAD) { //Ponemos esto y no simplemente applicationState = MyPhysiscene.JUGANDO, para que tambien se muevan las cosas en el menu
      this.aniadirTuberias();

      // Esto va actualizando (moviendo) continuamente las tuberias que están en escena
      this.tuberia_inferior_en_escena.update();
      this.tuberia_superior_en_escena.update();

      if(this.tuberia_inferior_en_escena.isOutOfBound()){
        this.retirarTuberias();
      }

      if(this.gasolina.isOutOfBound()){
        this.aniadirGasolina();
      }

      this.retirarGasolina();
    }
    
    
    // Se actualiza la posición de la cámara según su controlador
    //this.cameraControl.update();

    if(this.applicationState != MyPhysiScene.DEAD){
      if(this.nave.getLitrosGasolina() == 0){
        this.applicationState = MyPhysiScene.OUT_OF_FUEL;
      }
    }
   
    
    // Se actualiza el resto del modelo siempre y cuando no se haya chocado
    if(this.applicationState != MyPhysiScene.DEAD){
      this.nave.update();
      this.gasolina.update();
      this.muroContador.update();
    }

    
    // Este método debe ser llamado cada vez que queramos visualizar la escena de nuevo.
    // Literalmente le decimos al navegador: "La próxima vez que haya que refrescar la pantalla, llama al método que te indico".
    // Si no existiera esta línea,  update()  se ejecutaría solo la primera vez.
    requestAnimationFrame(() => this.update())

    this.simulate(); //Habilitamos el motor de fisicas
    this.stats.update(); //Actualizamos los valores del display de rendimiento
  }


  
} //Fin clase MyPhysijsScene


// Estados de la aplicacion
MyPhysiScene.MENU = 0;
MyPhysiScene.JUGANDO = 1;
MyPhysiScene.DEAD = 2;
MyPhysiScene.OUT_OF_FUEL = 3;

// Retorna un entero aleatorio entre min (incluido) y max (excluido)
// ¡Usando Math.round() dará una distribución no-uniforme!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


$(function () {
  
  // Se instancia la escena pasándole el  div  que se ha creado en el html para visualizar
  var scene = new MyPhysiScene();

  /* Listeners */

  // Cuando se pulse el boton de Jugar, se quitan los 2 botones, se resetea toda la escena y se empieza a jugar
  document.getElementById("boton-empezar").addEventListener("click", function(){
   
    document.getElementById("boton-empezar").style.display = "none";
    document.getElementById("boton-escenarios").style.display = "none";
    document.getElementById("slidecontainer").style.display = "none";

    // Ponemos el estado de la aplicacion a JUGANDO y le ponemos masa a la nave para que empiece a caer
    scene.applicationState = MyPhysiScene.JUGANDO;
    
    // Cambiamos la musica para cuando estemos jugando
    // load a resource
    scene.loader.load(
      // resource URL
      '../audio/Voxel Revolution.mp3',
      
      // onLoad callback
      function ( audioBuffer ) {
        // set the audio object buffer to the loaded object
        scene.sonido.setBuffer( audioBuffer );
        scene.sonido.setVolume(0.25);
        scene.sonido.setLoop(true);

        // play the audio
        scene.sonido.stop();
        scene.sonido.play();
      },null,null);

    // Aqui ponemos todos los elementos en su posicion inicial
    scene.resetearEscena();
    
    scene.nave.cuerpoFisico.mass = 35;

  });

  // Cuando se pulse el boton de Volver a jugar, que se resetee toda la escena y se empieza a jugar
  document.getElementById("boton-volver-empezar").addEventListener("click", function(){

    // Ponemos el estado de la aplicacion a JUGANDO y le ponemos masa a la nave para que empiece a caer
    scene.applicationState = MyPhysiScene.JUGANDO;

    scene.loader.load(
      // resource URL
      '../audio/Voxel Revolution.mp3',
      
      // onLoad callback
      function ( audioBuffer ) {
        // set the audio object buffer to the loaded object
        scene.sonido.setBuffer( audioBuffer );
        scene.sonido.setVolume(0.25);
        scene.sonido.setLoop(true);

        // play the audio
        scene.sonido.stop();
        scene.sonido.play();
      },null,null);

    // Aqui ponemos todos los elementos en su posicion inicial
    scene.resetearEscena();
    
    scene.nave.cuerpoFisico.mass = 35;

  });

   // Cuando se pulse el boton de Inicio, volvemos al Menu, donde están los 2 botones, y el escenario se mueve sin colisiones
   document.getElementById("boton-ir-a-menu").addEventListener("click", function(){

    document.getElementById("boton-empezar").style.display = "block";
    document.getElementById("boton-escenarios").style.display = "block";
    document.getElementById("slidecontainer").style.display = "block";

    // Ponemos el estado de la aplicacion a MENU y no le ponemos masa a la nave, para que se mantenga en el aire
    scene.applicationState = MyPhysiScene.MENU;

    // Volvemos a poner la musica del menu
    scene.loader.load(
      // resource URL
      '../audio/Pamgaea.mp3',
      
      // onLoad callback
      function ( audioBuffer ) {
        // set the audio object buffer to the loaded object
        scene.sonido.setBuffer( audioBuffer );
        scene.sonido.setVolume(0.25);
        scene.sonido.setLoop(true);

        // play the audio
        scene.sonido.stop();
        scene.sonido.play();
      },null,null);


    // Aqui ponemos todos los elementos en su posicion inicial
    scene.resetearEscena();

    scene.nave.cuerpoFisico.mass = 0;
    
  });

  document.getElementById("boton-escenarios").addEventListener("click", function(){

    if (!scene.cambio_fondo){
      scene.ruta_fondo = '../imgs/fondo_extended_noche.png';
      scene.cambio_fondo = true;
      scene.colores = "segundo";
      
      scene.remove(scene.nave.cuerpoFisico);
      scene.nave = new Nave(scene, scene.colores);
    }
    else{
      scene.ruta_fondo = '../imgs/fondo_extended.png';
      scene.cambio_fondo = false;
      scene.colores = "primero";

      
      scene.remove(scene.nave.cuerpoFisico);
      scene.nave = new Nave(scene, scene.colores);
    }
    scene.createBackGround();


    // Aqui ponemos todos los elementos en su posicion inicial
    scene.resetearEscena();
    
  });

  document.getElementById("myRange").addEventListener("change", function(){

    scene.velocidad = parseFloat(this.value);
    
  });

  
  // Se añade el listener para cuando se haga click con el raton
  window.addEventListener ("mousedown", (event) => scene.onMouseDown(event), true);

  // Se añade el listener para cuando se pulse una tecla
  window.addEventListener('keydown', (event) => scene.onKeyDown(event), true);
  
  // Que no se nos olvide, la primera visualización.
  scene.update();

  // Cada x milisegundos, se va restando gasolina a la nave
  setInterval(function() {
    if(scene.applicationState == MyPhysiScene.JUGANDO){
      scene.nave.litros_gasolina -= 1;
      // scene.nave.litros_gasolina_html.innerHTML = scene.nave.litros_gasolina.toFixed(2);
      document.getElementById("litros-gasolina").innerHTML = scene.nave.litros_gasolina.toFixed(2);
    }
  }, 1000);
});
