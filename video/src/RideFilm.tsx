import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadBarlow } from "@remotion/google-fonts/Barlow";
import { C, Fade, KenBurns, Pill, Rise, Shade, Stamp, clamp, inter } from "./FallIn";
import { Sticker } from "./RideKit";
import { MapShade, RouteMap, type Times } from "./RouteTeaser";

// v7, ~62 s ride-only film, in story order: the sticker on the bike → "We marched under one flag" (school parade) →
// "Now we ride under one" (the riders' real flag) → our last ride, Jan 2026 (out the gates at Trivandrum and Ooty,
// one ride to Coonoor, the drone pulling away, "Back for more.") → the date flips to 2027 with an engine rev → misty road, THE FOREST TRAIL → route → one continuous pass from the saddle (chital, elephant,
// peacocks) → 27 hairpins → if you're lucky → riders → book. One grade and grain over everything; cuts sit on Big Rock onsets.
const T = {
  open: [0, 120],
  flag: [120, 149],
  last: [269, 349],
  flip: [618, 50],
  mist: [668, 92],
  intro: [760, 100],
  route: [860, 199],
  trail: [1059, 466],
  riders: [1525, 159],
  end: [1684, 176],
} as const;
export const RIDE_FRAMES = 1860;
const FLAG_CUT = 66; // parade → flag

// Two music versions. "bigrock": Kevin MacLeod (CC BY 4.0), one continuous take entering on the parade and running into
// the track's own fade under the end card. "sample": the music of the group's ride sample, looped twice on its
// 13.70 s phrase (jump 21.65 s → 7.95 s) so its natural ending lands on the end card.
export type RideProps = { music?: "bigrock" | "sample" };
const BIGROCK_AT = T.flag[0];
const BIGROCK_FROM = 171.3; // track seconds at BIGROCK_AT; the track fades out 216–229 s
const SAMPLE_AT = -15; // starts 0.5 s into the track so its own ending lands on the end card
const LOOP = { from: 21.65, to: 7.95 };

const serif = loadPlayfair("italic", { weights: ["600"] }).fontFamily;
const barlow = loadBarlow("normal", { weights: ["500", "600"] }).fontFamily;

const RIDERS = "Kazak Rider Group · Nilgiris, Jan 2026";
const two = (n: number) => String(n).padStart(2, "0");
const SOFT = "#e9c58a";
const GRADE = "contrast(1.05) saturate(.9) sepia(.07)";

// Calm type: a small spaced kicker over one or two lines of italic serif
const Kick: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = SOFT }) => (
  <div style={{ fontFamily: barlow, fontWeight: 600, fontSize: 30, letterSpacing: 9, textTransform: "uppercase", color, textShadow: "0 2px 14px rgba(0,0,0,.9)" }}>{children}</div>
);
const Title: React.FC<{ children: React.ReactNode; size?: number; color?: string }> = ({ children, size = 104, color = C.cream }) => (
  <div style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 600, fontSize: size, lineHeight: 1.06, color, textShadow: "0 6px 30px rgba(0,0,0,.65)" }}>{children}</div>
);
const Rule: React.FC<{ delay?: number }> = ({ delay = 10 }) => {
  const frame = useCurrentFrame();
  const w = interpolate(frame, [delay, delay + 16], [0, 120], { ...clamp, easing: Easing.out(Easing.cubic) });
  return <div style={{ height: 2, width: w, background: SOFT, margin: "18px 0 22px" }} />;
};
const Words: React.FC<{ kick?: string; a: React.ReactNode; b?: React.ReactNode; size?: number; delay?: number }> = ({ kick, a, b, size, delay = 6 }) => (
  <Rise delay={delay}>
    {kick ? <Kick>{kick}</Kick> : null}
    {kick ? <Rule delay={delay + 4} /> : null}
    <Title size={size}>{a}</Title>
    {b ? (
      <Title size={size} color={C.amber}>
        {b}
      </Title>
    ) : null}
  </Rise>
);
const Low: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ padding: "160px 96px 250px", justifyContent: "flex-end" }}>{children}</AbsoluteFill>
);
const Credit: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ padding: "230px 96px", alignItems: "flex-start" }}>
    <div style={{ fontFamily: barlow, fontWeight: 500, fontSize: 24, letterSpacing: 2, color: "rgba(244,239,230,.8)", background: "rgba(7,11,20,.45)", padding: "6px 14px", borderRadius: 6 }}>{children}</div>
  </AbsoluteFill>
);

// Moving film grain and a soft vignette over the whole film
const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      <AbsoluteFill style={{ background: "radial-gradient(85% 65% at 50% 45%, transparent 55%, rgba(0,0,0,.42))" }} />
      <AbsoluteFill style={{ backgroundImage: `url(${staticFile("ride/grain.png")})`, backgroundSize: "256px", backgroundPosition: `${(frame * 73) % 256}px ${(frame * 131) % 256}px`, opacity: 0.09, mixBlendMode: "overlay" }} />
    </>
  );
};

const Scene: React.FC<{ at: readonly [number, number]; children: React.ReactNode; edge?: number }> = ({ at, children, edge = 10 }) => (
  <Sequence from={at[0]} durationInFrames={at[1]}>
    <Fade edge={edge}>{children}</Fade>
  </Sequence>
);

