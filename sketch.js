// patrón del corazón
const patronCorazon = [
  "          $$$$$$$$$$               $$$$$$$$$$$",
  "      $$$$$$$$$$$$$$$$$          $$$$$$$$$$$$$$$$$",
  "   $$$$$$$$$$$$$$$$$$$$$$      $$$$$$$$$$$$$$$$$$$$$$",
  "  $$$$$$$$$$$$$$$$$$$$$$$$    $$$$$$$$$$$$$$$$$$$$$$$$",
  " $$$$$$$$$$$$$$$$$$$$$$$$$$  $$$$$$$$$$$$$$$$$$$$$$$$$$",
  " $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$",
  " $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$",
  "  $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$",
  "  $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$",
  "    $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$",
  "      $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$",
  "        $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$",
  "          $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$",
  "            $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$",
  "              $$$$$$$$$$$$$$$$$$$$$$$$$$$$",
  "                $$$$$$$$$$$$$$$$$$$$$$$$",
  "                  $$$$$$$$$$$$$$$$$$$$",
  "                     $$$$$$$$$$$$$$$",
  "                        $$$$$$$$$",
  "                          $$$$$",
  "                            $ ",
];

// Elementos DOM Globales
const entradaNombre = document.getElementById("entradaNombre");
const botonFormar = document.getElementById("botonFormar");
const seccionEntrada = document.getElementById("seccionEntrada");
const seccionCorazon = document.getElementById("seccionCorazon");
const contenedorCorazon = document.getElementById("contenedorCorazon");
const mensajeFinal = document.getElementById("mensajeFinal");
const etiquetaNombreAmor = document.querySelector(".lover-name");

// Variables
let nombreActual = "";
let estaAnimando = false;
let lineasCorazonGeneradas = [];
let lineasReveladas = 0;
let ultimoTiempoRevelacion = 0;
const INTERVALO_REVELACION_MIN = 100;
const INTERVALO_REVELACION_MAX = 300;

class LineaMatriz {
  constructor() {
    this.x = random(width);
    this.y = random(-height, 0);
    this.velocidad = random(3, 7);
    this.longitud = floor(random(15, 30));
    this.caracteres = this.generarCadenaAleatoria();
    this.color = color(0, 255, 204, 30);
  }

  generarCadenaAleatoria() {
    const chars = "0123456789ABCDEF";
    let resultado = "";
    for (let i = 0; i < this.longitud; i++) {
      resultado += chars.charAt(floor(random(chars.length)));
    }
    return resultado;
  }

  caer() {
    this.y += this.velocidad;
    if (this.y > height) {
      this.y = random(-height, 0);
      this.x = random(width);
      this.caracteres = this.generarCadenaAleatoria();
    }
  }

  mostrar() {
    fill(this.color);
    textSize(12);
    for (let i = 0; i < this.longitud; i++) {
      const char = this.caracteres[i];
      text(char, this.x, this.y - i * 14);
    }
  }
}

// orazón Flotante

class CorazonFlotante {
  constructor() {
    this.x = random(width);
    this.y = height + 20;
    this.tamano = random(18, 30);
    this.velocidad = random(1, 2.5);
    this.color = color(0, 204, 255, 150);
    this.angulo = random(TWO_PI);
  }

  mover() {
    this.y -= this.velocidad;
    this.x += cos(this.angulo + frameCount * 0.02) * 1.5;
    if (this.y < -20) {
      this.reiniciar();
    }
  }

  reiniciar() {
    this.x = random(width);
    this.y = height + 20;
    this.tamano = random(18, 30);
    this.velocidad = random(1, 2.5);
  }

  mostrar() {
    push();
    translate(this.x, this.y);
    textSize(this.tamano);
    fill(this.color);
    textAlign(CENTER, CENTER);
    text("♥", 0, 0);
    pop();
  }
}

let lineasMatriz = [];
let corazonesFlotantes = [];

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("contenedor-canvas-p5");

  for (let i = 0; i < 3; i++) {
    lineasMatriz.push(new LineaMatriz());
  }
  for (let i = 0; i < 6; i++) {
    corazonesFlotantes.push(new CorazonFlotante());
  }

  configurarEscuchadores();
}

function draw() {
  clear();

  //  Actualizar y Mostrar Efecto
  if (frameCount % 40 === 0) {
    lineasMatriz.push(new LineaMatriz());
    if (lineasMatriz.length > 20) {
      lineasMatriz.shift();
    }
  }
  for (let linea of lineasMatriz) {
    linea.caer();
    linea.mostrar();
  }

  // Actualizar y Mostrar
  if (frameCount % 60 === 0) {
    corazonesFlotantes.push(new CorazonFlotante());
    if (corazonesFlotantes.length > 15) {
      corazonesFlotantes.shift();
    }
  }
  for (let corazon of corazonesFlotantes) {
    corazon.mover();
    corazon.mostrar();
  }
}

// Funciones de Utilidad

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function configurarEscuchadores() {
  botonFormar.addEventListener("click", manejarFormarCorazon);

  entradaNombre.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      manejarFormarCorazon();
    }
  });

  const actualizarEstadoBoton = () => {
    if (entradaNombre.value.trim().length > 1) {
      botonFormar.disabled = false;
      botonFormar.style.opacity = "1";
    } else {
      botonFormar.disabled = true;
      botonFormar.style.opacity = "0.5";
    }
  };

  entradaNombre.addEventListener("input", actualizarEstadoBoton);
  actualizarEstadoBoton();
}

// Funciones de Lógica Principal

function crearLineasCorazon(nombre) {
  const letras = nombre.split("");
  let indiceLetra = 0;

  return patronCorazon.map((linea) => {
    return linea.replace(/\$/g, () => {
      const letra = letras[indiceLetra % letras.length];
      indiceLetra++;

      if (indiceLetra % floor(random(8, 15)) === 0) {
        return "♥";
      }
      return letra;
    });
  });
}

function manejarFormarCorazon() {
  if (estaAnimando) return;

  nombreActual = entradaNombre.value.trim() || "UNM";
  estaAnimando = true;

  seccionEntrada.classList.add("hidden");
  document.querySelector(".terminal-header").classList.add("hidden");

  seccionCorazon.classList.remove("hidden");

  lineasCorazonGeneradas = crearLineasCorazon(nombreActual);
  lineasReveladas = 0;
  ultimoTiempoRevelacion = millis();
  contenedorCorazon.innerHTML = "";

  solicitarAnimacionTerminal();
}

function solicitarAnimacionTerminal() {
  if (lineasReveladas < lineasCorazonGeneradas.length) {
    const intervaloRevelacion = random(
      INTERVALO_REVELACION_MIN,
      INTERVALO_REVELACION_MAX
    );

    if (millis() - ultimoTiempoRevelacion > intervaloRevelacion) {
      const divLinea = document.createElement("div");
      divLinea.className = "heart-line-terminal";
      divLinea.textContent = lineasCorazonGeneradas[lineasReveladas];
      contenedorCorazon.appendChild(divLinea);

      lineasReveladas++;
      ultimoTiempoRevelacion = millis();
    }

    requestAnimationFrame(solicitarAnimacionTerminal);
  } else {
    etiquetaNombreAmor.textContent = ` ${nombreActual.toUpperCase()}! 💚`;
    mensajeFinal.classList.remove("hidden");

    estaAnimando = false;
  }
}
