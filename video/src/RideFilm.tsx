import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { Big, Body, C, Eyebrow, Fade, ForestTrail, KenBurns, Pad, Pill, Rise, Shade, Stamp, Tag, clamp, inter, oswald } from "./FallIn";

// ~61 s ride-only film: sticker emblem → gear up → last January (full drone clip + full group) → THE FOREST TRAIL →
// route → trail moments (chital, elephant, peacock dance, hairpins, "if you're lucky") → riders → book
const T = {
  open: [0, 120],
  gear: [120, 250],
  last: [370, 270],
  intro: [640, 95],
  route: [735, 260],
  trail: [995, 500],
  riders: [1495, 130],
  end: [1625, 200],
} as const;
export const RIDE_FRAMES = 1825;

// Music: Kevin MacLeod, incompetech.com, CC BY 4.0, both level-matched (loudnorm). Part A runs from just after the
// engine; part B is the track's own ending, cut in on a bar line (a0/b0 in seconds) so the film ends on the music's finish.
const TRACKS = {
  chf: { src: "ride-music-chf.mp3", title: "Cool Hard Facts", a0: 0, b0: 120.05 },
  bigrock: { src: "ride-music-bigrock.mp3", title: "Big Rock", a0: 8, b0: 210.88 },
} as const;
export type RideProps = { music?: keyof typeof TRACKS };
const MUSIC_AT = 62;
const B_AT = T.end[0] - 10;

const RIDERS = "Kazak Rider Group · Nilgiris, Jan 2026";
const two = (n: number) => String(n).padStart(2, "0");
const KICKER: React.CSSProperties = { fontFamily: oswald, fontWeight: 500, fontSize: 38, letterSpacing: 10, color: C.amber };
const HEAD: React.CSSProperties = { fontFamily: oswald, fontWeight: 700, fontSize: 44, letterSpacing: 12, color: C.cream };

const Scene: React.FC<{ at: readonly [number, number]; children: React.ReactNode; edge?: number }> = ({ at, children, edge = 10 }) => (
  <Sequence from={at[0]} durationInFrames={at[1]}>
    <Fade edge={edge}>{children}</Fade>
  </Sequence>
);

