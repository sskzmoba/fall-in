import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";
import { loadFont as loadStencil } from "@remotion/google-fonts/BlackOpsOne";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

// 15 s teaser for the "Forest Trail" ride route (chosen by the riders, Oct 2026). FallIn reuses its map and cards.
const stencil = loadStencil().fontFamily;
const oswald = loadOswald("normal", { weights: ["500", "700"] }).fontFamily;
const inter = loadInter("normal", { weights: ["400", "600", "800"] }).fontFamily;

const C = { night: "#070b14", sea: "#0c2238", land: "#101826", amber: "#ffb648", cream: "#f4efe6", ride: "#ff7a7f", red: "#e31b23", ghat: "#2f9e5b", muted: "#a9b3c4" };

export const ROUTE_FRAMES = 450;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ---------- Map projection (illustrative, roughly to scale) ----------
type LL = [number, number]; // [lat, lon]
const MAP_TOP = 360;
const LAT0 = 13.15;
const LON0 = 75.2;
const px = ([lat, lon]: LL): [number, number] => [(lon - LON0) * 330, MAP_TOP + (LAT0 - lat) * 337];

const P: Record<string, LL> = {
  bengaluru: [12.97, 77.59],
  hosur: [12.74, 77.83],
  krishnagiri: [12.52, 78.21],
  salem: [11.66, 78.15],
  erode: [11.34, 77.72],
  coimbatore: [11.02, 76.96],
  kochi: [9.93, 76.26],
  kozhikode: [11.25, 75.78],
  malappuram: [11.07, 76.07],
  bhavanisagar: [11.47, 77.11],
  thrissur: [10.53, 76.21],
  palakkad: [10.78, 76.65],
  annur: [11.23, 77.1],
  sathy: [11.5, 77.24],
  dhimbam: [11.6, 77.1],
  chamarajanagar: [11.92, 76.94],
  gundlupet: [11.81, 76.69],
  bandipur: [11.67, 76.63],
  mudumalai: [11.57, 76.58],
  gudalur: [11.5, 76.49],
  nadukani: [11.46, 76.38],
  nilambur: [11.28, 76.23],
  perinthalmanna: [10.98, 76.23],
  mysuru: [12.3, 76.64],
  ooty: [11.41, 76.7],
};

const COAST: LL[] = [
  [13.3, 74.65], [12.87, 74.84], [12.5, 74.98], [12.2, 75.1], [11.87, 75.37], [11.5, 75.62], [11.25, 75.78],
  [10.95, 75.88], [10.77, 75.92], [10.5, 76.05], [10.2, 76.17], [9.93, 76.26], [9.5, 76.32],
];
const WESTERN_GHATS: LL[] = [[13.3, 75.45], [12.6, 75.6], [12.0, 75.8], [11.65, 76.1], [11.42, 76.6], [11.1, 76.75], [10.55, 76.85], [10.2, 77.05], [9.6, 77.15]];
const EASTERN_GHATS: LL[] = [[11.45, 76.95], [11.6, 77.3], [11.95, 77.6], [12.35, 78.0], [12.9, 78.45]];

// Routes as town lists
const R = {
  d1a: ["bengaluru", "hosur", "krishnagiri", "salem", "erode", "coimbatore"],
  d1b: ["kochi", "thrissur", "palakkad", "coimbatore"],
  d1c: ["kozhikode", "malappuram", "perinthalmanna", "palakkad", "coimbatore"],
  d2: ["coimbatore", "annur", "bhavanisagar", "sathy", "dhimbam", "chamarajanagar"],
  d3: ["chamarajanagar", "gundlupet", "bandipur", "mudumalai", "gudalur"],
  d4a: ["gudalur", "nadukani", "nilambur", "perinthalmanna", "thrissur", "kochi"],
  d4b: ["gudalur", "mudumalai", "bandipur", "gundlupet", "mysuru", "bengaluru"],
};
const pts = (names: string[]) => names.map((n) => px(P[n]));

