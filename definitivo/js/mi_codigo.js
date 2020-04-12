//Creación de variables globales
var myGamePiece;
var myBackground;
var myObstacle;
var myObstacle2;
var myObstacle3;
var myObstacle3;
var myObstacle4;
var myMusic;
var myScore;
var vidario;
var scoreRecord=[];
var i;
var record;

//Función que obtiene del DOM los elementos que pertenezcan a la clase pestana y cabecera. Recorre
//las pestañas y si una de ellas incluye en su clase el valor p-activa borra dicho valor tanto
//de la cabecera como de la pestaña y lo incluye en la cabecera y pestaña que corresponda.
function mostrarPestana(n){
  var pestanas=document.getElementsByClassName("pestana");
  var cabecera=document.getElementsByClassName("cabecera");
  for(i=0;i<pestanas.length;i++){
    if(pestanas[i].className.includes("p-activa")){
      pestanas[i].className=pestanas[i].className.replace("p-activa","");
      cabecera[i].className=cabecera[i].className.replace("c-activa","");
      break;
    }
  }
  pestanas[n].className+=" p-activa";
  cabecera[n].className+=" c-activa";
}

//Función identica a mostrarPestana() pero que se usa para las pestañas
// que a su vez se encuentran dentro de una oestaña principal.
function mostrarSubPestana(n){
  var subpestanas = document.getElementsByClassName ("subpestana");
  var subcabecera = document.getElementsByClassName ("subcabecera");
  for(i=0;i<subpestanas.length; i++){
    if(subpestanas[i].className.includes("p-subactiva")){
      subpestanas[i].className = subpestanas[i].className.replace("p-subactiva","")
      subcabecera[i].className = subcabecera[i].className.replace("c-subactiva","")
      break;
    }
  }
  subpestanas[n].className += " p-subactiva";
  subcabecera[n].className += " c-subactiva";
}

//Función para iniciar el juego que obtiene el video del DOM y lo oculta, así como el botón del play.
//Una vez hecho esto, inicializa los elementos del juego(enfermero,virus,fondo..) y pone en play la música de fondo.
function startGame() {
    var video=document.getElementById("video");
    video.style.display='none';
    var boton=document.getElementById("boton");
    boton.style.display='none';
    myGameArea.start();
    myGamePiece = new component(200, 200, "./img/enfermero.png", 300, 450, "image");
    myBackground = new component(800, 650, "./img/hospital.jpg", 0, 0, "image");
    myObstacle = new obstaculo(50, 50, "./img/coronavirus.png",50 , 20,"image");
    myObstacle2 = new obstaculo(50, 50, "./img/coronavirus.png",700 , 200,"image");
    myObstacle3 = new obstaculo(50, 50, "./img/coronavirus.png",600 , 500,"image");
    myObstacle4 = new obstaculo(50, 50, "./img/coronavirus.png",50, 500,"image");
    myScore = new component("30px","30px", "0095DD", 700, 40, "text");
    myMusic = new sound("./musica/Quédate en tu casa.mp3");
    vidario=new component("30px","30px", "0095DD", 700, 80, "text");
    i=0;
    myMusic.play();
}

//Aquí se crea el elemento canvas, le da unos ciertos atributos como ancho, alto...
//y lo añade al árbol DOM. Además  se meten los eventos de las teclas con las que
//se mueve el enfermero. Además, se implementan la función de limpiar el canvas y de pararlo.
var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 800;
        this.canvas.height = 650;
        this.frameNo=0;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[16]);
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (e) {
            myGameArea.key = e.keyCode;
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.key = false;
        })
    },
    clear : function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
       clearInterval(this.interval);
   }
}

//Aquí se crea un objeto component que se usará para crear el enfermero por ejemplo, dándole
//ciertos atributos como las dimensiones,la vida, sus coordenadas...
//Además se hace uina distinción para saber si dicho objeto es una imagen o por el contrario es un texto.
//Aquí además se implementan las funciones de refresco del componente y de choque contra un obstáculo.
function component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image") {
        this.image = new Image();
        this.image.src = color;
    }
    this.vidas=3;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.update = function() {
        ctx = myGameArea.context;
        if (type == "image") {
        ctx.drawImage(this.image,
            this.x,
            this.y,
            this.width, this.height);
        }else if (this.type == "text") {
             ctx.font ="10px impact";
             ctx.fillStyle = color;
             ctx.fillText(this.text, this.x, this.y);
    } else {
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

}
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
    }
    this.crashWith = function(otherobj) {
  var myleft = this.x;
  var myright = this.x + (this.width);
  var mytop = this.y;
  var mybottom = this.y + (this.height);
  var otherleft = otherobj.x;
  var otherright = otherobj.x + (otherobj.width);
  var othertop = otherobj.y;
  var otherbottom = otherobj.y + (otherobj.height);
  var crash = true;
  if ((mybottom < othertop) ||
  (mytop > otherbottom) ||
  (myright < otherleft) ||
  (myleft > otherright)) {
    crash = false;
  }
  return crash;
}
}