// A clip in the top band of the frame (fading into the dark below), so text sits on a clean ground
const Band: React.FC<{ children: React.ReactNode; h?: number }> = ({ children, h = 1300 }) => {
  const mask = "linear-gradient(180deg, #000 70%, transparent 100%)";
  return <AbsoluteFill style={{ height: h, overflow: "hidden", WebkitMaskImage: mask, maskImage: mask }}>{children}</AbsoluteFill>;
};
const Clip: React.FC<{ src: string; dur: number; position?: string; from?: number; to?: number; filter?: string; startFrom?: number; rate?: number }> = ({ src, dur, position = "center", from = 1, to = 1.06, filter, startFrom, rate }) => {
  const frame = useCurrentFrame();
  const z = interpolate(frame, [0, dur], [from, to], clamp);
  return <OffthreadVideo src={staticFile(src)} muted startFrom={startFrom} playbackRate={rate} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: position, transform: `scale(${z})`, filter }} />;
};

// Open: tight on the sticker on the bike's fairing (redrawn crisp over the photo), slowly pulling back to the bike.
// The photo covers the frame at scale 1 and every zoom is about a point inside it, so its edges never show.
const PHOTO = { w: 1444.8, left: -182.4 };
const CX = 506.4;
const CY = 924;
const R = 372;
const Open: React.FC = () => {
  const frame = useCurrentFrame();
  const z = interpolate(frame, [0, 110], [2.6, 1.08], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const lit = interpolate(frame, [0, 10], [0.25, 1], clamp) * (frame > 20 && frame < 24 ? 0.7 : 1);
  const sweep = interpolate(frame, [44, 84], [-30, 130], clamp);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: `${CX}px ${CY}px`, opacity: lit }}>
        <Img src={staticFile("ride/headlamp.jpg")} style={{ position: "absolute", left: PHOTO.left, top: 0, width: PHOTO.w, height: 1920, filter: "blur(3px) brightness(.42) contrast(1.15) saturate(.7)" }} />
        <div style={{ position: "absolute", left: CX - R, top: CY - R }}>
          <Sticker size={R * 2} sweep={sweep} shadow={false} />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(48% 30% at ${(CX / 1080) * 100}% ${(CY / 1920) * 100}%, transparent 60%, rgba(0,0,0,.55))` }} />
      <Shade strength={0.85} />
      <Low>
        <Words delay={58} kick="SSKZM OBA · Kazak Bike Ride" a="Engines on." size={120} />
      </Low>
    </AbsoluteFill>
  );
};

// Last time → this time: "Jan 2026" with its last digit rolling over to 7, the kicker changing with it
const DateFlip: React.FC = () => {
  const frame = useCurrentFrame();
  const roll = interpolate(frame, [12, 22], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const H = 230;
  const kick = (t: string, o: number) => (
    <div style={{ position: "absolute", left: 0, right: 0, opacity: o }}>
      <Kick>{t}</Kick>
    </div>
  );
  return (
    <AbsoluteFill style={{ background: C.night, alignItems: "center", justifyContent: "center", textAlign: "center", paddingBottom: 120 }}>
      <Rise delay={0}>
        <div style={{ position: "relative", height: 40 }}>
          {kick("Our last ride", 1 - roll)}
          {kick("This time", roll)}
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", fontFamily: serif, fontStyle: "italic", fontWeight: 600, fontSize: 210, lineHeight: `${H}px`, color: C.cream, marginTop: 20 }}>
          <span>Jan 202</span>
          <span style={{ display: "inline-block", height: H, overflow: "hidden" }}>
            <span style={{ display: "block", transform: `translateY(${-roll * H}px)` }}>
              <span style={{ display: "block", height: H }}>6</span>
              <span style={{ display: "block", height: H, color: C.amber }}>7</span>
            </span>
          </span>
        </div>
      </Rise>
    </AbsoluteFill>
  );
};

// The road from the group's ride sample, in the mist
const MistRoad: React.FC = () => (
  <AbsoluteFill style={{ background: C.night }}>
    <Band>
      <Clip src="ride/mist-pov.mp4" dur={T.mist[1]} position="center top" from={1.02} to={1.1} />
    </Band>
    <Low>
      <Words delay={8} a="The forest roads" b="are calling." />
    </Low>
  </AbsoluteFill>
);

// "We marched under one flag": the archive parade print, aged, panning along the column; then the riders' flag waving,
// "Now we ride under one", as Big Rock comes in
const Parade: React.FC = () => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, FLAG_CUT + 10], [18, 42]);
  const flicker = 0.93 + 0.07 * Math.sin(frame * 1.7) * Math.sin(frame * 0.43);
  return (
    <AbsoluteFill style={{ background: C.night }}>
      <Band>
        <Img src={staticFile("old-parade.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: `${x}% 70%`, transform: "scale(1.05)", filter: `sepia(.6) contrast(1.08) brightness(${0.82 * flicker})` }} />
      </Band>
      <Low>
        <Words delay={8} kick="Sainik School Kazhakootam" a="We marched" b="under one flag." />
      </Low>
    </AbsoluteFill>
  );
};

// The group's real flag (cut out of their photo, ride/flag-cut.png, 791×1002) on its stick against a night sky:
// a gentle sway from the stick, the cloth breathing, and a soft light running over the folds
const FW = 700;
const FS = FW / 791;
const RealFlag: React.FC = () => {
  const frame = useCurrentFrame();
  const sway = Math.sin(frame / 22) * 1.2;
  const breathe = Math.sin(frame / 13);
  const sweep = interpolate(frame % 90, [0, 90], [-40, 140]);
  const cut = `url(${staticFile("ride/flag-cut.png")})`;
  return (
    <div style={{ position: "relative", width: FW, height: 1002 * FS, transformOrigin: `${9 * FS}px ${1564 * FS}px`, transform: `rotate(${sway}deg)` }}>
      <div style={{ position: "absolute", left: 179 * FS, top: -6 * FS, width: 13, height: 1580 * FS, borderRadius: 6, transformOrigin: "50% 0", transform: "rotate(6.2deg)", background: "linear-gradient(90deg, #5a3d22, #b08656 45%, #4a321c)" }} />
      <div style={{ position: "absolute", inset: 0, transformOrigin: "20% 60%", transform: `skewY(${breathe * 1.4}deg) scaleX(${1 + breathe * 0.012})`, filter: "drop-shadow(0 30px 60px rgba(0,0,0,.6))" }}>
        <Img src={staticFile("ride/flag-cut.png")} style={{ width: "100%", height: "100%" }} />
        <div style={{ position: "absolute", inset: 0, WebkitMaskImage: cut, maskImage: cut, WebkitMaskSize: "100% 100%", maskSize: "100% 100%", background: `linear-gradient(120deg, transparent ${sweep - 25}%, rgba(255,255,255,.18) ${sweep}%, transparent ${sweep + 25}%)` }} />
      </div>
    </div>
  );
};

const RideFlag: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(70% 42% at 50% 30%, rgba(227,27,35,.2), ${C.night} 75%)` }}>
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 170, paddingLeft: 60 }}>
      <RealFlag />
    </AbsoluteFill>
    <Low>
      <Words delay={6} a="Now we ride" b="under one." />
    </Low>
  </AbsoluteFill>
);

