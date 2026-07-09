/* ===== Cuenta regresiva para el 19 de julio ===== */
(function countdownInit() {
  const el = {
    months: document.getElementById("cd-months"),
    days: document.getElementById("cd-days"),
    hours: document.getElementById("cd-hours"),
    mins: document.getElementById("cd-mins"),
    secs: document.getElementById("cd-secs"),
  };

  function targetDate() {
    const now = new Date();
    // 19 de julio de este año; si ya pasó, el del próximo año.
    let target = new Date(now.getFullYear(), 6, 19, 0, 0, 0);
    if (target - now < 0) target = new Date(now.getFullYear() + 1, 6, 19, 0, 0, 0);
    return target;
  }

  function tick() {
    const now = new Date();
    const target = targetDate();
    let diff = target - now;

    if (diff <= 0) {
      [el.months, el.days, el.hours, el.mins, el.secs].forEach((n) => n && (n.textContent = "0"));
      return;
    }

    // Meses y días de calendario
    let months = 0;
    let cursor = new Date(now);
    while (true) {
      const next = new Date(cursor);
      next.setMonth(next.getMonth() + 1);
      if (next <= target) { months++; cursor = next; } else break;
    }
    const days = Math.floor((target - cursor) / 86400000);
    const hours = Math.floor(diff / 3600000) % 24;
    const mins = Math.floor(diff / 60000) % 60;
    const secs = Math.floor(diff / 1000) % 60;

    if (el.months) el.months.textContent = months;
    if (el.days) el.days.textContent = days;
    if (el.hours) el.hours.textContent = hours;
    if (el.mins) el.mins.textContent = mins;
    if (el.secs) el.secs.textContent = secs;
  }

  tick();
  setInterval(tick, 1000);
})();

/* ===== Contador: se encoge y se va a la derecha al hacer scroll ===== */
(function countdownScroll() {
  const bar = document.querySelector(".countdown-bar");
  if (!bar) return;

  function onScroll() {
    if (window.scrollY > 60) bar.classList.add("shrink");
    else bar.classList.remove("shrink");
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

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