// The Kazak Riders sticker as a lit emblem: blurred bike behind, glow, light sweep, an amber ring drawing round it
const Open: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const light = frame < 20 ? 0.45 : frame < 23 ? 0.95 : frame < 26 ? 0.4 : frame < 30 ? 1 : frame < 32 ? 0.65 : 1;
  const shake = frame > 18 && frame < 48 ? Math.sin(frame * 2.3) * 4 * (1 - (frame - 18) / 30) : 0;
  const pop = spring({ frame: frame - 18, fps, config: { damping: 13, stiffness: 120 } });
  const ring = interpolate(frame, [36, 72], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const sweep = interpolate(frame, [48, 82], [-30, 130], clamp);
  const glow = 0.6 + 0.25 * Math.sin(frame / 7);
  const txt = spring({ frame: frame - 62, fps, config: { damping: 16 } });
  const D = 640;
  const RR = D / 2 + 20;
  const circ = 2 * Math.PI * RR;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ opacity: light, transform: "scale(1.25)" }}>
        <Img src={staticFile("ride/headlamp.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(22px) brightness(.28) saturate(1.2)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(70% 45% at 50% 35%, transparent, rgba(0,0,0,.85))" }} />
      <div style={{ position: "absolute", left: (1080 - D) / 2, top: 300, width: D, height: D, transform: `translate(${shake}px, ${shake * 0.5}px) scale(${0.92 + 0.08 * pop})` }}>
        <div style={{ position: "absolute", inset: -170, borderRadius: "50%", background: "radial-gradient(circle, rgba(70,150,255,.5), rgba(227,27,35,.22) 45%, transparent 70%)", opacity: glow * light }} />
        <Img src={staticFile("ride/sticker.png")} style={{ position: "absolute", inset: 0, width: D, height: D, opacity: light, filter: "drop-shadow(0 30px 60px rgba(0,0,0,.8))" }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(115deg, transparent ${sweep - 18}%, rgba(255,255,255,.42) ${sweep}%, transparent ${sweep + 18}%)` }} />
        </div>
        <svg style={{ position: "absolute", left: -30, top: -30 }} width={D + 60} height={D + 60}>
          <circle cx={D / 2 + 30} cy={D / 2 + 30} r={RR} fill="none" stroke={C.amber} strokeWidth={4} strokeDasharray={circ} strokeDashoffset={circ * (1 - ring)} transform={`rotate(-90 ${D / 2 + 30} ${D / 2 + 30})`} />
        </svg>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1110, textAlign: "center", opacity: txt, transform: `translateY(${(1 - txt) * 30}px)` }}>
        <div style={{ ...KICKER, color: C.cream }}>SSKZM OBA · KAZAK BIKE RIDE</div>
        <Big size={150}>Engines</Big>
        <Big size={150} color={C.red}>
          on.
        </Big>
      </div>
    </AbsoluteFill>
  );
};

// Gear up: each piece of kit gets a gallery-print reveal (blurred backdrop, slow push-in, light sweep, flash cut)
const GEAR = [
  { src: "ride/bandana.jpg", label: "Bandana" },
  { src: "ride/scarf.jpg", label: "Scarf" },
  { src: "ride/tee.jpg", label: "Squad tee" },
  { src: "ride/flag.jpg", label: "Flag" },
  { src: "ride/stickers.jpg", label: "Stickers" },
];
const EACH = 40;

const GearItem: React.FC<{ src: string; label: string; i: number }> = ({ src, label, i }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 20, stiffness: 100 } });
  const push = interpolate(frame, [0, EACH], [1.08, 1], clamp);
  const flash = interpolate(frame, [0, 4], [0.18, 0], clamp);
  const sweep = interpolate(frame, [4, 30], [-40, 140], clamp);
  const line = interpolate(frame, [8, 22], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${1.3 - 0.06 * s})` }}>
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(40px) brightness(.3) saturate(1.3)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(90% 60% at 50% 42%, transparent, rgba(5,7,12,.85))" }} />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 300 }}>
        <div style={{ position: "relative", width: 820, height: 960, overflow: "hidden", borderRadius: 4, boxShadow: "0 50px 120px rgba(0,0,0,.85)", outline: "2px solid rgba(244,236,220,.3)", outlineOffset: 16, opacity: Math.min(1, s * 1.4), transform: `translateY(${(1 - s) * 60}px)` }}>
          <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${push})`, filter: "contrast(1.08) saturate(.92)" }} />
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(115deg, transparent ${sweep - 25}%, rgba(255,255,255,.26) ${sweep}%, transparent ${sweep + 25}%)` }} />
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 130, top: 1350 }}>
        <div style={KICKER}>
          {two(i + 1)} / {two(GEAR.length)}
        </div>
        <div style={{ opacity: s, transform: `translateX(${(1 - s) * -40}px)` }}>
          <Big size={120}>{label}</Big>
        </div>
        <div style={{ marginTop: 16, height: 5, width: 300 * line, background: C.red }} />
      </div>
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
    </AbsoluteFill>
  );
};