const Flag: React.FC = () => (
  <AbsoluteFill>
    <Sequence durationInFrames={FLAG_CUT + 4}>
      <Parade />
    </Sequence>
    <Sequence from={FLAG_CUT}>
      <Fade edge={4} inOnly>
        <RideFlag />
      </Fade>
    </Sequence>
  </AbsoluteFill>
);

const Still: React.FC<{ src: string; lift?: number }> = ({ src, lift = 420 }) => <KenBurns src={src} wide lift={lift} from={1} to={1.05} />;

// The group's drone shot pulling away from everyone with their bikes (sped up so the whole pull-back fits), full width
// over a blurred copy of itself
const Drone: React.FC = () => (
  <AbsoluteFill style={{ background: C.night }}>
    <AbsoluteFill style={{ transform: "scale(1.4)" }}>
      <OffthreadVideo src={staticFile("ride-drone.mp4")} muted playbackRate={1.9} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(40px) brightness(.4)" }} />
    </AbsoluteFill>
    <AbsoluteFill style={{ justifyContent: "center", paddingBottom: 380 }}>
      <OffthreadVideo src={staticFile("ride-drone.mp4")} muted playbackRate={1.9} style={{ width: "100%", boxShadow: "0 30px 80px rgba(0,0,0,.6)" }} />
    </AbsoluteFill>
  </AbsoluteFill>
);

// Our last ride: out the gates at Trivandrum (the school gate, a match cut from the parade) and Ooty, one ride to
// Coonoor, then the drone pulls away and fades; "Back for more." comes up on its own and is the last thing to go
const LAST = { roll: 75, coonoor: 149, drone: 216, words: 300 };
const LastYear: React.FC = () => (
  <AbsoluteFill>
    <Sequence durationInFrames={LAST.roll + 10}>
      <AbsoluteFill>
        <KenBurns src="ooty-gate.jpg" from={1.02} to={1.1} position="center 20%" />
        <Credit>Kazak Rider Group · Trivandrum, Jan 2026</Credit>
        <Shade strength={0.9} />
        <Low>
          <Words delay={6} kick="Our last ride · Jan 2026" a="Out the gates," b="Trivandrum." />
        </Low>
      </AbsoluteFill>
    </Sequence>
    <Sequence from={LAST.roll} durationInFrames={LAST.coonoor - LAST.roll + 10}>
      <Fade edge={10} inOnly>
        <AbsoluteFill style={{ background: C.night }}>
          <Band>
            <Clip src="ride/gate-rollout.mp4" dur={LAST.coonoor - LAST.roll + 10} startFrom={13 * 30} rate={1.5} position="55% center" from={1.02} to={1.06} />
          </Band>
          <Credit>Kazak Rider Group · Ooty, Jan 2026</Credit>
          <Low>
            <Words delay={6} a="Out the gates," b="Ooty." />
          </Low>
        </AbsoluteFill>
      </Fade>
    </Sequence>
    <Sequence from={LAST.coonoor} durationInFrames={LAST.drone - LAST.coonoor + 10}>
      <Fade edge={10} inOnly>
        <AbsoluteFill>
          <Still src="coonoor.jpg" />
          <Credit>Kazak Rider Group · Coonoor, Jan 2026</Credit>
          <Low>
            <Words delay={4} a="One ride" b="to Coonoor." />
          </Low>
        </AbsoluteFill>
      </Fade>
    </Sequence>
    <Sequence from={LAST.drone} durationInFrames={LAST.words - LAST.drone}>
      <Fade edge={12}>
        <Drone />
        <Credit>{RIDERS}</Credit>
      </Fade>
    </Sequence>
    <Sequence from={LAST.words - 4}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center", paddingBottom: 120 }}>
        <Rise delay={0}>
          <Title size={130}>Back</Title>
          <Title size={130} color={C.amber}>
            for more.
          </Title>
        </Rise>
      </AbsoluteFill>
    </Sequence>
  </AbsoluteFill>
);