// Part of a polyline (0..1 of its length), plus the point at its tip
function partial(points: [number, number][], t: number) {
  const seg = points.slice(1).map((p, i) => Math.hypot(p[0] - points[i][0], p[1] - points[i][1]));
  const total = seg.reduce((a, b) => a + b, 0);
  let left = total * Math.max(0, Math.min(1, t));
  const out: [number, number][] = [points[0]];
  for (let i = 0; i < seg.length; i++) {
    if (left >= seg[i]) {
      out.push(points[i + 1]);
      left -= seg[i];
    } else {
      const k = seg[i] ? left / seg[i] : 0;
      out.push([points[i][0] + (points[i + 1][0] - points[i][0]) * k, points[i][1] + (points[i + 1][1] - points[i][1]) * k]);
      break;
    }
  }
  return { d: out.map((p) => p.join(",")).join(" "), tip: out[out.length - 1] };
}

const Trail: React.FC<{ names: string[]; at: [number, number]; color: string; dashed?: boolean; width?: number }> = ({ names, at, color, dashed, width = 9 }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, at, [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  if (t <= 0) return null;
  const { d, tip } = partial(pts(names), t);
  return (
    <g>
      <polyline points={d} fill="none" stroke={color} strokeOpacity={0.25} strokeWidth={width + 14} strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dashed ? "2 18" : undefined} />
      {t < 1 && <circle cx={tip[0]} cy={tip[1]} r={16} fill={C.cream} stroke={color} strokeWidth={6} />}
    </g>
  );
};

// `halt` = overnight stop: amber ring and label; `hide` fades the town out (e.g. before it leaves the frame on zoom)
const Town: React.FC<{ n: string; label: string; show: number; hide?: number; dx?: number; dy?: number; big?: boolean; dim?: boolean; halt?: boolean }> = ({ n, label, show, hide = 1e6, dx = 22, dy = 10, big, dim, halt }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [show, show + 10], [0, 1], clamp) * interpolate(frame, [hide, hide + 8], [1, 0], clamp);
  const [x, y] = px(P[n]);
  return (
    <g opacity={o * (dim ? 0.55 : 1)}>
      {halt && <circle cx={x} cy={y} r={22} fill="none" stroke={C.amber} strokeWidth={5} />}
      <circle cx={x} cy={y} r={big ? 13 : 9} fill={dim ? C.muted : halt ? C.amber : C.cream} />
      <text x={x + dx} y={y + dy} fill={halt ? C.amber : C.cream} fontFamily={oswald} fontWeight={500} fontSize={big ? 38 : 30} textAnchor={dx < 0 ? "end" : "start"} style={{ paintOrder: "stroke", stroke: C.night, strokeWidth: 8 }}>
        {label}
      </text>
    </g>
  );
};

const Pulse: React.FC<{ n: string; at: number }> = ({ n, at }) => {
  const frame = useCurrentFrame();
  const [x, y] = px(P[n]);
  const k = interpolate(frame, [at, at + 24], [0, 1], clamp);
  if (k <= 0 || k >= 1) return null;
  return <circle cx={x} cy={y} r={14 + 70 * k} fill="none" stroke={C.amber} strokeWidth={6} opacity={1 - k} />;
};

// When each day's trail draws, and the zoom in/out frames; the film uses a faster version
export type Times = { d1: [number, number]; d2: [number, number]; d3: [number, number]; d4: [number, number]; zoom: [number, number, number, number] };
const TEASER_T: Times = { d1: [45, 115], d2: [125, 235], d3: [240, 320], d4: [328, 378], zoom: [120, 155, 318, 345] };
const along = ([a, b]: [number, number], f: number) => a + (b - a) * f;

