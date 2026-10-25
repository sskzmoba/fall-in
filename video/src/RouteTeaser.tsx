import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";
import { loadFont as loadStencil } from "@remotion/google-fonts/BlackOpsOne";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

// 15 s teaser for the proposed "Forest Trail" ride route. Standalone; not part of FallIn yet.
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
  d2: ["coimbatore", "annur", "sathy", "dhimbam", "chamarajanagar", "gundlupet", "bandipur", "mudumalai", "gudalur"],
  d3a: ["gudalur", "nadukani", "nilambur", "perinthalmanna", "thrissur", "kochi"],
  d3b: ["gudalur", "mudumalai", "bandipur", "gundlupet", "mysuru", "bengaluru"],
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

const Town: React.FC<{ n: string; label: string; show: number; dx?: number; dy?: number; big?: boolean; dim?: boolean }> = ({ n, label, show, dx = 22, dy = 10, big, dim }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [show, show + 10], [0, 1], clamp);
  const [x, y] = px(P[n]);
  return (
    <g opacity={o * (dim ? 0.55 : 1)}>
      <circle cx={x} cy={y} r={big ? 13 : 9} fill={dim ? C.muted : C.cream} />
      <text x={x + dx} y={y + dy} fill={C.cream} fontFamily={oswald} fontWeight={500} fontSize={big ? 38 : 30} textAnchor={dx < 0 ? "end" : "start"} style={{ paintOrder: "stroke", stroke: C.night, strokeWidth: 8 }}>
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
type Times = { d1: [number, number]; d2: [number, number]; d3: [number, number]; zoom: [number, number, number, number] };
const TEASER_T: Times = { d1: [45, 140], d2: [160, 290], d3: [300, 385], zoom: [150, 185, 290, 320] };
const along = ([a, b]: [number, number], f: number) => a + (b - a) * f;

export const RouteMap: React.FC<{ T?: Times }> = ({ T = TEASER_T }) => {
  const frame = useCurrentFrame();
  // Zoom into the forest stretch on day 2, back out for day 3
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
            <Trail names={R.d2} at={T.d2} color={C.amber} width={11} />
            <Trail names={R.d3a} at={T.d3} color={C.ride} />
            <Trail names={R.d3b} at={T.d3} color={C.ride} dashed />
            <Pulse n="coimbatore" at={T.d1[1]} />
            <Pulse n="gudalur" at={T.d2[1]} />

            <Town n="bengaluru" label="Bengaluru" show={T.d1[0] - 15} big />
            <Town n="kochi" label="Kochi" show={T.d1[0] - 15} big />
            <Town n="coimbatore" label="Coimbatore" show={along(T.d1, 0.8)} big dy={44} dx={-18} />
            <Town n="sathy" label="Sathyamangalam" show={along(T.d2, 0.12)} dx={-20} dy={40} />
            <Town n="dhimbam" label="Dhimbam Ghat" show={along(T.d2, 0.3)} dy={-16} />
            <Town n="gundlupet" label="Gundlupet" show={along(T.d2, 0.58)} dx={-20} dy={-14} />
            <Town n="bandipur" label="Bandipur" show={along(T.d2, 0.7)} dx={-20} />
            <Town n="gudalur" label="Gudalur" show={along(T.d2, 0.9)} dx={-20} dy={30} />
            <Town n="nilambur" label="Nilambur" show={along(T.d3, 0.35)} dx={-20} />
            <Town n="mysuru" label="Mysuru" show={along(T.d3, 0.47)} dx={-20} />
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ---------- Text and photos ----------

export const RouteHeader: React.FC<{ eyebrow?: string }> = ({ eyebrow = "KAZAK GHATS RIDE · 23–25 JAN 2027" }) => {
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
export const Photo: React.FC<{ src: string; caption: string; len: number }> = ({ src, caption, len }) => {
  const frame = useCurrentFrame();
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
        3 days · 2 Ghats · <span style={{ color: C.red }}>1 squad</span>
      </div>
      <div style={{ fontFamily: inter, fontWeight: 600, fontSize: 36, color: C.muted, marginTop: 14, lineHeight: 1.35 }}>
        Two routes: <span style={{ color: C.amber }}>Forest Trail via Sathyamangalam</span> or Malabar Days via Wayanad. Riders decide.
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

    <Sequence from={45} durationInFrames={105}>
      <DayLabel text="DAY 1" sub="Bengaluru & Kochi groups ride in to Coimbatore" />
    </Sequence>
    <Sequence from={150} durationInFrames={150}>
      <DayLabel text="DAY 2 · Into the wild" sub="Sathyamangalam → Gundlupet → Bandipur → Gudalur" stat="~220 km · 5–6 h in the saddle" />
    </Sequence>
    <Sequence from={300} durationInFrames={90}>
      <DayLabel text="DAY 3 · Home run" sub="Via Nilambur to Kochi · via Mysuru to Bengaluru" />
    </Sequence>
    <Sequence from={390}>
      <EndPanel />
    </Sequence>

    <Sequence from={166} durationInFrames={36}>
      <Photo src="route/sathy.jpg" caption="Sathyamangalam · forest villages & their stories" len={36} />
    </Sequence>
    <Sequence from={202} durationInFrames={32}>
      <Photo src="route/dhimbam.jpg" caption="Dhimbam Ghat · 27 hairpins" len={32} />
    </Sequence>
    <Sequence from={234} durationInFrames={32}>
      <Photo src="route/deer.jpg" caption="Bandipur · herds of spotted deer" len={32} />
    </Sequence>
    <Sequence from={266} durationInFrames={32}>
      <Photo src="route/bandipur.jpg" caption="Bandipur–Mudumalai · elephant country" len={32} />
    </Sequence>
    <Sequence from={302} durationInFrames={40}>
      <Photo src="route/gudalur.jpg" caption="Gudalur · tea country" len={40} />
    </Sequence>
    <Sequence from={342} durationInFrames={46}>
      <Photo src="route/nilambur.jpg" caption="Nilambur · world’s oldest teak plantation" len={46} />
    </Sequence>

    <AbsoluteFill style={{ justifyContent: "flex-end", padding: "0 60px 34px", textAlign: "center" }}>
      <div style={{ fontFamily: inter, fontSize: 19, color: "rgba(169,179,196,.7)", lineHeight: 1.4 }}>
        Proposed route · map illustrative · Music: “Intended Force” Kevin MacLeod (incompetech.com), CC BY 3.0
        <br />
        Photos via Wikimedia Commons: Murugavel.T, Jaseem Hamza, Dineshkannambadi, L. Shyamal, LakshmiNaresh, PP Yoonus (CC BY / BY-SA)
      </div>
    </AbsoluteFill>

    <Audio src={staticFile("music.mp3")} startFrom={30 * 20} volume={(f) => interpolate(f, [0, 15, ROUTE_FRAMES - 30, ROUTE_FRAMES], [0, 0.9, 0.9, 0], clamp)} />
  </AbsoluteFill>
);