// This year: three riders on a misty ghat road, the new route named
const Intro: React.FC = () => (
  <AbsoluteFill style={{ background: C.night }}>
    <Band>
      <Clip src="ride/mist-riders.mp4" dur={T.intro[1]} position="center top" from={1} to={1.05} />
    </Band>
    <Low>
      <Rise delay={0}>
        <Kick>Kazak Bike Ride</Kick>
      </Rise>
      <div style={{ margin: "22px 0 4px", transform: "scale(.8)", transformOrigin: "left center" }}>
        <Stamp delay={8} />
      </div>
      <Rise delay={16}>
        <Title size={120}>The Forest</Title>
        <Title size={120} color={C.amber}>
          Trail.
        </Title>
      </Rise>
      <Rise delay={26}>
        <div style={{ marginTop: 18, fontFamily: barlow, fontWeight: 500, fontSize: 40, letterSpacing: 2, color: C.cream }}>23–25 January · +1 optional day on the 26th</div>
      </Rise>
    </Low>
  </AbsoluteFill>
);

// The route map in the film's own type: serif header and day titles, framed photo cards with a light pass
const ROUTE_T: Times = { d1: [6, 37], d2: [45, 109], d3: [112, 157], d4: [162, 189], zoom: [40, 62, 157, 174] };

const RouteCard: React.FC<{ src: string; caption: string; len: number; count?: number }> = ({ src, caption, len, count }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 8, len - 6, len], [0, 1, 1, 0], clamp);
  const y = interpolate(frame, [0, 10], [30, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const push = interpolate(frame, [0, len], [1, 1.06], clamp);
  const sweep = interpolate(frame, [2, Math.min(len, 30)], [-30, 130], clamp);
  const n = count ? Math.round(interpolate(frame, [4, len - 8], [1, count], clamp)) : 0;
  return (
    <AbsoluteFill style={{ top: 1060, left: 70, width: 940, height: 390, opacity: o, transform: `translateY(${y}px)` }}>
      <div style={{ position: "relative", width: 940, height: 390, overflow: "hidden", borderRadius: 4, boxShadow: "0 30px 80px rgba(0,0,0,.7)", outline: "1px solid rgba(244,239,230,.4)", outlineOffset: 10 }}>
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${push})` }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(115deg, transparent ${sweep - 22}%, rgba(255,255,255,.16) ${sweep}%, transparent ${sweep + 22}%)` }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "50px 28px 18px", background: "linear-gradient(transparent, rgba(7,11,20,.88))", fontFamily: barlow, fontWeight: 600, fontSize: 32, letterSpacing: 3, textTransform: "uppercase", color: C.cream }}>
          {caption}
        </div>
        {count ? (
          <div style={{ position: "absolute", top: 18, right: 18, padding: "6px 16px", background: "rgba(7,11,20,.7)", fontFamily: barlow, fontWeight: 600, fontSize: 30, letterSpacing: 4, color: SOFT, fontVariantNumeric: "tabular-nums" }}>
            HAIRPIN {two(n)} / {count}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

const RouteDay: React.FC<{ day: string; title: string; sub: string }> = ({ day, title, sub }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 10], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ top: 1500, padding: "0 80px", opacity: o }}>
      <Kick>{day}</Kick>
      <Title size={72}>{title}</Title>
      <div style={{ marginTop: 8, fontFamily: barlow, fontWeight: 500, fontSize: 36, color: "rgba(244,239,230,.82)" }}>{sub}</div>
    </AbsoluteFill>
  );
};