//Aquí se implementa la función de refrescar el area de juego, la cual,
//tiene en cuenta que el enfermero choque con cada uno de los cuatro virus,
// no choque con ninguno y si las vidas llegan a 0, lo que supone el fin del juego.
function updateGameArea() {
  if (myGamePiece.crashWith(myObstacle)) {
    myGameArea.stop();
    myGamePiece.vidas+= -1;
    scoreRecord[i]=myGameArea.frameNo;
    i++;
    myGamePiece.x=300;
    myGamePiece.y=450;
    myObstacle.x=50;
    myObstacle.y=20;
    myObstacle2.x=700;
    myObstacle2.y=200;
    myObstacle3.x=600;
    myObstacle3.y=500;
    myObstacle4.x=50;
    myObstacle4.y=500;
    myGameArea.start();
    myObstacle.update();
    myObstacle.newPos();
    myObstacle2.update();
    myObstacle2.newPos();
    myObstacle3.update();
    myObstacle3.newPos();
    myObstacle4.update();
    myObstacle4.newPos();
    myBackground.newPos();
    myBackground.update();
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
    if (myGameArea.key && myGameArea.key == 37) {myGamePiece.speedX = -2; }
    if (myGameArea.key && myGameArea.key == 39) {myGamePiece.speedX = 2; }
    if (myGameArea.key && myGameArea.key == 38) {myGamePiece.speedY = -2; }
    if (myGameArea.key && myGameArea.key == 40) {myGamePiece.speedY = 2; }
    myScore.text = "PUNTUACIÓN: " + myGameArea.frameNo;
    myScore.update();
    vidario.text="vidas:"+myGamePiece.vidas;
    vidario.update();
    myGamePiece.newPos();
    myGamePiece.update();
    return;
  }else if (myGamePiece.crashWith(myObstacle2)){
    myGameArea.stop();
    myGamePiece.vidas+= -1;
    scoreRecord[i]=myGameArea.frameNo;
    i++;
    myGamePiece.x=300;
    myGamePiece.y=450;
    myObstacle.x=50;
    myObstacle.y=20;
    myObstacle2.x=700;
    myObstacle2.y=200;
    myObstacle3.x=600;
    myObstacle3.y=500;
    myObstacle4.x=50;
    myObstacle4.y=500;
    myGameArea.start();
    myBackground.newPos();
    myBackground.update();
    myObstacle.update();
    myObstacle.newPos();
    myObstacle2.update();
    myObstacle2.newPos();
    myObstacle3.update();
    myObstacle3.newPos();
    myObstacle4.update();
    myObstacle4.newPos();
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
    if (myGameArea.key && myGameArea.key == 37) {myGamePiece.speedX = -2; }
    if (myGameArea.key && myGameArea.key == 39) {myGamePiece.speedX = 2; }
    if (myGameArea.key && myGameArea.key == 38) {myGamePiece.speedY = -2; }
    if (myGameArea.key && myGameArea.key == 40) {myGamePiece.speedY = 2; }
    myScore.text = "PUNTUACIÓN: " + myGameArea.frameNo;
    myScore.update();
    vidario.text="vidas:"+myGamePiece.vidas;
    vidario.update();
    myGamePiece.newPos();
    myGamePiece.update();
      return;
  }else if (myGamePiece.crashWith(myObstacle3)){

    myGameArea.stop();
    myGamePiece.vidas+= -1;
    scoreRecord[i]=myGameArea.frameNo;
    i++;
    myGamePiece.x=300;
    myGamePiece.y=450;
    myObstacle.x=50;
    myObstacle.y=20;
    myObstacle2.x=700;
    myObstacle2.y=200;
    myObstacle3.x=600;
    myObstacle3.y=500;
    myObstacle4.x=50;
    myObstacle4.y=500;
    myGameArea.start();
    myBackground.newPos();
    myBackground.update();
    myObstacle.update();
    myObstacle.newPos();
    myObstacle2.update();
    myObstacle2.newPos();
    myObstacle3.update();
    myObstacle3.newPos();
    myObstacle4.update();
    myObstacle4.newPos();
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
    if (myGameArea.key && myGameArea.key == 37) {myGamePiece.speedX = -2; }
    if (myGameArea.key && myGameArea.key == 39) {myGamePiece.speedX = 2; }
    if (myGameArea.key && myGameArea.key == 38) {myGamePiece.speedY = -2; }
    if (myGameArea.key && myGameArea.key == 40) {myGamePiece.speedY = 2; }
    myScore.text = "PUNTUACIÓN: " + myGameArea.frameNo;
    myScore.update();
    vidario.text="vidas:"+myGamePiece.vidas;
    vidario.update();
    myGamePiece.newPos();
    myGamePiece.update();
      return;
  }else if (myGamePiece.crashWith(myObstacle4)) {
    myGameArea.stop();
    myGamePiece.vidas+= -1;
    scoreRecord[i]=myGameArea.frameNo;
    i++;
    myGamePiece.x=300;
    myGamePiece.y=450;
    myObstacle.x=50;
    myObstacle.y=20;
    myObstacle2.x=700;
    myObstacle2.y=200;
    myObstacle3.x=600;
    myObstacle4.x=50;
    myObstacle4.y=500;
    myGameArea.start();
    myObstacle.update();
    myObstacle.newPos();
    myObstacle2.update();
    myObstacle2.newPos();
    myObstacle3.update();
    myObstacle3.newPos();
    myObstacle4.update();
    myObstacle4.newPos();
    myBackground.newPos();
    myBackground.update();
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
    if (myGameArea.key && myGameArea.key == 37) {myGamePiece.speedX = -2; }
    if (myGameArea.key && myGameArea.key == 39) {myGamePiece.speedX = 2; }
    if (myGameArea.key && myGameArea.key == 38) {myGamePiece.speedY = -2; }
    if (myGameArea.key && myGameArea.key == 40) {myGamePiece.speedY = 2; }
    myScore.text = "PUNTUACIÓN: " + myGameArea.frameNo;
    myScore.update();
    vidario.text="vidas:"+myGamePiece.vidas;
    vidario.update();
    myGamePiece.newPos();
    myGamePiece.update();
    return;


  }else{
    myGameArea.clear();
    myGameArea.frameNo += 1;
    myBackground.newPos();
    myBackground.update();
    myObstacle.update();
    myObstacle.newPos();
    myObstacle2.update();
    myObstacle2.newPos();
    myObstacle3.update();
    myObstacle3.newPos();
    myObstacle4.update();
    myObstacle4.newPos();
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
    if (myGameArea.key && myGameArea.key == 37) {myGamePiece.speedX = -2; }
    if (myGameArea.key && myGameArea.key == 39) {myGamePiece.speedX = 2; }
    if (myGameArea.key && myGameArea.key == 38) {myGamePiece.speedY = -2; }
    if (myGameArea.key && myGameArea.key == 40) {myGamePiece.speedY = 2; }
    myScore.text = "PUNTUACIÓN: " + myGameArea.frameNo;
    myScore.update();
    vidario.text="vidas:"+myGamePiece.vidas;
    vidario.update();
    myGamePiece.newPos();
    myGamePiece.update();
}
if (myGamePiece.vidas==0){
  myGameArea.stop();
  myMusic.stop();
  record=scoreRecord[0];
  for (x=0;x<scoreRecord.length;x++){
    if (scoreRecord[x]>record){
      record=scoreRecord[x];
    }
  }
  myGameArea.clear();
  var video=document.getElementById("video");
  video.style.display='block';
  var boton=document.getElementById("boton");
  boton.style.display='block';
  alert("Game over--->Record:"+record);
}
}
//Función que mete un audio de fondo en el juego. Crea el elmento audio y lo
//mete en el árbol DOM, de forma que se escuche de fondo cuando se incia el juego.
function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
}