const Gear: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const done = GEAR.length * EACH;
  const ready = spring({ frame: frame - done - 10, fps, config: { damping: 14, stiffness: 140 } });
  return (
    <AbsoluteFill style={{ background: C.night }}>
      {GEAR.map((g, i) => (
        <Sequence key={g.src} from={i * EACH} durationInFrames={EACH}>
          <GearItem {...g} i={i} />
        </Sequence>
      ))}
      <Sequence from={done}>
        <AbsoluteFill style={{ flexDirection: "row", gap: 6, background: "#000" }}>
          {GEAR.map((g, k) => {
            const d = spring({ frame: frame - done - k * 3, fps, config: { damping: 18, stiffness: 140 } });
            return (
              <div key={g.src} style={{ flex: 1, overflow: "hidden", transform: `translateY(${(1 - d) * (k % 2 ? 1 : -1) * 1920}px)` }}>
                <Img src={staticFile(g.src)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(.4) saturate(1.1)" }} />
              </div>
            );
          })}
        </AbsoluteFill>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center" }}>
          <div style={{ opacity: ready, transform: `scale(${0.85 + 0.15 * ready})` }}>
            <div style={{ ...KICKER, color: C.cream }}>KIT CHECK · 5 / 5</div>
            <Big size={170} color={C.amber}>
              Squad
            </Big>
            <Big size={170}>ready.</Big>
          </div>
        </AbsoluteFill>
      </Sequence>
      <AbsoluteFill style={{ padding: "150px 130px 0", opacity: frame < done ? 1 : 0 }}>
        <div style={HEAD}>GEAR UP</div>
        <div style={{ marginTop: 10, height: 5, width: 220, background: C.red }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// A landscape clip shown whole (full width, uncropped) over a blurred copy of itself
const WideClip: React.FC<{ src: string; dur: number; top?: number }> = ({ src, dur, top = 360 }) => {
  const frame = useCurrentFrame();
  const z = interpolate(frame, [0, dur], [1, 1.05], clamp);
  return (
    <AbsoluteFill style={{ background: C.night, overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.3)", filter: "blur(40px) brightness(.45)" }} />
      <div style={{ position: "absolute", left: 0, top, width: 1080, height: 608, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,.6)" }}>
        <OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z})` }} />
      </div>
    </AbsoluteFill>
  );
};

// Last year: the banner as a print, the convoy (whole drone clip), then the whole group
const LastYear: React.FC = () => (
  <AbsoluteFill>
    <Sequence durationInFrames={75}>
      <KenBurns src="ride/banner.jpg" print from={1} to={1.06} />
      <Shade strength={0.75} />
      <Pad>
        <Rise delay={4}>
          <Eyebrow color={C.ride}>Last January</Eyebrow>
          <Big size={110}>Ride to Coonoor.</Big>
        </Rise>
      </Pad>
    </Sequence>
    <Sequence from={65} durationInFrames={110}>
      <Fade edge={10} inOnly>
        <WideClip src="ride-drone.mp4" dur={110} />
        <Tag>{RIDERS}</Tag>
        <Pad>
          <Rise delay={6}>
            <Eyebrow color={C.ride}>Last January</Eyebrow>
            <Big size={128}>One convoy.</Big>
          </Rise>
        </Pad>
      </Fade>
    </Sequence>
    <Sequence from={165}>
      <Fade edge={10} inOnly>
        <AbsoluteFill>
          <KenBurns src="ride/group.jpg" wide lift={420} from={1} to={1.05} />
          <Tag>{RIDERS}</Tag>
          <Pad>
            <Rise delay={4}>
              <Big size={128}>Every batch.</Big>
              <Big size={128} color={C.amber}>
                One road.
              </Big>
            </Rise>
          </Pad>
        </AbsoluteFill>
      </Fade>
    </Sequence>
  </AbsoluteFill>
);

const Intro: React.FC = () => (
  <AbsoluteFill>
    <KenBurns src="elephants-tall.jpg" from={1.02} to={1.12} />
    <Tag>On the route · Bandipur</Tag>
    <Shade strength={0.92} from="bottom" />
    <Pad>
      <Rise delay={0}>
        <Eyebrow color={C.ride}>This January · Kazak Bike Ride</Eyebrow>
      </Rise>
      <div style={{ margin: "26px 0 6px" }}>
        <Stamp delay={8} />
      </div>
      <Rise delay={18}>
        <Big size={124}>The Forest</Big>
        <Big size={124} color={C.amber}>
          Trail
        </Big>
      </Rise>
      <Rise delay={26}>
        <Body size={50}>23–25 January · +1 optional on 26th</Body>
      </Rise>
    </Pad>
  </AbsoluteFill>
);

// One trail moment: a landscape clip filling the top of the frame (fading into the dark), two lines of text below
const Moment: React.FC<{ src: string; dur: number; position?: string; eyebrow?: string; a: string; b: string; from?: number; to?: number; size?: number; filter?: string }> = ({ src, dur, position = "center", eyebrow, a, b, from = 1, to = 1.08, size = 128, filter }) => {
  const frame = useCurrentFrame();
  const z = interpolate(frame, [0, dur], [from, to], clamp);
  const mask = "linear-gradient(180deg, #000 72%, transparent 100%)";
  return (
    <AbsoluteFill style={{ background: C.night }}>
      <AbsoluteFill style={{ height: 1300, overflow: "hidden", WebkitMaskImage: mask, maskImage: mask }}>
        <OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: position, transform: `scale(${z})`, filter }} />
      </AbsoluteFill>
      <Pad>
        <Rise delay={6}>
          {eyebrow ? <Eyebrow color={C.ride}>{eyebrow}</Eyebrow> : null}
          <Big size={size}>{a}</Big>
          <Big size={size} color={C.amber}>
            {b}
          </Big>
        </Rise>
      </Pad>
    </AbsoluteFill>
  );
};

// "If you're lucky": tiger country, through a camera viewfinder; focus box locks on, shutter flash
const SPOTS = [
  { src: "ride/spot-tiger.jpg", label: "Tiger", fx: 0.74, fy: 0.55 },
  { src: "ride/spot-bear.jpg", label: "Sloth bear", fx: 0.33, fy: 0.4 },
  { src: "ride/spot-gaur.jpg", label: "Gaur", fx: 0.6, fy: 0.55 },
];
const SHOT = 35;
const VW = 880;
const VH = 1100;
const VX = 100;
const VY = 300;

const Sighting: React.FC<{ sp: (typeof SPOTS)[number]; i: number }> = ({ sp, i }) => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, SHOT], [1.2, 1.04], { ...clamp, easing: Easing.out(Easing.cubic) });
  const blur = interpolate(frame, [0, 9], [12, 0], clamp);
  const lock = interpolate(frame, [0, 10], [1.8, 1], { ...clamp, easing: Easing.out(Easing.back(1.5)) });
  const locked = frame >= 10;
  const flash = interpolate(frame, [10, 11, 16], [0, 0.45, 0], clamp);
  const label = interpolate(frame, [11, 19], [0, 1], clamp);
  const box = interpolate(frame, [SHOT - 7, SHOT - 2], [1, 0], clamp);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: VX, top: VY, width: VW, height: VH, overflow: "hidden" }}>
        <Img src={staticFile(sp.src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})`, transformOrigin: `${sp.fx * 100}% ${sp.fy * 100}%`, filter: `blur(${blur}px) contrast(1.06)` }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(80% 70% at 50% 50%, transparent 55%, rgba(0,0,0,.55))" }} />
        <div style={{ position: "absolute", left: sp.fx * VW - 110, top: sp.fy * VH - 110, width: 220, height: 220, border: `3px solid ${locked ? C.amber : "rgba(255,255,255,.85)"}`, transform: `scale(${lock})`, opacity: box }} />
        <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: flash }} />
      </div>
      <div style={{ position: "absolute", left: VX, top: VY + VH + 50, opacity: label, transform: `translateY(${(1 - label) * 20}px)` }}>
        <div style={KICKER}>
          SIGHTING {two(i + 1)} / {two(SPOTS.length)}
        </div>
        <Big size={120}>{sp.label}</Big>
      </div>
    </AbsoluteFill>
  );
};