const RideRoute: React.FC = () => (
  <AbsoluteFill style={{ background: C.night }}>
    <RouteMap T={ROUTE_T} />
    <MapShade />
    <AbsoluteFill style={{ padding: "100px 80px 0" }}>
      <Rise delay={4}>
        <Kick>New route · chosen by the riders</Kick>
        <Title size={96}>
          The Forest <span style={{ color: C.amber }}>Trail.</span>
        </Title>
        <div style={{ marginTop: 8, fontFamily: barlow, fontWeight: 500, fontSize: 34, color: "rgba(244,239,230,.75)" }}>Where the Western &amp; Eastern Ghats meet</div>
      </Rise>
    </AbsoluteFill>
    <Sequence from={48} durationInFrames={21}>
      <RouteCard src="route/dam.jpg" caption="Bhavanisagar dam" len={21} />
    </Sequence>
    <Sequence from={69} durationInFrames={21}>
      <RouteCard src="route/sathy.jpg" caption="Forest villages & their stories" len={21} />
    </Sequence>
    <Sequence from={90} durationInFrames={26}>
      <RouteCard src="route/ghatroad.jpg" caption="Dhimbam Ghat" len={26} count={27} />
    </Sequence>
    <Sequence from={116} durationInFrames={22}>
      <RouteCard src="route/elephants.jpg" caption="Bandipur · elephant country" len={22} />
    </Sequence>
    <Sequence from={138} durationInFrames={22}>
      <RouteCard src="route/gudalur.jpg" caption="Gudalur · tea country" len={22} />
    </Sequence>
    <Sequence from={162} durationInFrames={50}>
      <RouteCard src="route/nilambur.jpg" caption="Nilambur · world’s oldest teak" len={50} />
    </Sequence>
    <Sequence from={8} durationInFrames={37}>
      <RouteDay day="Day 1" title="Ride in" sub="Bengaluru, Kochi & Kozhikode → Coimbatore" />
    </Sequence>
    <Sequence from={45} durationInFrames={67}>
      <RouteDay day="Day 2" title="Sathyamangalam" sub="Dam, forest villages, 27 hairpins" />
    </Sequence>
    <Sequence from={112} durationInFrames={48}>
      <RouteDay day="Day 3" title="Bandipur" sub="Elephant country → Gudalur" />
    </Sequence>
    <Sequence from={160}>
      <RouteDay day="Home run" title="Nilambur or Mysuru" sub="+1 optional day on the 26th" />
    </Sequence>
  </AbsoluteFill>
);

// One continuous pass from the saddle: the three clips side by side on one long strip (each scaled to the band's
// height, later ones dissolving in over a soft join), the camera gliding right to left across it with a slight ride bob.
// Each clip starts when it comes into view and plays slowed so it never runs out while on screen.
const PASS = 292;
const PW = Math.round((1920 * 1300) / 1080); // a 1920×1080 clip at the band's 1300 px height
const JOIN = 500;
const STEP = PW - JOIN;
const PASS_X: [number, number] = [200, 3 * PW - 2 * JOIN - 1080 - 200];
const passX = (f: number) => interpolate(f, [0, PASS], PASS_X);
const passAt = (x: number) => (x - PASS_X[0]) / ((PASS_X[1] - PASS_X[0]) / PASS); // frame at which the camera reaches x
const STRIP = [
  { src: "ride/chital.mp4", len: 4.23, filter: undefined as string | undefined, kick: "On the Forest Trail", a: "Ride along", b: "the chital." },
  { src: "ride/elephant.mp4", len: 3.67, filter: "saturate(.78) hue-rotate(10deg) brightness(.96)", kick: undefined, a: "Stop.", b: "Elephants first." },
  { src: "ride/peacock.mp4", len: 4.6, filter: undefined, kick: undefined, a: "Ride past", b: "the dancers." },
].map((c, i) => {
  const enter = Math.max(0, Math.floor(passAt(i * STEP - 1080)));
  const leave = Math.min(PASS, Math.ceil(passAt(i * STEP + PW)));
  const mid = passAt(i * STEP + PW / 2 - 540);
  return { ...c, x: i * STEP, enter, leave, mid, rate: Math.min(1, (c.len * 30 - 2) / (leave - enter)) };
});
// captions change halfway between one animal reaching the centre and the next
const WORDS_AT = STRIP.map((c, i) => (i ? Math.round((STRIP[i - 1].mid + c.mid) / 2) : 0));

