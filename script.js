// ── Year ────────────────────────────────────────
document.getElementById("year").textContent = new Date().getFullYear();

// ── Email reveal ─────────────────────────────────
function revealEmail() {
  const box = document.getElementById("email-box");
  const btn = document.getElementById("email-btn");
  const visible = box.classList.toggle("visible");
  box.setAttribute("aria-hidden", !visible);
  btn.textContent = visible ? "Hide Email" : "Email Me →";
}

// ── Scroll progress ──────────────────────────────
const progress = document.querySelector(".progress");
window.addEventListener("scroll", () => {
  const h = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = (h ? (scrollY / h) * 100 : 0) + "%";
}, { passive: true });

// ── Mobile nav ───────────────────────────────────
const navEl  = document.getElementById("nav");
const menuBtn = document.querySelector(".menu");
menuBtn?.addEventListener("click", () => navEl.classList.toggle("open"));
document.querySelectorAll("header.nav nav a").forEach(a =>
  a.addEventListener("click", () => navEl.classList.remove("open"))
);

// ── Reveal on scroll ─────────────────────────────
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("show"); });
}, { threshold: 0.08 });
document.querySelectorAll(".reveal").forEach(el => revealObs.observe(el));

// ── Terminal typing animation ────────────────────
const typedEl  = document.getElementById("typed");
const outputEl = document.getElementById("term-output");
const blinkCur = document.getElementById("blink-cur");

const CMD = "Get-SysAdminProfile";

const OUTPUT = [
  { key: "Name",       val: "Abhinav Bajpai",           type: "str" },
  { key: "Role",       val: "Sr. System Administrator", type: "str" },
  { key: "Company",    val: "FIS, Pune",                type: "str" },
  { key: "Experience", val: "9+ Years",                 type: "val" },
  { key: "Operations", val: "24x7 Production",          type: "val" },
  { key: "Incidents",  val: "P1/P2 Ownership",          type: "val" },
  { key: "Status",     val: "Open to Opportunities",    type: "str" },
];

let charIdx = 0;

function typeCmd() {
  if (!typedEl) return;
  if (charIdx < CMD.length) {
    typedEl.textContent += CMD[charIdx++];
    setTimeout(typeCmd, 55 + Math.random() * 45);
  } else {
    // Pause, then show output
    blinkCur.style.display = "none";
    setTimeout(showOutput, 420);
  }
}

function showOutput() {
  if (!outputEl) return;

  outputEl.innerHTML = OUTPUT.map((d, i) =>
    `<div class="out-line" data-i="${i}">` +
      `<span class="out-arrow">&gt;</span>` +
      `<span class="out-key">${d.key.padEnd(12)}</span>` +
      `<span class="${d.type === "str" ? "out-str" : "out-val"}">${d.val}</span>` +
    `</div>`
  ).join("");

  const lines = outputEl.querySelectorAll(".out-line");
  lines.forEach((line, i) => {
    setTimeout(() => line.classList.add("show"), i * 130);
  });

  // Loop: clear and retype after a pause
  const totalDelay = OUTPUT.length * 130 + 3200;
  setTimeout(() => {
    outputEl.innerHTML = "";
    typedEl.textContent = "";
    charIdx = 0;
    blinkCur.style.display = "";
    setTimeout(typeCmd, 700);
  }, totalDelay);
}

// Start after load
window.addEventListener("load", () => {
  setTimeout(typeCmd, 1200);
});