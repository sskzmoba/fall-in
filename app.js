// Booking deadline: 31 Oct 2026, 11:59 PM IST
const DEADLINE = new Date("2026-10-31T23:59:59+05:30");
const SITE_URL = "https://adventures.sskzmoba.org/";

// ---- Countdown ----
const cd = document.getElementById("countdown");
const cdTime = document.getElementById("cd-time");
function tick() {
  const ms = DEADLINE - Date.now();
  if (ms <= 0) {
    cd.classList.add("closed");
    cd.querySelector(".countdown__label").textContent = "Booking deadline passed";
    cdTime.textContent = "WhatsApp a coordinator for waitlist seats";
    return;
  }
  const d = Math.floor(ms / 864e5);
  const h = Math.floor(ms / 36e5) % 24;
  const m = Math.floor(ms / 6e4) % 60;
  const s = Math.floor(ms / 1e3) % 60;
  const pad = n => String(n).padStart(2, "0");
  cdTime.textContent = `${d}d ${pad(h)}h ${pad(m)}m ${pad(s)}s`;
  setTimeout(tick, 1000);
}
tick();

// ---- Reveal on scroll ----
const io = new IntersectionObserver(entries => {
  for (const e of entries) {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

// ---- Sticky register dock: show after the hero ----
const dock = document.getElementById("dock");
new IntersectionObserver(([e]) => dock.classList.toggle("show", !e.isIntersecting), { threshold: 0.1 })
  .observe(document.querySelector(".hero"));

// ---- Share ----
const shareText = "FALL IN, KAZAKS! 🏍️ Malabar Days bike ride (23–25 Jan) & 🥾 Dawn @ Kolukkumalai trek (5–6 Dec). Every batch, one road. Book by 31 Oct:";
document.getElementById("share-btn").addEventListener("click", async () => {
  if (navigator.share) {
    try { await navigator.share({ title: "Fall In, Kazaks!", text: shareText, url: SITE_URL }); return; }
    catch (err) { if (err.name === "AbortError") return; }
  }
  window.open("https://wa.me/?text=" + encodeURIComponent(shareText + " " + SITE_URL), "_blank", "noopener");
});
