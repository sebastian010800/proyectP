const CODE = "260809";
const gate = document.getElementById("lockGate");
const form = document.getElementById("lockForm");
const input = document.getElementById("codeInput");
const errorMsg = document.getElementById("lockError");
const letterWrap = document.getElementById("letterWrap");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function unlock() {
  gate.classList.add("hidden");
  letterWrap.classList.remove("locked");
  letterWrap.inert = false;
  document.body.style.overflow = "";
  document.getElementById("letterTitle").focus();
  startCascade();
  setTimeout(() => burstPetals(28), 300);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (input.value.trim() === CODE) {
    errorMsg.hidden = true;
    input.removeAttribute("aria-invalid");
    unlock();
    return;
  }
  errorMsg.hidden = false;
  input.setAttribute("aria-invalid", "true");
  gate.classList.add("shake");
  input.value = "";
  input.focus();
  setTimeout(() => gate.classList.remove("shake"), 450);
});

document.body.style.overflow = "hidden";

const mainVideo = document.getElementById("mainVideo");
function seekStart() {
  if (Number.isFinite(mainVideo.duration) && mainVideo.duration > 2 && mainVideo.currentTime < 2) mainVideo.currentTime = 2;
}
mainVideo.addEventListener("loadedmetadata", seekStart);
mainVideo.addEventListener("timeupdate", seekStart);
const videos = [...document.querySelectorAll("video")];
videos.forEach((video) => video.addEventListener("play", () => videos.forEach((other) => { if (other !== video) other.pause(); })));
const mobileView = window.matchMedia("(max-width: 480px)");
videos.forEach((video, index) => video.addEventListener("ended", () => {
  if (!mobileView.matches) return;
  const nextVideo = videos[(index + 1) % videos.length];
  nextVideo.closest(".media-video").scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  nextVideo.play().catch(() => {});
}));

function burstPetals(amount = 24) {
  if (reducedMotion.matches) return;
  const layer = document.getElementById("petals");
  const flowers = ["🌹", "🌻", "🌼", "🌸", "✨"];
  for (let i = 0; i < amount; i += 1) {
    const petal = document.createElement("span");
    petal.className = "floating-petal";
    petal.textContent = flowers[Math.floor(Math.random() * flowers.length)];
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.animationDuration = `${4 + Math.random() * 3}s`;
    petal.style.animationDelay = `${Math.random() * .8}s`;
    petal.style.opacity = .4 + Math.random() * .5;
    layer.appendChild(petal);
    setTimeout(() => petal.remove(), 8200);
  }
}

/* ── Cascada de recuerdos ──────────────────────────────────────────────
   Tablero tipo Pinterest inspirado en el screensaver editorial del photo-booth:
   las columnas suben a velocidades distintas (paralaje), la cámara hace zoom,
   deriva e inclinación 3D suaves, y la escena aparece desde el centro.
   Todo se escribe directo en el style dentro de un solo rAF (nada de estado
   por frame) y solo corre mientras la sección está a la vista.            */
const CASCADE_COLS_SPEEDS = [1, 0.86, 1.14, 0.94];
const CASCADE_RATIOS = [1.33, 1, 0.75, 1.5, 1, 1.25, 0.8, 1.4, 1.1, 0.9];
const CASCADE_CARDS_PER_COL = 6;
const CASCADE_SCROLL_PER_SEC = 0.085; // fracción del alto del escenario por segundo
const CASCADE_INTRO_MS = 1800;

const cascadeStage = document.getElementById("cascadeStage");
const cascadeGrid = document.getElementById("cascadeGrid");
const cascadeCamera = document.getElementById("cascadeCamera");
const cascadeIntro = document.getElementById("cascadeIntro");
const cascadePhotos = [
  "imagenes/WhatsApp Image 2026-08-09 at 5.43.02 PM.jpeg",
  "imagenes/WhatsApp Image 2026-08-09 at 5.43.02 PM (1).jpeg",
  "imagenes/WhatsApp Image 2026-08-09 at 6.08.34 PM.jpeg",
  "imagenes/YAM.png",
  "imagenes/image1.png",
];

let cascadeColumns = [];
let cascadeCopyHeights = [];
let cascadeFrame = null;
let cascadeStart = null;
let cascadeColCount = 0;

const easeInOut = (x) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
const cascadeColsForWidth = () => (window.innerWidth <= 480 ? 2 : window.innerWidth <= 768 ? 3 : 4);

// El alto de UNA copia: scrollHeight trae las dos copias más el espacio del
// medio, así que una copia con su separación es la mitad de eso más medio gap.
// Sin esta corrección el salto del loop se ve como un tirón.
function measureCascade() {
  cascadeCopyHeights = cascadeColumns.map((col) => {
    const gap = parseFloat(getComputedStyle(col).rowGap || "0") || 0;
    return (col.scrollHeight + gap) / 2;
  });
}