const Pass: React.FC = () => {
  const frame = useCurrentFrame();
  const x = passX(frame);
  const bob = Math.sin(frame / 5) * 5;
  return (
    <AbsoluteFill style={{ background: C.night }}>
      <Band>
        <div style={{ position: "absolute", top: 0, left: 0, height: 1300, transform: `translate(${-x}px, ${bob}px) scale(1.02)`, transformOrigin: `${x + 540}px 650px` }}>
          {STRIP.map((c, i) => {
            const fade = i ? "linear-gradient(90deg, transparent 0, #000 " + JOIN + "px)" : undefined;
            return (
              <div key={c.src} style={{ position: "absolute", left: c.x, top: 0, width: PW, height: 1300, WebkitMaskImage: fade, maskImage: fade }}>
                <Sequence from={c.enter} durationInFrames={c.leave - c.enter} layout="none">
                  <OffthreadVideo src={staticFile(c.src)} muted playbackRate={c.rate} style={{ width: PW, height: 1300, objectFit: "cover", filter: c.filter }} />
                </Sequence>
              </div>
            );
          })}
        </div>
      </Band>
      {STRIP.map((c, i) => (
        <Sequence key={c.src} from={WORDS_AT[i]} durationInFrames={(i < STRIP.length - 1 ? WORDS_AT[i + 1] : PASS) - WORDS_AT[i] + 4}>
          <Fade edge={8}>
            <Low>
              <Words delay={4} kick={c.kick} a={c.a} b={c.b} />
            </Low>
          </Fade>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// The ghats in one beat: two road clips under a single caption, the count climbing to 27
const Hairpins: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const n = Math.round(interpolate(frame, [8, dur - 21], [1, 27], { ...clamp, easing: Easing.out(Easing.quad) }));
  const pop = interpolate(frame, [dur - 21, dur - 17, dur - 9], [1, 1.12, 1], clamp);
  return (
    <AbsoluteFill style={{ background: C.night }}>
      <Band>
        <Sequence durationInFrames={52}>
          <Clip src="ride/ghat.mp4" dur={52} position="60% center" from={1} to={1.05} />
        </Sequence>
        <Sequence from={46}>
          <Fade edge={8} inOnly>
            <Clip src="ride/hairpin.mp4" dur={dur - 46} position="62% center" from={1.03} to={1.09} />
          </Fade>
        </Sequence>
      </Band>
      <Low>
        <Words delay={4} kick="Into the ghats" a={<span style={{ display: "inline-block", fontVariantNumeric: "tabular-nums", transform: `scale(${pop})`, transformOrigin: "left center" }}>{n} hairpins.</span>} b="Take them all." />
      </Low>
    </AbsoluteFill>
  );
};

// "If you're lucky": through a camera viewfinder; the focus box settles, a soft shutter flash
const SPOTS = [
  { src: "ride/spot-tiger.jpg", label: "Tiger", fx: 0.74, fy: 0.55, len: 30 },
  { src: "ride/spot-bear.jpg", label: "Sloth bear", fx: 0.33, fy: 0.4, len: 26 },
  { src: "ride/spot-gaur.jpg", label: "Gaur", fx: 0.6, fy: 0.55, len: 23 },
];
const SPOT_AT = SPOTS.map((_, i) => SPOTS.slice(0, i).reduce((a, sp) => a + sp.len, 0));
const VW = 880;
const VH = 1000;
const VX = 100;
const VY = 330;

const Sighting: React.FC<{ sp: (typeof SPOTS)[number]; i: number }> = ({ sp, i }) => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, sp.len], [1.14, 1.04], { ...clamp, easing: Easing.out(Easing.cubic) });
  const blur = interpolate(frame, [0, 6], [10, 0], clamp);
  const lock = interpolate(frame, [0, 7], [1.5, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const flash = interpolate(frame, [7, 8, 13], [0, 0.3, 0], clamp);
  const label = interpolate(frame, [7, 13], [0, 1], clamp);
  const box = interpolate(frame, [sp.len - 6, sp.len - 2], [1, 0], clamp);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: VX, top: VY, width: VW, height: VH, overflow: "hidden" }}>
        <Img src={staticFile(sp.src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})`, transformOrigin: `${sp.fx * 100}% ${sp.fy * 100}%`, filter: `blur(${blur}px)` }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(80% 70% at 50% 50%, transparent 55%, rgba(0,0,0,.5))" }} />
        <div style={{ position: "absolute", left: sp.fx * VW - 100, top: sp.fy * VH - 100, width: 200, height: 200, border: "2px solid rgba(255,255,255,.85)", transform: `scale(${lock})`, opacity: box }} />
        <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: flash }} />
      </div>
      <div style={{ position: "absolute", left: VX, top: VY + VH + 60, opacity: label, transform: `translateY(${(1 - label) * 16}px)` }}>
        <Kick>
          Sighting {two(i + 1)} / {two(SPOTS.length)}
        </Kick>
        <Title size={104}>{sp.label}</Title>
      </div>
    </AbsoluteFill>
  );
};

const Corner: React.FC<{ v: "top" | "bottom"; h: "left" | "right" }> = ({ v, h }) => {
  const side = (k: string) => k[0].toUpperCase() + k.slice(1);
  return <div style={{ position: "absolute", [v]: -12, [h]: -12, width: 64, height: 64, [`border${side(v)}`]: `3px solid ${C.cream}`, [`border${side(h)}`]: `3px solid ${C.cream}` }} />;
};

const Lucky: React.FC = () => {
  const frame = useCurrentFrame();
  const rec = Math.floor(frame / 12) % 2 === 0 ? 1 : 0.2;
  return (
    <AbsoluteFill style={{ background: C.night }}>
      <AbsoluteFill style={{ padding: "170px 100px 0" }}>
        <Kick>If you’re lucky</Kick>
        <div style={{ marginTop: 10, fontFamily: barlow, fontWeight: 500, fontSize: 30, color: "rgba(244,236,220,.65)" }}>Bandipur and Sathyamangalam are tiger reserves</div>
      </AbsoluteFill>
      {SPOTS.map((sp, i) => (
        <Sequence key={sp.src} from={SPOT_AT[i]} durationInFrames={sp.len}>
          <Sighting sp={sp} i={i} />
        </Sequence>
      ))}
      <div style={{ position: "absolute", left: VX, top: VY, width: VW, height: VH }}>
        <Corner v="top" h="left" />
        <Corner v="top" h="right" />
        <Corner v="bottom" h="left" />
        <Corner v="bottom" h="right" />
        <div style={{ position: "absolute", left: 30, top: 26, fontFamily: barlow, fontWeight: 600, fontSize: 26, letterSpacing: 3, color: "#fff" }}>
          <span style={{ color: "#ff3b3b", opacity: rec }}>●</span> REC
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Trail: React.FC = () => (
  <AbsoluteFill>
    <Sequence durationInFrames={PASS}>
      <Pass />
    </Sequence>
    <Sequence from={292} durationInFrames={96}>
      <Fade edge={10} inOnly>
        <Hairpins dur={96} />
      </Fade>
    </Sequence>
    <Sequence from={388}>
      <Fade edge={8} inOnly>
        <Lucky />
      </Fade>
    </Sequence>
  </AbsoluteFill>
);

const Riders: React.FC = () => (
  <AbsoluteFill>
    <Sequence durationInFrames={90}>
      <KenBurns src="ooty-road.mp4" video from={1} to={1.05} />
    </Sequence>
    <Sequence from={80}>
      <Fade edge={10} inOnly>
        <KenBurns src="ooty-pillion.mp4" video from={1} to={1.05} />
      </Fade>
    </Sequence>
    <Credit>{RIDERS}</Credit>
    <Shade strength={0.9} />
    <AbsoluteFill>
      <Sequence durationInFrames={72}>
        <Fade edge={10}>
          <Low>
            <Words delay={4} a="All batches." b="One road." size={120} />
          </Low>
        </Fade>
      </Sequence>
      <Sequence from={70}>
        <Low>
          <Words delay={4} a="Lead." b="Or keep pace." size={120} />
          <Rise delay={36}>
            <div style={{ marginTop: 26, fontFamily: barlow, fontWeight: 500, fontSize: 42, letterSpacing: 1, color: C.cream }}>Pillion welcome. Full gear a must.</div>
          </Rise>
        </Low>
      </Sequence>
    </AbsoluteFill>
  </AbsoluteFill>
);

// End: the crest fades up softly with a slow breathing glow while the music finishes; the picture fades out last
const End: React.FC<{ credit: string }> = ({ credit }) => {
  const frame = useCurrentFrame();
  const logo = interpolate(frame, [0, 40], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const scale = interpolate(frame, [0, T.end[1]], [0.94, 1.02]);
  const glow = interpolate(frame, [10, 60], [0, 1], clamp) * (0.75 + 0.25 * Math.sin(frame / 18));
  const halo = interpolate(frame, [30, 46, 84], [0, 1, 0], clamp);
  const haloSize = interpolate(frame, [30, 84], [0.8, 1.7], clamp);
  const out = interpolate(frame, [T.end[1] - 18, T.end[1]], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ background: C.night, opacity: out }}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 70px 120px", textAlign: "center" }}>
        <div style={{ position: "relative", width: 260, height: 260, marginBottom: 44 }}>
          <div style={{ position: "absolute", inset: -150, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,170,70,.5), rgba(255,120,40,.22) 40%, rgba(255,120,40,0) 66%)", opacity: glow }} />
          <div style={{ position: "absolute", inset: -110, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,190,90,1) 0%, rgba(255,140,40,.55) 38%, rgba(255,120,40,0) 70%)", opacity: halo, transform: `scale(${haloSize})` }} />
          <Img src={staticFile("oba-logo.png")} style={{ position: "relative", width: 260, height: 260, opacity: logo, transform: `scale(${scale})` }} />
        </div>
        <Rise delay={22}>
          <Title size={150}>Let’s ride.</Title>
        </Rise>
        <Rise delay={36}>
          <div style={{ margin: "34px 0 26px" }}>
            <Pill bg={C.red}>The Forest Trail · 23–25 Jan</Pill>
          </div>
        </Rise>
        <Rise delay={48}>
          <Kick color={C.cream}>Booking open</Kick>
          <div style={{ marginTop: 14, fontFamily: barlow, fontWeight: 600, fontSize: 44, color: C.amber }}>adventures.sskzmoba.org/ride</div>
          <div style={{ marginTop: 22, fontFamily: barlow, fontWeight: 500, fontSize: 30, letterSpacing: 3, color: "rgba(244,239,230,.7)" }}>#KazakWanderlust</div>
        </Rise>
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "flex-end", padding: "0 60px 50px", textAlign: "center" }}>
        <div style={{ fontFamily: inter, fontSize: 15, lineHeight: 1.4, color: "rgba(169,179,196,.6)" }}>
          SSKZM OBA Communications Cell · {credit} · Engine: OllemanW (CC BY-SA 3.0) · Sounds: ezwa, Ke4roh (public domain), தகவலுழவன் (CC0),
          Mk170101 (CC BY 4.0)
          <br />
          Photos &amp; clips: Kazak Rider Group &amp; SSKZM OBA · Misty-road clips: the group’s ride sample · Clips: Pexels · Peacock video: Rohit
          Sharma (CC BY-SA 4.0) · Via Wikimedia Commons: Namisharun, Harish Garg, Giles Laurent, Partha Majumdar, LakshmiNaresh (CC BY-SA 4.0),
          Pratheept2000, Jaseem Hamza (CC BY 3.0), Dineshkannambadi, PP Yoonus (CC BY-SA 3.0)
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// A sound effect at film frame `at`, faded in and out
const Sfx: React.FC<{ src: string; at: number; dur: number; vol: number; skip?: number; fade?: number }> = ({ src, at, dur, vol, skip, fade = 8 }) => (
  <Sequence from={at} durationInFrames={dur}>
    <Audio src={staticFile(src)} startFrom={skip} volume={(f) => vol * interpolate(f, [0, fade, dur - fade, dur], [0, 1, 1, 0], clamp)} />
  </Sequence>
);

// The sample's music: plays from 0, jumps back on its phrase twice, then runs to its own ending (4-frame crossfades)
const SampleMusic: React.FC = () => {
  const len = Math.round((LOOP.from - LOOP.to) * 30);
  const first = Math.round(LOOP.from * 30);
  const parts = [
    { at: SAMPLE_AT, skip: 0, dur: first },
    { at: SAMPLE_AT + first, skip: Math.round(LOOP.to * 30), dur: len },
    { at: SAMPLE_AT + first + len, skip: Math.round(LOOP.to * 30), dur: RIDE_FRAMES - (SAMPLE_AT + first + len) },
  ];
  const X = 2;
  return (
    <>
      {parts.map((p, i) => {
        const lead = i ? 0 : Math.max(0, -p.at); // the first part may start before frame 0: skip into the track instead
        const at = i ? p.at - X : p.at + lead;
        const skip = (i ? p.skip - X : p.skip) + lead;
        const dur = p.dur + (i ? X : 0) + (i < parts.length - 1 ? X : 0) - lead;
        return (
          <Sequence key={i} from={at} durationInFrames={dur}>
            <Audio src={staticFile("ride-music-sample.mp3")} startFrom={skip} volume={(f) => interpolate(f, [0, i ? 2 * X : 6, dur - (i < parts.length - 1 ? 2 * X : 1), dur], [0, 0.9, 0.9, 0], clamp)} />
          </Sequence>
        );
      })}
    </>
  );
};

export const RideFilm: React.FC<RideProps> = ({ music = "bigrock" }) => {
  const sample = music === "sample";
  const fx = sample ? 0.6 : 1; // sound effects sit lower under the sample's music, which starts at once
  const brLen = RIDE_FRAMES - BIGROCK_AT;
  const lift = Math.round((216 - BIGROCK_FROM) * 30); // where Big Rock starts its own fade; held up until the end card
  return (
    <AbsoluteFill style={{ background: C.night }}>
      <AbsoluteFill style={{ filter: GRADE }}>
        <Sequence from={T.open[0]} durationInFrames={T.open[1]}>
          <Open />
        </Sequence>
        <Scene at={T.flag}>
          <Flag />
        </Scene>
        <Scene at={T.last} edge={6}>
          <LastYear />
        </Scene>
        <Scene at={T.flip} edge={8}>
          <DateFlip />
        </Scene>
        <Scene at={T.mist}>
          <MistRoad />
        </Scene>
        <Scene at={T.intro}>
          <Intro />
        </Scene>
        <Scene at={T.route} edge={12}>
          <RideRoute />
        </Scene>
        <Scene at={T.trail}>
          <Trail />
        </Scene>
        <Scene at={T.riders}>
          <Riders />
        </Scene>
        <Sequence from={T.end[0]} durationInFrames={T.end[1]}>
          <Fade edge={14} inOnly>
            <End credit={sample ? "Music: the group’s ride sample" : "Music: “Big Rock” Kevin MacLeod (incompetech.com), CC BY 4.0"} />
          </Fade>
        </Sequence>
      </AbsoluteFill>
      <Grain />

      {/* Sound design */}
      <Sequence from={0} durationInFrames={126}>
        <Audio src={staticFile("engine.wav")} volume={(f) => fx * interpolate(f, [0, 4, 90, 126], [0, 1, 0.8, 0], clamp)} />
      </Sequence>
      <Sfx src="sfx/rain.mp3" at={0} dur={T.flag[0] + 30} vol={0.3 * fx} fade={20} />
      <Sfx src="engine.wav" at={T.flip[0] + 8} dur={70} vol={0.75 * fx} fade={6} />
      <Sfx src="sfx/bike1.mp3" at={T.mist[0] - 6} dur={120} vol={0.4 * fx} fade={14} />
      <Sfx src="sfx/rain.mp3" at={T.intro[0]} dur={T.intro[1]} vol={0.22 * fx} skip={300} fade={16} />
      <Sfx src="sfx/birds.mp3" at={T.trail[0]} dur={T.trail[1]} vol={0.5 * fx} skip={600} fade={20} />
      <Sfx src="sfx/elephant.mp3" at={T.trail[0] + Math.round(STRIP[1].mid) - 10} dur={45} vol={0.7 * fx} fade={3} />
      <Sfx src="sfx/peacock.mp3" at={T.trail[0] + Math.round(STRIP[2].mid) - 30} dur={90} vol={0.55 * fx} fade={10} />
      <Sfx src="sfx/bike2.mp3" at={T.riders[0]} dur={T.riders[1]} vol={0.5 * fx} skip={6 * 30} fade={14} />

      {/* Music */}
      {sample ? (
        <SampleMusic />
      ) : (
        <Sequence from={BIGROCK_AT} durationInFrames={brLen}>
          <Audio
            src={staticFile("ride-music-bigrock.mp3")}
            startFrom={Math.round(BIGROCK_FROM * 30)}
            volume={(f) => interpolate(f, [0, 24, lift, lift + 150, brLen - 8, brLen], [0, 0.8, 0.8, 1, 1, 0], clamp)}
          />
        </Sequence>
      )}
    </AbsoluteFill>
  );
};