export const RouteMap: React.FC<{ T?: Times }> = ({ T = TEASER_T }) => {
  const frame = useCurrentFrame();
  // Zoom into the forest stretch for days 2–3, back out for the ride home
  // (k = how far into the zoom; the forest centre slides up to sit above the photo cards)
  const k = interpolate(frame, T.zoom, [0, 1, 1, 0], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const zoom = 1 + 0.9 * k;
  const [fx, fy] = px([11.7, 76.87]);
  const cx = fx + (540 - fx) * k;
  const cy = fy + (690 - fy) * k;
  const fade = interpolate(frame, [0, 20], [0, 1], clamp);
  const sea = [...COAST.map(px), [-50, 1900], [-50, 0]].map((p) => p.join(",")).join(" ");
  const ghats = (l: LL[]) => l.map(px).map((p) => p.join(",")).join(" ");
  const [wx, wy] = px([12.35, 75.72]);
  const [ex, ey] = px([12.25, 78.05]);
  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <defs>
          <clipPath id="mapclip">
            <rect x={0} y={MAP_TOP - 40} width={1080} height={1130} />
          </clipPath>
          <filter id="soft">
            <feGaussianBlur stdDeviation={10} />
          </filter>
        </defs>
        <g clipPath="url(#mapclip)">
          <g transform={`translate(${cx} ${cy}) scale(${zoom}) translate(${-fx} ${-fy})`}>
            <rect x={-200} y={0} width={1500} height={1920} fill={C.land} />
            <polygon points={sea} fill={C.sea} />
            <text x={70} y={px([10.9, 0])[1]} fill="#2b4d70" fontFamily={oswald} fontSize={34} letterSpacing={6} transform={`rotate(-62 70 ${px([10.9, 0])[1]})`}>
              ARABIAN SEA
            </text>
            <polyline points={ghats(WESTERN_GHATS)} fill="none" stroke={C.ghat} strokeOpacity={0.45} strokeWidth={70} strokeLinecap="round" strokeLinejoin="round" filter="url(#soft)" />
            <polyline points={ghats(EASTERN_GHATS)} fill="none" stroke={C.ghat} strokeOpacity={0.35} strokeWidth={60} strokeLinecap="round" strokeLinejoin="round" filter="url(#soft)" />
            <text x={wx} y={wy} fill="#5fbf86" fontFamily={oswald} fontSize={28} letterSpacing={5} transform={`rotate(-75 ${wx} ${wy})`}>
              WESTERN GHATS
            </text>
            <text x={ex} y={ey} fill="#5fbf86" fontFamily={oswald} fontSize={28} letterSpacing={5} transform={`rotate(-48 ${ex} ${ey})`}>
              EASTERN GHATS
            </text>

            <Trail names={R.d1a} at={T.d1} color={C.ride} />
            <Trail names={R.d1b} at={[along(T.d1, 0.1), T.d1[1]]} color={C.ride} />
            <Trail names={R.d1c} at={[along(T.d1, 0.15), T.d1[1]]} color={C.ride} />
            <Trail names={R.d2} at={T.d2} color={C.amber} width={11} />
            <Trail names={R.d3} at={T.d3} color={C.amber} width={11} />
            <Trail names={R.d4a} at={T.d4} color={C.ride} dashed />
            <Trail names={R.d4b} at={T.d4} color={C.ride} dashed />
            <Pulse n="coimbatore" at={T.d1[1]} />
            <Pulse n="chamarajanagar" at={T.d2[1]} />
            <Pulse n="gudalur" at={T.d3[1]} />

            <Town n="bengaluru" label="Bengaluru" show={T.d1[0] - 15} big />
            <Town n="kochi" label="Kochi" show={T.d1[0] - 15} big />
            <Town n="kozhikode" label="Kozhikode" show={T.d1[0] - 15} hide={T.zoom[0]} big />
            <Town n="coimbatore" label="Coimbatore" show={along(T.d1, 0.8)} big halt dy={50} dx={-26} />
            <Town n="sathy" label="Sathyamangalam" show={along(T.d2, 0.45)} dx={-20} dy={44} />
            <Town n="dhimbam" label="Dhimbam Ghat" show={along(T.d2, 0.7)} dy={-16} dx={26} />
            <Town n="chamarajanagar" label="Chamarajanagar" show={along(T.d2, 0.9)} halt dx={28} dy={-14} />
            <Town n="bandipur" label="Bandipur" show={along(T.d3, 0.45)} dx={-28} />
            <Town n="gudalur" label="Gudalur" show={along(T.d3, 0.9)} halt dx={-28} dy={36} />
            <Town n="nilambur" label="Nilambur" show={along(T.d4, 0.35)} dx={-20} />
            <Town n="mysuru" label="Mysuru" show={along(T.d4, 0.47)} dx={-20} />
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ---------- Text and photos ----------

export const RouteHeader: React.FC<{ eyebrow?: string }> = ({ eyebrow = "NEW ROUTE · 23–25 JAN 2027" }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [5, 25], [0, 1], clamp);
  const y = interpolate(frame, [5, 25], [30, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ padding: "90px 70px 0", opacity: o, transform: `translateY(${y}px)` }}>
      <div style={{ fontFamily: oswald, fontWeight: 500, fontSize: 32, letterSpacing: 6, color: C.ride }}>{eyebrow}</div>
      <div style={{ fontFamily: stencil, fontSize: 104, lineHeight: 1.05, color: C.cream }}>
        The <span style={{ color: C.amber }}>Forest Trail</span>
      </div>
      <div style={{ fontFamily: inter, fontWeight: 600, fontSize: 36, color: C.muted, marginTop: 6 }}>Where the Western &amp; Eastern Ghats meet</div>
    </AbsoluteFill>
  );
};