function buildCascade() {
  if (!cascadeGrid || cascadePhotos.length === 0) return;
  cascadeColCount = cascadeColsForWidth();
  cascadeGrid.textContent = "";
  cascadeColumns = [];
  let photoIndex = 0;

  for (let c = 0; c < cascadeColCount; c += 1) {
    const col = document.createElement("div");
    col.className = "cascade-col";
    const cards = [];
    for (let i = 0; i < CASCADE_CARDS_PER_COL; i += 1) {
      // El pozo se recorre en ciclo: con pocas fotos se repiten, pero nunca en
      // la misma fila ni en la misma columna, porque el reparto es por vueltas.
      cards.push(cascadePhotos[photoIndex++ % cascadePhotos.length]);
    }
    // Dos copias idénticas: cuando la primera termina de subir, la segunda ya
    // está exactamente en su lugar y el desplazamiento vuelve a cero sin costura.
    [...cards, ...cards].forEach((src, i) => {
      const card = document.createElement("div");
      card.className = "cascade-card";
      // La proporción se toma por la posición DENTRO de la copia para que las
      // dos copias sean idénticas tarjeta por tarjeta.
      card.style.aspectRatio = `1 / ${CASCADE_RATIOS[(c * 3 + (i % CASCADE_CARDS_PER_COL)) % CASCADE_RATIOS.length]}`;
      const img = document.createElement("img");
      img.src = src;
      img.alt = "";
      img.loading = "lazy";
      img.decoding = "async";
      img.draggable = false;
      img.addEventListener("load", measureCascade);
      // Si una foto falta, la tarjeta se queda (vacía): quitarla desalinearía
      // las dos copias de la columna y el salto del loop se vería.
      img.addEventListener("error", () => img.remove());
      card.appendChild(img);
      col.appendChild(card);
    });
    cascadeGrid.appendChild(col);
    cascadeColumns.push(col);
  }
  measureCascade();
}

function cascadeTick(now) {
  if (cascadeStart === null) cascadeStart = now;
  const elapsed = now - cascadeStart;
  const seconds = elapsed / 1000;
  const stageH = cascadeStage.clientHeight || 1;

  // Columnas: suben con paralaje, en módulo del alto de una copia.
  const travelled = seconds * CASCADE_SCROLL_PER_SEC * stageH;
  cascadeColumns.forEach((col, i) => {
    const copyH = cascadeCopyHeights[i] || 0;
    const raw = travelled * (CASCADE_COLS_SPEEDS[i % CASCADE_COLS_SPEEDS.length] ?? 1);
    col.style.transform = `translate3d(0, ${-(copyH > 0 ? raw % copyH : raw)}px, 0)`;
  });

  // Cámara: oscilaciones de periodos distintos (y primos entre sí) para que el
  // movimiento nunca se repita igual pero tampoco tenga saltos.
  const wave = (periodSec) => Math.sin((seconds / periodSec) * Math.PI * 2);
  const scale = 1.09 + 0.05 * wave(23);
  const shiftX = 2.4 * wave(29);
  const rotateZ = 3.6 + 0.9 * wave(19);
  const rotateX = 1.2 * wave(31);
  const rotateY = 2.2 * wave(37);
  const intro = easeInOut(Math.min(1, elapsed / CASCADE_INTRO_MS));

  cascadeCamera.style.transform = `translate3d(${shiftX}%, 0, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotate(${rotateZ}deg) scale(${scale})`;
  cascadeCamera.style.opacity = String(0.15 + 0.85 * intro);
  cascadeIntro.style.opacity = String(1 - intro);

  cascadeFrame = requestAnimationFrame(cascadeTick);
}

let cascadePaused = 0;
let cascadeVisible = false;
function startCascade() {
  if (cascadeFrame !== null || cascadeColumns.length === 0) return;
  // Ni fuera de pantalla, ni con la pestaña en segundo plano, ni mientras la
  // carta sigue bajo llave (y desenfocada): el rAF no corre.
  if (!cascadeVisible || document.hidden || letterWrap.classList.contains("locked")) return;
  // Se retoma desde donde iba: el tiempo perdido mientras estuvo fuera de
  // pantalla no se cuenta, así la escena no salta al volver.
  cascadeStart = cascadeStart === null ? null : performance.now() - cascadePaused;
  cascadeFrame = requestAnimationFrame(cascadeTick);
}

function stopCascade() {
  if (cascadeFrame === null) return;
  cancelAnimationFrame(cascadeFrame);
  cascadeFrame = null;
  if (cascadeStart !== null) cascadePaused = performance.now() - cascadeStart;
}

if (cascadeStage && cascadeGrid && cascadePhotos.length > 0) {
  buildCascade();
  if (reducedMotion.matches) {
    // Sin movimiento la escena queda quieta y visible: solo se apaga el velo.
    cascadeCamera.style.transform = "none";
    cascadeCamera.style.opacity = "1";
    cascadeIntro.style.opacity = "0";
  } else {
    new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        cascadeVisible = entry.isIntersecting;
        if (cascadeVisible) startCascade();
        else stopCascade();
      });
    }, { threshold: 0.12 }).observe(cascadeStage);

    let resizeTimer = null;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (cascadeColsForWidth() !== cascadeColCount) buildCascade();
        else measureCascade();
      }, 200);
    });
    document.addEventListener("visibilitychange", () => (document.hidden ? stopCascade() : startCascade()));
  }
}
