//Wenceslao Crivos tp4 Comision 3 David Bedoian pmiw
//Variables Globales 
let fondo, menu;
let mjFrames = [[], [], []];
let sonidos = [];

let MENU = 0, BAILE1 = 1, BAILE2 = 2, BAILE3 = 3;
let estadoActual = MENU;

let frameActual = 0, velocidadAnimacion = 8;
let posX, posY, velX = 2;
let ultimoBaile = 0, intervaloBaile = 4000;
let anchoMJ = 150, altoMJ = 270;

//Carga de archivos 
function preload() {
  menu = loadImage("data/menu.png");
  fondo = loadImage("data/fondo.png");
  for (let i = 0; i <= 4; i++) mjFrames[0][i] = loadImage("data/mj" + nf(i, 2) + ".png");
  for (let i = 5; i <= 10; i++) mjFrames[1][i - 5] = loadImage("data/mj" + nf(i, 2) + ".png");
  for (let i = 11; i <= 15; i++) mjFrames[2][i - 11] = loadImage("data/mj" + nf(i, 2) + ".png");

  for (let i = 1; i <= 3; i++) sonidos[i] = loadSound("data/baile" + i + ".mp3");
}

function setup() {
  createCanvas(800, 600);
  posX = width / 2;
  posY = height / 2 + 30;
  for (let s of sonidos) if (s) s.setVolume(0.5);
}

function draw() {
  background(0);
  //Maquina de estados 
  if (estadoActual === MENU) {
    image(menu, 0, 0, width, height);
  } else {
    actualizarMovimiento();
    controlarCambioAutomatico();
    dibujarBaile(mjFrames[estadoActual - 1]);
  }
}

function actualizarMovimiento() {
  posX += velX;
  if (posX > width - 100 || posX < 100) velX *= -1;
}

function controlarCambioAutomatico() {
  if (millis() - ultimoBaile > intervaloBaile) {
    let nuevoBaile;
    do { nuevoBaile = floor(random(1, 4)); } while (nuevoBaile === estadoActual);
    cambiarEstado(nuevoBaile);
  }
}

function dibujarBaile(animacion) {
  image(fondo, 0, 0, width, height);
  let frame = obtenerFrame(frameActual, animacion);

  push();
  imageMode(CENTER);
  if (velX < 0) {
    translate(posX, posY);
    scale(-1, 1);
    image(frame, 0, 0, anchoMJ, altoMJ);
  } else {
    image(frame, posX, posY, anchoMJ, altoMJ);
  }
  pop();

  if (frameCount % velocidadAnimacion === 0) frameActual = (frameActual + 1) % animacion.length;
  dibujarBotones();
}

function obtenerFrame(numero, animacion) {
  return animacion[numero % animacion.length];
}

function dibujarBotones() {
  push();
  rectMode(CORNER);
  textAlign(CENTER, CENTER);
  textSize(13);
  textStyle(BOLD);

  let posicionesX = [20, 135, 250];
  let etiquetas = ["BAILE 1", "BAILE 2", "BAILE 3"];

  for (let i = 0; i < 3; i++) {
    fill(20); rect(posicionesX[i] + 3, 543, 100, 38);
    fill(15, 15, 25); stroke(230, 180, 50); strokeWeight(2);
    rect(posicionesX[i], 540, 100, 38);
    noStroke(); fill(240, 200, 80);
    text(etiquetas[i], posicionesX[i] + 50, 559);
  }

  //boton reiniciar 
  fill(40, 0, 0); rect(653, 543, 120, 38);
  fill(180, 30, 30); stroke(255, 220, 220); strokeWeight(2);
  rect(650, 540, 120, 38);
  noStroke(); fill(255);
  text("↺ REINICIAR", 710, 559);
  pop();
}

function botonPresionado(x, y, ancho, alto) {
  return mouseX >= x && mouseX <= x + ancho && mouseY >= y && mouseY <= y + alto;
}

function cambiarEstado(nuevoEstado) {
  for (let s of sonidos) if (s) s.stop();
  estadoActual = nuevoEstado;
  frameActual = 0;
  ultimoBaile = millis();
  if (sonidos[estadoActual]) sonidos[estadoActual].loop();
}

function reiniciar() {
  for (let s of sonidos) if (s) s.stop();
  estadoActual = MENU;
  frameActual = 0;
  posX = width / 2;
  posY = height / 2 + 30;
}

function mousePressed() {
  userStartAudio();
  if (estadoActual === MENU) {
    if (botonPresionado(260, 285, 275, 105)) cambiarEstado(BAILE1);
  } else {
    let pos = [20, 135, 250];
    for (let i = 0; i < 3; i++) {
      if (botonPresionado(pos[i], 540, 100, 40)) cambiarEstado(i + 1);
    }
    if (botonPresionado(650, 540, 120, 40)) reiniciar();
  }
}
