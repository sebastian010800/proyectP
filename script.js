/* ===== Código de acceso ===== */
const CODE = "260809";

const gate = document.getElementById("lockGate");
const form = document.getElementById("lockForm");
const input = document.getElementById("codeInput");
const errorMsg = document.getElementById("lockError");
const letterWrap = document.getElementById("letterWrap");

function unlock() {
  gate.classList.add("hidden");
  letterWrap.classList.remove("locked");
  document.body.style.overflow = "";
  // Arranca los reveals que ya estén en pantalla
  setTimeout(() => burstPetals(30), 300);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = input.value.trim();
  if (value === CODE) {
    errorMsg.hidden = true;
    unlock();
  } else {
    errorMsg.hidden = false;
    gate.classList.add("shake");
    input.value = "";
    setTimeout(() => gate.classList.remove("shake"), 450);
  }
});

// Bloquea el scroll del fondo mientras el candado esté visible
document.body.style.overflow = "hidden";

/* ===== Video principal: arranca en el segundo 2 ===== */
(function mainVideoStart() {
  const video = document.getElementById("mainVideo");
  if (!video) return;
  const START = 2;

  function seekStart() {
    try { if (video.currentTime < START) video.currentTime = START; } catch (_) {}
  }

  video.addEventListener("loadedmetadata", seekStart);
  // Al reiniciar el loop, vuelve al segundo 2 en lugar de al 0
  video.addEventListener("timeupdate", () => {
    if (video.currentTime < START - 0.1) video.currentTime = START;
  });
  video.addEventListener("seeked", () => {}, { once: true });
})();

/* ===== Reveal al hacer scroll ===== */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

/* ===== Pétalos flotantes ===== */
const petalsLayer = document.getElementById("petals");

function burstPetals(amount = 24) {
  for (let i = 0; i < amount; i++) {
    const petal = document.createElement("span");
    petal.className = "floating-petal";
    petal.textContent = ["🌺", "💮", "🌸", "✨", "💗"][Math.floor(Math.random() * 5)];
    petal.style.left = Math.random() * 100 + "vw";
    petal.style.animationDuration = (3.4 + Math.random() * 4) + "s";
    petal.style.animationDelay = Math.random() * 0.8 + "s";
    petal.style.opacity = 0.4 + Math.random() * 0.5;
    petalsLayer.appendChild(petal);
    setTimeout(() => petal.remove(), 8200);
  }
}
