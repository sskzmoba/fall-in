import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp } from "./FallIn";

// Clean, animated versions of the Kazak Riders kit, built from the real artwork
// (riders art cut from the Kazak Bikers banner, OBA logo), so nothing looks crumpled or faded.
const RIDERS = "ride/riders-art.png";
const LOGO = "oba-logo.png";
const RED = "#d7262e";
const NAVY = "#1b2a52";

// The Kazak Riders sticker, redrawn: red rim, blue ring, sky-blue face, red lettering, three riders
export const Sticker: React.FC<{ size: number; sweep?: number; shadow?: boolean }> = ({ size, sweep = -100, shadow = true }) => (
  <div style={{ position: "relative", width: size, height: size, borderRadius: "50%", boxShadow: shadow ? "0 24px 60px rgba(0,0,0,.5)" : undefined }}>
    <svg viewBox="-100 -100 200 200" width={size} height={size} style={{ position: "absolute", inset: 0 }}>
      <circle r="100" fill={RED} />
      <circle r="86" fill="#1f3c94" />
      <circle r="74" fill="#5cc0e6" />
      <text x="0" y="3" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="17.5" fill={RED}>
        KAZAK RIDERS
      </text>
    </svg>
    <Img src={staticFile(RIDERS)} style={{ position: "absolute", left: size * 0.13, top: size * 0.54, width: size * 0.47 }} />
    <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(60% 45% at 32% 22%, rgba(255,255,255,.32), transparent 62%)" }} />
    <div style={{ position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(115deg, transparent ${sweep - 16}%, rgba(255,255,255,.5) ${sweep}%, transparent ${sweep + 16}%)` }} />
    </div>
  </div>
);

// Fabric shading laid over a flat shape: soft light from the top left, fine weave grain
const Fabric: React.FC<{ radius?: string }> = ({ radius }) => (
  <>
    <div style={{ position: "absolute", inset: 0, borderRadius: radius, background: "radial-gradient(90% 80% at 30% 20%, rgba(255,255,255,.16), transparent 60%), linear-gradient(160deg, transparent 55%, rgba(0,0,0,.28))" }} />
    <div style={{ position: "absolute", inset: 0, borderRadius: radius, backgroundImage: `url(${staticFile("ride/grain.png")})`, backgroundSize: "128px", opacity: 0.08, mixBlendMode: "overlay" }} />
  </>
);

// A flag face: red, OBA logo top left, riders lower right (as on the real flag)
const FlagFace: React.FC<{ w: number; h: number }> = ({ w, h }) => (
  <div style={{ position: "relative", width: w, height: h, background: `linear-gradient(180deg, #e3343b, ${RED} 60%, #b81d25)` }}>
    <Img src={staticFile(LOGO)} style={{ position: "absolute", left: w * 0.07, top: h * 0.08, width: h * 0.4 }} />
    <Img src={staticFile(RIDERS)} style={{ position: "absolute", right: w * 0.06, bottom: h * 0.08, width: w * 0.46 }} />
  </div>
);

// Waving flag: the face is sliced into vertical strips that ride a travelling sine wave, with light and shade
export const WavingFlag: React.FC<{ w: number; h: number }> = ({ w, h }) => {
  const frame = useCurrentFrame();
  const N = 72;
  const sw = w / N;
  return (
    <div style={{ position: "relative", width: w, height: h * 1.25 }}>
      <div style={{ position: "absolute", left: -16, top: -30, width: 16, height: h * 1.55, borderRadius: 8, background: "linear-gradient(90deg, #6b6f78, #d9dce2 45%, #50545c)" }} />
      {Array.from({ length: N }, (_, i) => {
        const t = i / N;
        const ph = frame / 6 - i * 0.16;
        const dy = Math.sin(ph) * h * 0.05 * t;
        const shade = Math.cos(ph) * 0.1 * (0.3 + t);
        return (
          <div key={i} style={{ position: "absolute", left: i * sw, top: dy, width: sw + 1, height: h, overflow: "hidden" }}>
            <div style={{ position: "absolute", left: -i * sw, top: 0 }}>
              <FlagFace w={w} h={h} />
            </div>
            <div style={{ position: "absolute", inset: 0, background: shade > 0 ? `rgba(255,255,255,${shade * 0.6})` : `rgba(0,0,0,${-shade})` }} />
          </div>
        );
      })}
    </div>
  );
};

// Squad tee: a clean red tee with the OBA crest and KAZAK RIDERS on the chest, riders at the hem
export const Tee: React.FC<{ w: number }> = ({ w }) => {
  const frame = useCurrentFrame();
  const h = w * 1.05;
  const sweep = interpolate(frame, [6, 34], [-30, 130], clamp);
  const path = "M120 20 L70 34 L8 96 L52 156 L92 130 L92 404 L308 404 L308 130 L348 156 L392 96 L330 34 L280 20 Q200 74 120 20 Z";
  return (
    <div style={{ position: "relative", width: w, height: h, filter: "drop-shadow(0 30px 50px rgba(0,0,0,.55))" }}>
      <svg viewBox="0 0 400 420" width={w} height={h} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="teeg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#e8434a" />
            <stop offset=".55" stopColor={RED} />
            <stop offset="1" stopColor="#a8171f" />
          </linearGradient>
          <clipPath id="teec">
            <path d={path} />
          </clipPath>
          <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="0" gradientTransform="rotate(25)">
            <stop offset={Math.max(0, (sweep - 15) / 100)} stopColor="#fff" stopOpacity="0" />
            <stop offset={Math.min(1, Math.max(0, sweep / 100))} stopColor="#fff" stopOpacity=".28" />
            <stop offset={Math.min(1, Math.max(0, (sweep + 15) / 100))} stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={path} fill="url(#teeg)" />
        <path d="M120 20 Q200 74 280 20" fill="none" stroke="#8e141b" strokeWidth="7" />
        <g clipPath="url(#teec)">
          <rect x="0" y="0" width="400" height="420" fill="url(#sheen)" />
        </g>
      </svg>
      <Img src={staticFile(LOGO)} style={{ position: "absolute", left: w * 0.6, top: h * 0.2, width: w * 0.13 }} />
      <div style={{ position: "absolute", left: w * 0.555, top: h * 0.335, width: w * 0.22, textAlign: "center", fontFamily: "Arial, Helvetica, sans-serif", fontWeight: 700, fontSize: w * 0.03, color: "#fff", letterSpacing: 0.5 }}>KAZAK RIDERS</div>
      <Img src={staticFile(RIDERS)} style={{ position: "absolute", left: w * 0.27, top: h * 0.74, width: w * 0.22 }} />
    </div>
  );
};

// Bandana: the navy square with a crest in two corners, floating with a slow 3D tilt
export const Bandana: React.FC<{ size: number }> = ({ size }) => {
  const frame = useCurrentFrame();
  const rx = 18 + Math.sin(frame / 18) * 6;
  const rz = -8 + Math.sin(frame / 25) * 4;
  return (
    <div style={{ perspective: 1400 }}>
      <div style={{ position: "relative", width: size, height: size, background: `linear-gradient(135deg, #24366a, ${NAVY})`, borderRadius: 6, transform: `rotateX(${rx}deg) rotateZ(${rz}deg)`, boxShadow: "0 40px 80px rgba(0,0,0,.6)" }}>
        <Img src={staticFile(LOGO)} style={{ position: "absolute", left: size * 0.07, top: size * 0.07, width: size * 0.24 }} />
        <Img src={staticFile(LOGO)} style={{ position: "absolute", right: size * 0.07, bottom: size * 0.07, width: size * 0.24 }} />
        <Fabric radius="6px" />
      </div>
    </div>
  );
};

// Scarf: the navy triangle with the crest, swinging gently from its top edge
export const Scarf: React.FC<{ w: number }> = ({ w }) => {
  const frame = useCurrentFrame();
  const h = w * 0.62;
  const swing = Math.sin(frame / 14) * 5;
  const clip = "polygon(0 0, 100% 0, 50% 100%)";
  return (
    <div style={{ filter: "drop-shadow(0 30px 50px rgba(0,0,0,.55))", transformOrigin: "50% 0", transform: `rotateZ(${swing * 0.4}deg) skewX(${swing * 0.6}deg)` }}>
      <div style={{ position: "relative", width: w, height: h, clipPath: clip, background: `linear-gradient(180deg, #24366a, ${NAVY})` }}>
        <Img src={staticFile(LOGO)} style={{ position: "absolute", left: w * 0.5 - w * 0.11, top: h * 0.22, width: w * 0.22 }} />
        <Fabric />
      </div>
    </div>
  );
};

// A fan of three fresh stickers sliding in
export const StickerFan: React.FC<{ size: number }> = ({ size }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ position: "relative", width: size * 2.2, height: size * 1.2 }}>
      {[-14, 10, 0].map((r, k) => {
        const s = spring({ frame: frame - k * 5, fps, config: { damping: 15, stiffness: 120 } });
        const x = [0, size * 1.2, size * 0.6][k];
        const y = [size * 0.15, size * 0.12, 0][k];
        const sweep = interpolate(frame, [14 + k * 4, 34 + k * 4], [-30, 130], clamp);
        return (
          <div key={k} style={{ position: "absolute", left: x, top: y + (1 - s) * 500, opacity: s, transform: `rotate(${r}deg)` }}>
            <Sticker size={size} sweep={sweep} />
          </div>
        );
      })}
    </div>
  );
};

// Soft spotlight stage for a kit item
export const Stage: React.FC<{ children: React.ReactNode; tint?: string }> = ({ children, tint = "rgba(227,27,35,.18)" }) => (
  <AbsoluteFill style={{ background: `radial-gradient(70% 45% at 50% 42%, ${tint}, #070b14 75%)`, alignItems: "center", justifyContent: "center", paddingBottom: 380 }}>
    {children}
  </AbsoluteFill>
);
