const text = `Lau, hice esto para ti porque sé que a veces los días se sienten raros o pesados. No es una página perfecta, pero sí está hecha con una intención bonita: recordarte que eres especial, que tienes muchas versiones lindas y que hasta una orquídea roja se queda corta para describir lo única que eres.`;

const typed = document.getElementById("typed");
let idx = 0;

function typeWriter() {
  if (idx <= text.length) {
    typed.textContent = text.slice(0, idx);
    idx++;
    setTimeout(typeWriter, idx < 25 ? 38 : 24);
  }
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      if (entry.target.closest("#mensaje") && idx === 0) typeWriter();
    }
  });
}, { threshold: 0.18 });

document.querySelectorAll(".reveal, .barbie-card").forEach((el) => observer.observe(el));
observer.observe(document.querySelector("#mensaje"));

const response = document.getElementById("response");
document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
    response.textContent = chip.dataset.msg;
    burstPetals(14);
  });
});

const petalsLayer = document.getElementById("petals");
const petalBtn = document.getElementById("petalBtn");

function burstPetals(amount = 30) {
  for (let i = 0; i < amount; i++) {
    const petal = document.createElement("span");
    petal.className = "floating-petal";
    petal.textContent = ["🌺", "💮", "🌸", "✨"][Math.floor(Math.random() * 4)];
    petal.style.left = Math.random() * 100 + "vw";
    petal.style.animationDuration = (3 + Math.random() * 3.8) + "s";
    petal.style.animationDelay = Math.random() * .8 + "s";
    petal.style.opacity = .45 + Math.random() * .5;
    petalsLayer.appendChild(petal);
    setTimeout(() => petal.remove(), 7600);
  }
}

petalBtn.addEventListener("click", () => burstPetals(42));

document.addEventListener("click", (event) => {
  if (event.target.closest("button, a")) return;
  const heart = document.createElement("span");
  heart.className = "heart-pop";
  heart.textContent = ["🌺", "✨", "💗"][Math.floor(Math.random() * 3)];
  heart.style.left = event.clientX + "px";
  heart.style.top = event.clientY + "px";
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 950);
});

setTimeout(() => burstPetals(18), 900);
