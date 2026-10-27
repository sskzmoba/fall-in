// Trek booking deadline: 31 Oct 2026, 11:59 PM IST (the ride has no fixed deadline: "Booking open")
const DEADLINE = new Date("2026-10-31T23:59:59+05:30");
const SITE_URL = "https://adventures.sskzmoba.org/";

// ---- Countdown ----
const cd = document.getElementById("countdown");
const cdTime = document.getElementById("cd-time");
function tick() {
  const ms = DEADLINE - Date.now();
  if (ms <= 0) {
    cd.classList.add("closed");
    cd.querySelector(".countdown__label").textContent = "Trek bookings closed · ride booking open";
    cdTime.textContent = "WhatsApp the trek lead for waitlist slots";
    document.getElementById("dock-label").textContent = "Ride booking open · trek: ask for the waitlist";
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

// ---- Remember photos: move on one photo every 3.5 s and loop round; a touch pauses it for a few seconds ----
const mem = document.querySelector(".memories");
if (mem && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const copy = mem.firstElementChild.cloneNode(true); // a copy of photo 1 after photo 4, so the loop never jumps back visibly
  copy.setAttribute("aria-hidden", "true");
  mem.append(copy);
  // fixed-width photos centred with equal side space, so every photo (and the copy) stops at the same place
  mem.classList.add("loop");
  const pad = () => { mem.style.paddingLeft = mem.style.paddingRight = (mem.clientWidth - copy.offsetWidth) / 2 + "px"; };
  pad();
  addEventListener("resize", pad);
  const loopLen = () => copy.offsetLeft - mem.firstElementChild.offsetLeft;
  const step = () => mem.children[1].offsetLeft - mem.children[0].offsetLeft;
  let onScreen = false, holdUntil = 0, settle;
  new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; }, { threshold: 0.4 }).observe(mem);
  ["pointerdown", "touchstart", "wheel"].forEach(ev => mem.addEventListener(ev, () => { holdUntil = Date.now() + 6000; }, { passive: true }));
  // once scrolling stops on the copy of photo 1, swap to the real photo 1 without animation
  mem.addEventListener("scroll", () => {
    clearTimeout(settle);
    settle = setTimeout(() => { if (mem.scrollLeft >= loopLen() - 4) mem.scrollTo({ left: mem.scrollLeft - loopLen(), behavior: "instant" }); }, 160);
  }, { passive: true });
  setInterval(() => { if (onScreen && Date.now() > holdUntil && !document.hidden) mem.scrollBy({ left: step(), behavior: "smooth" }); }, 3500);
}

// ---- One adventure at a time: ?a=trek or ?a=ride (from /trek and /ride) hides the other one ----
const only = new URLSearchParams(location.search).get("a");
if (only === "trek" || only === "ride") {
  document.body.classList.add("only-" + only);
  if (only === "ride") document.getElementById("dock-label").textContent = "Forest Trail · booking open";
  else if (DEADLINE > Date.now()) document.getElementById("dock-label").textContent = "Under 10 slots left · trek closes 31 Oct";
}

// ---- Short links (/trek, /ride) land on /#trek or /#ride: make sure we scroll there,
// some in-app browsers (WhatsApp) skip the jump ----
function goToHash() {
  const el = location.hash && document.getElementById(location.hash.slice(1));
  if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
}
window.addEventListener("load", () => setTimeout(goToHash, 50));
window.addEventListener("hashchange", goToHash);

// ---- Sticky register dock: show after the hero ----
const dock = document.getElementById("dock");
new IntersectionObserver(([e]) => dock.classList.toggle("show", !e.isIntersecting), { threshold: 0.1 })
  .observe(document.querySelector(".hero"));

// ---- Share ----
const shareText = "LET’S GO, KAZAKS! Saddle & Sole: two adventures, join one or both: 🥾 Dawn @ Kolukkumalai trek (5–6 Dec, book by 31 Oct) & 🏍️ Kazak bike ride (23–25 Jan, booking open). #KazakWanderlust";
document.getElementById("share-btn").addEventListener("click", async () => {
  if (navigator.share) {
    try { await navigator.share({ title: "Let’s go, Kazaks!", text: shareText, url: SITE_URL }); return; }
    catch (err) { if (err.name === "AbortError") return; }
  }
  window.open("https://wa.me/?text=" + encodeURIComponent(shareText + " " + SITE_URL), "_blank", "noopener");
});

// ---- Videos (promo film, last year's trek): open full screen on tap, close on ✕, Esc or when they end ----
const film = document.getElementById("film");
const filmVideo = document.getElementById("film-video");
let filmOpener = null;
function closeFilm() {
  filmVideo.pause();
  film.hidden = true;
  document.body.style.overflow = "";
  if (filmOpener) filmOpener.focus();
}
document.querySelectorAll("[data-film]").forEach(btn => btn.addEventListener("click", () => {
  filmOpener = btn;
  if (filmVideo.getAttribute("src") !== btn.dataset.film) {
    filmVideo.poster = btn.dataset.poster || "";
    filmVideo.src = btn.dataset.film;
  }
  film.hidden = false;
  document.body.style.overflow = "hidden";
  filmVideo.currentTime = 0;
  filmVideo.play().catch(() => {}); // a tap counts as a user gesture, so sound is allowed
}));
document.getElementById("film-close").addEventListener("click", closeFilm);
filmVideo.addEventListener("ended", closeFilm);
document.addEventListener("keydown", e => { if (e.key === "Escape" && !film.hidden) closeFilm(); });