export const DayLabel: React.FC<{ text: string; sub: string; stat?: string }> = ({ text, sub, stat }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 10], [0, 1], clamp);
  const so = interpolate(frame, [20, 32], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ top: 1490, padding: "0 70px", opacity: o }}>
      <div style={{ fontFamily: oswald, fontWeight: 700, fontSize: 64, color: C.amber, letterSpacing: 2 }}>{text}</div>
      <div style={{ fontFamily: inter, fontWeight: 600, fontSize: 40, color: C.cream, marginTop: 6 }}>{sub}</div>
      {stat && (
        <div style={{ alignSelf: "flex-start", marginTop: 14, padding: "8px 20px", borderRadius: 999, background: C.red, fontFamily: oswald, fontWeight: 700, fontSize: 36, color: C.cream, opacity: so }}>
          {stat}
        </div>
      )}
    </AbsoluteFill>
  );
};

// A photo card that rises in over the lower part of the map
// `count` ticks a badge from 1 up to that number (hairpins) while the card is up
export const Photo: React.FC<{ src: string; caption: string; len: number; count?: number }> = ({ src, caption, len, count }) => {
  const frame = useCurrentFrame();
  const n = count ? Math.round(interpolate(frame, [4, len - 8], [1, count], clamp)) : 0;
  const o = interpolate(frame, [0, 8, len - 6, len], [0, 1, 1, 0], clamp);
  const y = interpolate(frame, [0, 10], [40, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const s = interpolate(frame, [0, len], [1, 1.08], clamp);
  return (
    <AbsoluteFill style={{ top: 1060, left: 60, width: 960, height: 400, opacity: o, transform: `translateY(${y}px)` }}>
      <div style={{ position: "relative", width: 960, height: 400, borderRadius: 24, overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,.6)", border: `3px solid ${C.cream}` }}>
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s})` }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "40px 28px 18px", background: "linear-gradient(transparent, rgba(7,11,20,.9))", fontFamily: oswald, fontWeight: 700, fontSize: 40, color: C.cream }}>
          {caption}
        </div>
        {count && (
          <div style={{ position: "absolute", top: 18, right: 18, padding: "8px 18px", borderRadius: 14, background: C.red, fontFamily: oswald, fontWeight: 700, fontSize: 40, color: C.cream, letterSpacing: 2 }}>
            HAIRPIN {n}/{count}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

const EndPanel: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 12], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ top: 1470, padding: "0 70px", opacity: o }}>
      <div style={{ fontFamily: stencil, fontSize: 66, color: C.cream }}>
        2 Ghats · 3 days · <span style={{ color: C.red }}>1 squad</span>
      </div>
      <div style={{ fontFamily: inter, fontWeight: 600, fontSize: 36, color: C.muted, marginTop: 14, lineHeight: 1.35 }}>
        <span style={{ color: C.amber }}>Chosen by the riders.</span> Stay on for Republic Day (26 Jan) if you like.
      </div>
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 40, color: C.amber, marginTop: 18 }}>adventures.sskzmoba.org</div>
    </AbsoluteFill>
  );
};

// Darkens the top (title) and bottom (captions) bands over the map
export const MapShade: React.FC = () => (
  <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.night} 0%, rgba(7,11,20,.85) 14%, rgba(7,11,20,0) 22%, rgba(7,11,20,0) 72%, ${C.night} 79%)` }} />
);

