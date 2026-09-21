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

const carousel = document.getElementById("photoCarousel");
const track = document.getElementById("carouselTrack");
const slides = [...track.children];
const dotsContainer = document.getElementById("carouselDots");
const count = document.getElementById("photoCount");
let current = 0;

slides.forEach((slide, index) => {
  const dot = document.createElement("button");
  dot.type = "button";
  dot.className = "dot";
  dot.setAttribute("aria-label", `Ver foto ${index + 1}`);
  dot.addEventListener("click", () => showPhoto(index));
  dotsContainer.appendChild(dot);
});

function showPhoto(index) {
  current = (index + slides.length) % slides.length;
  track.style.transform = `translateX(-${current * 100}%)`;
  slides.forEach((slide, i) => slide.setAttribute("aria-hidden", String(i !== current)));
  [...dotsContainer.children].forEach((dot, i) => dot.setAttribute("aria-current", String(i === current)));
  count.textContent = `${current + 1} / ${slides.length}`;
}

document.getElementById("prevPhoto").addEventListener("click", () => showPhoto(current - 1));
document.getElementById("nextPhoto").addEventListener("click", () => showPhoto(current + 1));
carousel.addEventListener("keydown", (event) => {
  if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
  event.preventDefault();
  showPhoto(current + (event.key === "ArrowRight" ? 1 : -1));
});

let touchStart = null;
const carouselWindow = carousel.querySelector(".carousel-window");
carouselWindow.addEventListener("touchstart", (event) => { touchStart = { x:event.touches[0].clientX, y:event.touches[0].clientY }; }, { passive:true });
carouselWindow.addEventListener("touchend", (event) => {
  if (!touchStart) return;
  const dx = event.changedTouches[0].clientX - touchStart.x;
  const dy = event.changedTouches[0].clientY - touchStart.y;
  if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) showPhoto(current + (dx < 0 ? 1 : -1));
  touchStart = null;
}, { passive:true });
carouselWindow.addEventListener("touchcancel", () => { touchStart = null; });
showPhoto(0);

document.querySelectorAll(".slide img").forEach((img) => {
  const showMissing = () => {
    if (img.hidden) return;
    img.hidden = true;
    const message = document.createElement("span");
    message.className = "missing-photo";
    message.textContent = "🌻 Esta foto está esperando su lugar.";
    img.parentElement.appendChild(message);
  };
  img.addEventListener("error", showMissing);
  if (img.complete && !img.naturalWidth) showMissing();
});

const mainVideo = document.getElementById("mainVideo");
function seekStart() {
  if (Number.isFinite(mainVideo.duration) && mainVideo.duration > 2 && mainVideo.currentTime < 2) mainVideo.currentTime = 2;
}
mainVideo.addEventListener("loadedmetadata", seekStart);
mainVideo.addEventListener("timeupdate", seekStart);
const videos = [...document.querySelectorAll("video")];
videos.forEach((video) => video.addEventListener("play", () => videos.forEach((other) => { if (other !== video) other.pause(); })));

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