const Corner: React.FC<{ v: "top" | "bottom"; h: "left" | "right" }> = ({ v, h }) => {
  const side = (k: string) => k[0].toUpperCase() + k.slice(1);
  return <div style={{ position: "absolute", [v]: -16, [h]: -16, width: 80, height: 80, [`border${side(v)}`]: `5px solid ${C.cream}`, [`border${side(h)}`]: `5px solid ${C.cream}` }} />;
};

const Lucky: React.FC = () => {
  const frame = useCurrentFrame();
  const at = Math.min(SPOTS.length - 1, Math.floor(frame / SHOT));
  const rec = Math.floor(frame / 12) % 2 === 0 ? 1 : 0.2;
  return (
    <AbsoluteFill style={{ background: C.night }}>
      <AbsoluteFill style={{ padding: "150px 100px 0" }}>
        <div style={HEAD}>IF YOU’RE LUCKY</div>
        <div style={{ marginTop: 10, fontFamily: inter, fontSize: 30, color: "rgba(244,236,220,.65)" }}>Bandipur and Sathyamangalam are tiger reserves</div>
      </AbsoluteFill>
      {SPOTS.map((sp, i) => (
        <Sequence key={sp.src} from={i * SHOT} durationInFrames={SHOT}>
          <Sighting sp={sp} i={i} />
        </Sequence>
      ))}
      <div style={{ position: "absolute", left: VX, top: VY, width: VW, height: VH }}>
        <Corner v="top" h="left" />
        <Corner v="top" h="right" />
        <Corner v="bottom" h="left" />
        <Corner v="bottom" h="right" />
        <div style={{ position: "absolute", left: 34, top: 28, fontFamily: inter, fontWeight: 700, fontSize: 28, letterSpacing: 3, color: "#fff" }}>
          <span style={{ color: "#ff3b3b", opacity: rec }}>●</span> REC
        </div>
        <div style={{ position: "absolute", right: 34, top: 36, display: "flex", gap: 10 }}>
          {SPOTS.map((sp, k) => (
            <div key={sp.src} style={{ width: 14, height: 14, borderRadius: 999, background: k <= at ? C.amber : "rgba(255,255,255,.35)" }} />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// The trail as moments: chital, an elephant, the dancers, the hairpins, then the big cats if you're lucky
const Trail: React.FC = () => (
  <AbsoluteFill>
    <Sequence durationInFrames={95}>
      <Moment src="ride/chital.mp4" dur={95} eyebrow="On the Forest Trail" a="Ride along" b="the chital." />
    </Sequence>
    <Sequence from={95} durationInFrames={90}>
      <Fade edge={8} inOnly>
        <Moment src="ride/elephant.mp4" dur={90} position="35% center" a="Stop." b="Elephants first." from={1.05} to={1.15} filter="saturate(.78) hue-rotate(10deg) brightness(.96)" />
      </Fade>
    </Sequence>
    <Sequence from={185} durationInFrames={105}>
      <Fade edge={8} inOnly>
        <Moment src="ride/peacock.mp4" dur={105} position="52% center" a="Ride past" b="the dancers." size={112} />
      </Fade>
    </Sequence>
    <Sequence from={290} durationInFrames={50}>
      <Fade edge={8} inOnly>
        <Moment src="ride/ghat.mp4" dur={50} position="60% center" eyebrow="Into the ghats" a="27 hairpins." b="Take them all." size={100} from={1} to={1.04} />
      </Fade>
    </Sequence>
    <Sequence from={335} durationInFrames={60}>
      <Fade edge={6} inOnly>
        <Moment src="ride/hairpin.mp4" dur={60} position="62% center" eyebrow="Into the ghats" a="27 hairpins." b="Take them all." size={100} from={1.04} to={1.1} />
      </Fade>
    </Sequence>
    <Sequence from={395}>
      <Fade edge={8} inOnly>
        <Lucky />
      </Fade>
    </Sequence>
  </AbsoluteFill>
);

const Riders: React.FC = () => (
  <AbsoluteFill>
    <Sequence durationInFrames={72}>
      <KenBurns src="ooty-road.mp4" video from={1} to={1.05} />
    </Sequence>
    <Sequence from={62}>
      <Fade edge={8} inOnly>
        <KenBurns src="ooty-pillion.mp4" video from={1} to={1.05} />
      </Fade>
    </Sequence>
    <Tag>{RIDERS}</Tag>
    <Shade strength={0.9} from="both" />
    <Pad>
      <Rise delay={4}>
        <Big size={150}>Lead.</Big>
        <Big size={112} color={C.amber}>
          Or keep pace.
        </Big>
      </Rise>
      <Rise delay={50}>
        <Body size={54} weight={800}>
          Pillion welcome. Full gear a must.
        </Body>
      </Rise>
    </Pad>
  </AbsoluteFill>
);

const End: React.FC<{ title: string }> = ({ title }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = spring({ frame, fps, config: { damping: 11, stiffness: 90 } });
  const halo = interpolate(frame, [36, 50, 80], [0, 1, 0], clamp);
  const haloSize = interpolate(frame, [36, 80], [0.8, 1.7], clamp);
  const flagSway = Math.sin(frame / 14) * 2;
  return (
    <AbsoluteFill style={{ background: C.night }}>
      <AbsoluteFill style={{ opacity: 0.35, transform: `rotate(${flagSway}deg) scale(1.15)` }}>
        <Img src={staticFile("ride/flag.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(6px) saturate(1.2)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(100% 60% at 50% 55%, rgba(7,11,20,.55), ${C.night} 80%)` }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 28, padding: "0 70px", textAlign: "center" }}>
        <div style={{ position: "relative", width: 280, height: 280 }}>
          <div style={{ position: "absolute", inset: -110, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,120,110,1) 0%, rgba(227,27,35,.55) 38%, rgba(227,27,35,0) 70%)", opacity: halo, transform: `scale(${haloSize})` }} />
          <Img src={staticFile("oba-logo.png")} style={{ position: "relative", width: 280, height: 280, transform: `scale(${logo}) rotate(${(1 - logo) * -40}deg)` }} />
        </div>
        <Rise delay={10}>
          <Big size={130}>Ride</Big>
          <Big size={130} color={C.amber}>
            with us
          </Big>
        </Rise>
        <Rise delay={24}>
          <Pill bg={C.red}>🏍️ The Forest Trail · 23–25 Jan</Pill>
        </Rise>
        <Rise delay={36}>
          <Big size={72}>Booking open</Big>
        </Rise>
        <Rise delay={48}>
          <Body size={50} color={C.amber}>
            adventures.sskzmoba.org/ride
          </Body>
        </Rise>
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "flex-end", padding: "0 60px 50px", textAlign: "center" }}>
        <div style={{ fontFamily: inter, fontSize: 15, lineHeight: 1.4, color: "rgba(169,179,196,.6)" }}>
          SSKZM OBA Communications Cell · Music: “{title}” Kevin MacLeod (incompetech.com), CC BY 4.0 · Engine: OllemanW (CC BY-SA 3.0)
          <br />
          Photos &amp; clips: Kazak Rider Group &amp; SSKZM OBA · Clips: Pexels · Peacock video: Rohit Sharma (CC BY-SA 4.0) · Via Wikimedia
          Commons: Namisharun, Harish Garg, Giles Laurent, Partha Majumdar, LakshmiNaresh (CC BY-SA 4.0), Pratheept2000, Jaseem Hamza (CC BY
          3.0), Dineshkannambadi, PP Yoonus (CC BY-SA 3.0)
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const RideFilm: React.FC<RideProps> = ({ music = "bigrock" }) => {
  const M = TRACKS[music];
  const aLen = B_AT + 15 - MUSIC_AT;
  return (
    <AbsoluteFill style={{ background: C.night }}>
      <Sequence from={T.open[0]} durationInFrames={T.open[1]}>
        <Open />
      </Sequence>
      <Scene at={T.gear} edge={6}>
        <Gear />
      </Scene>
      <Scene at={T.last}>
        <LastYear />
      </Scene>
      <Scene at={T.intro}>
        <Intro />
      </Scene>
      <Scene at={T.route} edge={12}>
        <ForestTrail />
      </Scene>
      <Scene at={T.trail}>
        <Trail />
      </Scene>
      <Scene at={T.riders}>
        <Riders />
      </Scene>
      <Sequence from={T.end[0]} durationInFrames={T.end[1]}>
        <Fade edge={10} inOnly>
          <End title={M.title} />
        </Fade>
      </Sequence>

      {/* Engine fires, then the track; its own ending cuts in under the end card */}
      <Sequence from={0} durationInFrames={126}>
        <Audio src={staticFile("engine.wav")} volume={(f) => interpolate(f, [0, 4, 90, 126], [0, 1, 0.8, 0], clamp)} />
      </Sequence>
      <Sequence from={MUSIC_AT} durationInFrames={aLen}>
        <Audio src={staticFile(M.src)} startFrom={Math.round(M.a0 * 30)} volume={(f) => interpolate(f, [0, 6, aLen - 15, aLen], [0, 1, 1, 0], clamp)} />
      </Sequence>
      <Sequence from={B_AT}>
        <Audio src={staticFile(M.src)} startFrom={Math.round(M.b0 * 30)} volume={(f) => interpolate(f, [0, 15, RIDE_FRAMES - B_AT - 20, RIDE_FRAMES - B_AT], [0, 1, 1, 0], clamp)} />
      </Sequence>
    </AbsoluteFill>
  );
};