export const RouteTeaser: React.FC = () => (
  <AbsoluteFill style={{ background: C.night }}>
    <RouteMap />
    <MapShade />
    <RouteHeader />

    <Sequence from={45} durationInFrames={80}>
      <DayLabel text="DAY 1 · Ride in" sub="Bengaluru, Kochi & Kozhikode → Coimbatore" />
    </Sequence>
    <Sequence from={125} durationInFrames={115}>
      <DayLabel text="DAY 2 · Sathyamangalam" sub="Bhavanisagar, forest villages, Dhimbam hairpins" />
    </Sequence>
    <Sequence from={240} durationInFrames={85}>
      <DayLabel text="DAY 3 · Bandipur" sub="Elephant country → Gudalur" />
    </Sequence>
    <Sequence from={325} durationInFrames={60}>
      <DayLabel text="Home run" sub="Via Nilambur or Mysuru · +1 day optional" />
    </Sequence>
    <Sequence from={385}>
      <EndPanel />
    </Sequence>

    <Sequence from={128} durationInFrames={30}>
      <Photo src="route/dam.jpg" caption="Bhavanisagar dam" len={30} />
    </Sequence>
    <Sequence from={158} durationInFrames={34}>
      <Photo src="route/sathy.jpg" caption="Sathyamangalam · forest villages & their stories" len={34} />
    </Sequence>
    <Sequence from={192} durationInFrames={46}>
      <Photo src="route/ghatroad.jpg" caption="Dhimbam Ghat" len={46} count={27} />
    </Sequence>
    <Sequence from={242} durationInFrames={30}>
      <Photo src="route/elephants.jpg" caption="Bandipur · elephant country" len={30} />
    </Sequence>
    <Sequence from={272} durationInFrames={26}>
      <Photo src="route/deer.jpg" caption="Herds of spotted deer" len={26} />
    </Sequence>
    <Sequence from={298} durationInFrames={28}>
      <Photo src="route/gudalur.jpg" caption="Gudalur · tea country" len={28} />
    </Sequence>
    <Sequence from={330} durationInFrames={52}>
      <Photo src="route/nilambur.jpg" caption="Nilambur · world’s oldest teak plantation" len={52} />
    </Sequence>

    <AbsoluteFill style={{ justifyContent: "flex-end", padding: "0 60px 34px", textAlign: "center" }}>
      <div style={{ fontFamily: inter, fontSize: 19, color: "rgba(169,179,196,.7)", lineHeight: 1.4 }}>
        Map illustrative · Music: “Intended Force” Kevin MacLeod (incompetech.com), CC BY 3.0
        <br />
        Photos via Wikimedia Commons: Pratheept2000, Murugavel.T, Jaseem Hamza, Namisharun, Dineshkannambadi, LakshmiNaresh, PP Yoonus (CC BY / BY-SA)
      </div>
    </AbsoluteFill>

    <Audio src={staticFile("music.mp3")} startFrom={30 * 20} volume={(f) => interpolate(f, [0, 15, ROUTE_FRAMES - 30, ROUTE_FRAMES], [0, 0.9, 0.9, 0], clamp)} />
  </AbsoluteFill>
);