//Función muy parecida a la de componente ya que crea un objeto al cual se le atribuyen
// una serie de valores con la diferencia de que aquí además se le especificará el movimiento
// en este caso de los virus, que hemos querido que sean un poco aleatorios, por ello la función random en el angulo.
function obstaculo(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image") {
        this.image = new Image();
        this.image.src = color;
      }
    this.width = width;
    this.height = height;
    this.speed =2;
    this.angle =Math.random() ;
    this.moveAngle = Math.random();
    this.x = x;
    this.y = y;
    this.update = function() {
        ctx = myGameArea.context;
        if (type == "image") {
        ctx.drawImage(this.image,
            this.x,
            this.y,
            this.width, this.height);

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        ctx.restore();
      }
    }
    this.newPos = function() {
        this.angle += this.moveAngle * Math.PI / 180;
        this.x += (this.speed*-1) * Math.sin(this.angle);
        this.y -= (this.speed*-1) * Math.cos(this.angle);
    }
}

//Función que obtiene el elemento video y lo reproduce. Dicha función se llama cuando se
//clicka en el botón de play.
function video(){
  var video=document.getElementById("video");
  video.play();
}

//CARRUSEL
//FUNCIONES CARRUSEL
var actual = 0;
function puntos(n){
  var ptn = document.getElementsByClassName("punto");
  for(i=0; i<ptn.length; i++){
    if(ptn[i].className.includes("activo")){
      ptn[i].className = ptn[i].className.replace("activo", "");
      break;
    }
  }
  ptn[n].className += " activo";
}

function mostrar(n){
  var imagenes = document.getElementsByClassName("imagen");
  for(i=0; i<imagenes.length; i++){
    if(imagenes[i].className.includes("actual")){
      imagenes[i].className = imagenes[i].className.replace("actual", "");
      break;
    }
  }
  actual = n;
  imagenes[n].className += " actual";
  puntos(n);
}

function siguiente(){
  actual++;
  if(actual>6){
    actual = 0;
  }
  mostrar(actual);
}

function anterior(){
  actual--;
  if(actual<0){
    actual = 6;
  }
  mostrar(actual);
}

var velocidad = 4000;
var play = setInterval("siguiente()", velocidad);
