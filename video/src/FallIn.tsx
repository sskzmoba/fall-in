import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { loadFont as loadStencil } from "@remotion/google-fonts/BlackOpsOne";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { DayLabel, MapShade, Photo, RouteHeader, RouteMap } from "./RouteTeaser";

const stencil = loadStencil().fontFamily;
const oswald = loadOswald("normal", { weights: ["500", "700"] }).fontFamily;
const inter = loadInter("normal", { weights: ["400", "600", "800"] }).fontFamily;

// Colours from the OBA logo (same tokens as the website)
const C = {
  night: "#070b14",
  navy: "#12385e",
  red: "#e31b23",
  amber: "#ffb648",
  cream: "#f4efe6",
  trek: "#8fe0ae",
  ride: "#ff7a7f",
  muted: "#a9b3c4",
};

// Scene timeline (frames @ 30fps)
const S = {
  bugle: [0, 150],
  school: [150, 195],
  life: [345, 75],
  calling: [420, 90],
  ride: [510, 510],
  trek: [1020, 350],
  gens: [1370, 180],
  end: [1550, 150],
} as const;
export const TOTAL_FRAMES = 1700;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ---------- Building blocks ----------

const KenBurns: React.FC<{
  src: string;
  from?: number;
  to?: number;
  x?: [number, number];
  y?: [number, number];
  filter?: string;
  position?: string;
  video?: boolean;
  band?: boolean;
  print?: boolean;
  wide?: boolean;
  lift?: number;
}> = ({ src, from = 1.05, to = 1.2, x = [0, 0], y = [0, 0], filter, position = "center", video, band, print, wide, lift = 480 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], clamp);
  const scale = from + (to - from) * p;
  const tx = x[0] + (x[1] - x[0]) * p;
  const ty = y[0] + (y[1] - y[0]) * p;
  const style: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: position,
    transform: `scale(${scale}) translate(${tx}%, ${ty}%)`,
    filter,
  };
  // An old photograph laid on screen as a print, so the whole wide frame stays visible
  // A wide banner photo shown full-width, so it is never stretched to fill the frame; `lift` raises it above the text
  if (wide) {
    return (
      <AbsoluteFill style={{ overflow: "hidden", background: C.night }}>
        <Img src={staticFile(src)} style={{ ...style, transform: "scale(1.4)", filter: `blur(40px) brightness(.5) ${filter ?? ""}` }} />
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: lift }}>
          <Img src={staticFile(src)} style={{ width: "100%", filter, boxShadow: "0 30px 80px rgba(0,0,0,.6)", transform: `scale(${scale})` }} />
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }
  if (print) {
    return (
      <AbsoluteFill style={{ overflow: "hidden", background: C.night }}>
        <Img src={staticFile(src)} style={{ ...style, transform: "scale(1.4)", filter: "blur(40px) brightness(.45)" }} />
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 520 }}>
          <Img
            src={staticFile(src)}
            style={{
              width: 980,
              border: "18px solid #efe6d2",
              borderBottomWidth: 40,
              boxShadow: "0 30px 80px rgba(0,0,0,.7)",
              transform: `scale(${scale}) rotate(-2deg)`,
            }}
          />
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }
  if (band) {
    return (
      <AbsoluteFill style={{ overflow: "hidden", background: C.night }}>
        <Img src={staticFile(src)} style={{ ...style, transform: "scale(1.3)", filter: "blur(40px) brightness(.55) saturate(1.2)" }} />
        <AbsoluteFill
          style={{
            height: 1250,
            WebkitMaskImage: "linear-gradient(180deg, #000 70%, transparent 100%)",
            maskImage: "linear-gradient(180deg, #000 70%, transparent 100%)",
          }}
        >
          <Img src={staticFile(src)} style={{ ...style, objectPosition: position, filter: "brightness(1.12) saturate(1.1)" }} />
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {video ? <OffthreadVideo src={staticFile(src)} muted style={style} /> : <Img src={staticFile(src)} style={style} />}
    </AbsoluteFill>
  );
};

// Fades a scene in and out over `edge` frames
const Fade: React.FC<{ children: React.ReactNode; edge?: number; inOnly?: boolean }> = ({
  children,
  edge = 12,
  inOnly,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const opacity = inOnly
    ? interpolate(frame, [0, edge], [0, 1], clamp)
    : interpolate(frame, [0, edge, durationInFrames - edge, durationInFrames], [0, 1, 1, 0], clamp);
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

// Text that rises into place with a spring, starting at `delay` frames
const Rise: React.FC<{ delay?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  delay = 0,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 120 } });
  return (
    <div style={{ opacity: s, transform: `translateY(${(1 - s) * 60}px)`, ...style }}>{children}</div>
  );
};

const Shade: React.FC<{ strength?: number; from?: "bottom" | "top" | "both" }> = ({
  strength = 0.85,
  from = "bottom",
}) => {
  const g =
    from === "bottom"
      ? `linear-gradient(180deg, rgba(7,11,20,0) 30%, rgba(7,11,20,${strength}) 72%, ${C.night} 100%)`
      : from === "top"
        ? `linear-gradient(0deg, rgba(7,11,20,0) 45%, rgba(7,11,20,${strength}) 100%)`
        : `linear-gradient(180deg, rgba(7,11,20,${strength * 0.7}) 0%, rgba(7,11,20,0) 25%, rgba(7,11,20,.1) 38%, rgba(7,11,20,${strength}) 66%, ${C.night} 100%)`;
  return <AbsoluteFill style={{ background: g }} />;
};

// Film grain + vignette for the nostalgia scenes
const OldFilm: React.FC = () => {
  const frame = useCurrentFrame();
  const flicker = 0.9 + 0.1 * Math.sin(frame * 1.7) * Math.sin(frame * 0.43);
  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(0,0,0,.75) 100%)",
        opacity: flicker,
        mixBlendMode: "multiply",
      }}
    />
  );
};

const Eyebrow: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = C.amber }) => (
  <div style={{ fontFamily: oswald, fontWeight: 700, fontSize: 40, letterSpacing: 10, textTransform: "uppercase", color, textShadow: "0 2px 16px rgba(0,0,0,.9)" }}>
    {children}
  </div>
);

const Big: React.FC<{ children: React.ReactNode; size?: number; color?: string }> = ({
  children,
  size = 128,
  color = C.cream,
}) => (
  <div
    style={{
      fontFamily: stencil,
      fontSize: size,
      lineHeight: 1.02,
      color,
      textTransform: "uppercase",
      textShadow: "0 8px 40px rgba(0,0,0,.6)",
    }}
  >
    {children}
  </div>
);

const Body: React.FC<{ children: React.ReactNode; size?: number; color?: string; weight?: number }> = ({
  children,
  size = 52,
  color = C.cream,
  weight = 600,
}) => (
  <div style={{ fontFamily: inter, fontWeight: weight, fontSize: size, lineHeight: 1.3, color, textShadow: "0 4px 20px rgba(0,0,0,.7)" }}>
    {children}
  </div>
);

const Pill: React.FC<{ children: React.ReactNode; bg: string; color?: string }> = ({ children, bg, color = "#fff" }) => (
  <span
    style={{
      display: "inline-block",
      padding: "14px 28px",
      borderRadius: 999,
      background: bg,
      color,
      fontFamily: oswald,
      fontWeight: 700,
      fontSize: 38,
      letterSpacing: 3,
      textTransform: "uppercase",
    }}
  >
    {children}
  </span>
);

const Pad: React.FC<{ children: React.ReactNode; justify?: "flex-end" | "center" | "flex-start" }> = ({
  children,
  justify = "flex-end",
}) => (
  <AbsoluteFill style={{ padding: "160px 90px 260px", justifyContent: justify, gap: 28 }}>{children}</AbsoluteFill>
);

// A slideshow of photos/clips inside one scene, crossfading. `dur` overrides `each` per item.
type Slide = { src: string; filter?: string; position?: string; video?: boolean; band?: boolean; print?: boolean; wide?: boolean; lift?: number; dur?: number; tag?: string };
const Slides: React.FC<{ items: Slide[]; each: number; overlap?: number }> = ({ items, each, overlap = 12 }) => {
  let at = 0;
  return (
    <>
      {items.map((it, i) => {
        const from = at;
        const dur = it.dur ?? each;
        at += dur;
        return (
          <Sequence key={it.src} from={from} durationInFrames={dur + overlap}>
            <Fade edge={overlap} inOnly>
              <KenBurns
                src={it.src}
                filter={it.filter}
                position={it.position}
                video={it.video}
                band={it.band}
                print={it.print}
                wide={it.wide}
                lift={it.lift}
                from={it.video || it.band || it.print || it.wide ? 1 : 1.05}
                to={it.video ? 1.06 : it.band || it.print || it.wide ? 1.08 : 1.2}
                x={it.video ? [0, 0] : i % 2 ? [-2, 2] : [2, -2]}
              />
              {it.tag && <Tag>{it.tag}</Tag>}
            </Fade>
          </Sequence>
        );
      })}
    </>
  );
};

// Small corner tag so real footage from past events isn't mistaken for the venue
const Tag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ alignItems: "flex-start", padding: "250px 90px", justifyContent: "flex-start" }}>
    <div style={{ fontFamily: inter, fontWeight: 600, fontSize: 26, color: "rgba(244,239,230,.85)", background: "rgba(7,11,20,.55)", padding: "8px 16px", borderRadius: 8 }}>
      {children}
    </div>
  </AbsoluteFill>
);

// ---------- Scenes ----------

const SEPIA = "sepia(.85) contrast(1.1) brightness(.85) saturate(.9)";
// Faded, warm "memory" grade for the real school photos
const MEMORY = "sepia(.4) contrast(1.05) brightness(.95) saturate(.85)";

const BugleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const light = interpolate(frame, [0, 30], [0, 1], clamp);
  return (
  <AbsoluteFill style={{ background: "#000" }}>
    <AbsoluteFill style={{ opacity: light }}>
      <Slides
        each={80}
        overlap={20}
        items={[
          { src: "sc-plane-dawn.jpg" },
          { src: "sc-plaza-dawn.jpg", dur: 70 },
        ]}
      />
    </AbsoluteFill>
    <Shade strength={0.55} from="top" />
    <Pad justify="center">
      <Rise delay={20}>
        <Body size={58} color={C.muted} weight={400}>
          0530 hrs.
        </Body>
      </Rise>
      <Rise delay={45}>
        <Big size={120}>Remember</Big>
        <Big size={120}>the mess</Big>
        <Big size={120} color={C.amber}>
          siren?
        </Big>
      </Rise>
    </Pad>
  </AbsoluteFill>
  );
};

const SchoolScene: React.FC = () => (
  <AbsoluteFill>
    <Slides
      each={48}
      items={[
        { src: "old-parade.jpg", print: true },
        { src: "sc-ptbars.jpg", filter: MEMORY },
        { src: "sc-run.jpg", filter: MEMORY, wide: true },
        { src: "sc-lightsout.jpg", filter: MEMORY + " brightness(.8)", dur: 51 },
      ]}
    />
    <OldFilm />
    <Shade strength={0.7} />
    <Pad>
      <Rise delay={10}>
        <Body size={64}>The bugle across the parade ground.</Body>
      </Rise>
      <Rise delay={56}>
        <Body size={64}>Morning PT.</Body>
      </Rise>
      <Rise delay={104}>
        <Body size={64}>Cross-country over trails and roads.</Body>
      </Rise>
      <Rise delay={152}>
        <Body size={64} color={C.amber}>
          Lights out — and stories long after.
        </Body>
      </Rise>
    </Pad>
  </AbsoluteFill>
);

const LifeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const words = ["Deadlines.", "Traffic.", "Screens.", "Someday…"];
  const idx = Math.min(words.length - 1, Math.floor(interpolate(frame, [22, 70], [0, words.length], clamp)));
  const shake = frame > 22 ? Math.sin(frame * 3) * 4 : 0;
  return (
    <AbsoluteFill style={{ background: "#1a1d23" }}>
      <Pad justify="center">
        <Body size={60} color={C.muted} weight={400}>
          Then life happened.
        </Body>
        {frame > 22 && (
          <div style={{ transform: `translateX(${shake}px)` }}>
            <Big size={140} color="#5d6573">
              {words[idx]}
            </Big>
          </div>
        )}
      </Pad>
    </AbsoluteFill>
  );
};

const CallingScene: React.FC = () => {
  const frame = useCurrentFrame();
  // Sepia drains away into colour: past becomes present
  const sep = interpolate(frame, [0, 45], [0.9, 0], clamp);
  const flash = interpolate(frame, [0, 6, 20], [0.9, 0.6, 0], clamp);
  return (
    <AbsoluteFill>
      <KenBurns src="parade-now.jpg" wide from={1} to={1.06} filter={`sepia(${sep})`} />
      <Shade strength={0.85} from="both" />
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
      <Pad>
        <Rise delay={8}>
          <Big size={118}>The bugle is</Big>
          <Big size={118} color={C.amber}>
            calling again.
          </Big>
        </Rise>
        <Rise delay={34}>
          <Body size={46} weight={400}>
            <i style={{ whiteSpace: "nowrap" }}>The Kazak Wanderlust never left us.</i>
          </Body>
        </Rise>
      </Pad>
    </AbsoluteFill>
  );
};

const TrekScene: React.FC = () => (
  <AbsoluteFill>
    <Slides
      each={60}
      items={[
        { src: "kolu-peak.jpg", band: true, tag: "Where we’re going · Kolukkumalai" },
        { src: "kolu-cliff.jpg", position: "center 30%", dur: 50, tag: "Where we’re going · Kolukkumalai" },
        { src: "trek-boat.mp4", video: true, tag: "Kazaks Trekking Club · Neyyar, Nov 2025" },
        { src: "trek-line.mp4", video: true, dur: 75, tag: "Kazaks Trekking Club · Neyyar, Nov 2025" },
        { src: "trek-hand.jpg", dur: 45, tag: "Kazaks Trekking Club · Neyyar, Nov 2025" },
        { src: "trek-cheer.mp4", video: true, tag: "Kazaks Trekking Club · Neyyar, Nov 2025" },
      ]}
    />
    <Shade strength={0.88} from="both" />
    <AbsoluteFill style={{ padding: "150px 90px", justifyContent: "flex-start" }}>
      <Rise delay={6}>
        <Pill bg={C.amber} color="#1b1200">
          26 slots
        </Pill>
      </Rise>
    </AbsoluteFill>
    <Pad>
      <Rise delay={0}>
        <Eyebrow color={C.trek}>Kazaks Trekking Club</Eyebrow>
      </Rise>
      <Rise delay={10}>
        <Big size={124} color={C.trek}>
          Dawn @
        </Big>
        <Big size={100} color={C.trek}>
          Kolukkumalai
        </Big>
      </Rise>
      <Rise delay={24}>
        <Body size={56}>5–6 December · Munnar</Body>
      </Rise>
      <Rise delay={40}>
        <Body size={50} weight={400}>
          Sunrise above the clouds.
        </Body>
      </Rise>
      <Rise delay={100}>
        <Body size={50} weight={400}>
          A night under the stars.
        </Body>
      </Rise>
      <Rise delay={160}>
        <Body size={50} weight={400}>
          4 AM wake-up — earlier than the mess siren!
        </Body>
      </Rise>
    </Pad>
  </AbsoluteFill>
);

// Ride: one Kazak Ghats Ride, two trails the riders choose between (510 frames)
const RideIntro: React.FC = () => (
  <AbsoluteFill>
    <KenBurns src="coonoor.jpg" wide lift={900} from={1} to={1.06} />
    <Tag>Kazak Bikers · Ride to Coonoor, Jan 2026</Tag>
    <Shade strength={0.88} from="both" />
    <AbsoluteFill style={{ padding: "150px 90px", justifyContent: "flex-start" }}>
      <Rise delay={4}>
        <Pill bg={C.red}>Republic Day weekend</Pill>
      </Rise>
    </AbsoluteFill>
    <Pad>
      <Rise delay={0}>
        <Eyebrow color={C.ride}>Kazak Ghats Ride</Eyebrow>
      </Rise>
      <Rise delay={6}>
        <Big size={124} color={C.ride}>
          Pick your
        </Big>
        <Big size={124} color={C.ride}>
          trail
        </Big>
      </Rise>
      <Rise delay={14}>
        <Body size={56}>23–25 January 2027</Body>
      </Rise>
    </Pad>
  </AbsoluteFill>
);

const FILM_ROUTE_T = { d1: [8, 48], d2: [60, 190], d3: [196, 232], zoom: [52, 80, 186, 212] } as {
  d1: [number, number];
  d2: [number, number];
  d3: [number, number];
  zoom: [number, number, number, number];
};

const ForestTrail: React.FC = () => (
  <AbsoluteFill style={{ background: C.night }}>
    <RouteMap T={FILM_ROUTE_T} />
    <MapShade />
    <RouteHeader eyebrow="TRAIL 1 · NEW" />
    <Sequence from={66} durationInFrames={32}>
      <Photo src="route/sathy.jpg" caption="Forest villages & their stories" len={32} />
    </Sequence>
    <Sequence from={98} durationInFrames={30}>
      <Photo src="route/dhimbam.jpg" caption="Dhimbam Ghat · 27 hairpins" len={30} />
    </Sequence>
    <Sequence from={128} durationInFrames={30}>
      <Photo src="route/deer.jpg" caption="Bandipur · herds of spotted deer" len={30} />
    </Sequence>
    <Sequence from={158} durationInFrames={32}>
      <Photo src="route/bandipur.jpg" caption="Elephant country" len={32} />
    </Sequence>
    <Sequence from={194} durationInFrames={46}>
      <Photo src="route/nilambur.jpg" caption="Nilambur · world’s oldest teak" len={46} />
    </Sequence>
    <Sequence from={20}>
      <DayLabel text="Villages · hairpins · wildlife" sub="Sathyamangalam → Bandipur → Gudalur" stat="~220 km a day" />
    </Sequence>
  </AbsoluteFill>
);

const MalabarTrail: React.FC = () => (
  <AbsoluteFill>
    <Slides
      each={55}
      items={[
        { src: "wayanad-churam.jpg", band: true, tag: "Where we’re going · Wayanad Churam" },
        { src: "churam-night.jpg", band: true, dur: 45, tag: "Where we’re going · Wayanad Churam" },
        { src: "ooty-road.mp4", video: true, dur: 60, tag: "Kazak Rider Group · Nilgiris, Jan 2026" },
      ]}
    />
    <Shade strength={0.88} from="both" />
    <Pad>
      <Rise delay={0}>
        <Eyebrow color={C.ride}>Trail 2</Eyebrow>
      </Rise>
      <Rise delay={6}>
        <Big size={124} color={C.ride}>
          Malabar
        </Big>
        <Big size={124} color={C.ride}>
          Days
        </Big>
      </Rise>
      <Rise delay={16}>
        <Body size={52}>Wayanad’s misty hills via the Churam</Body>
      </Rise>
      <Rise delay={60}>
        <Body size={46} weight={400}>
          Option: on to Kannur
        </Body>
      </Rise>
    </Pad>
  </AbsoluteFill>
);

const RidersChoose: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(110% 60% at 50% 45%, ${C.navy}, ${C.night} 75%)`, alignItems: "center", justifyContent: "center", gap: 34, padding: "0 70px", textAlign: "center" }}>
    <Rise delay={0}>
      <div style={{ display: "flex", gap: 22, justifyContent: "center", flexWrap: "wrap" }}>
        <Pill bg="#2f9e5b">🐘 Forest Trail</Pill>
        <Pill bg={C.red}>🌿 Malabar Days</Pill>
      </div>
    </Rise>
    <Rise delay={6}>
      <Big size={110}>Riders pick</Big>
      <Big size={110} color={C.amber}>
        the trail
      </Big>
    </Rise>
    <Rise delay={14}>
      <Body size={46} weight={400}>
        Same dates · same form · book now
      </Body>
    </Rise>
  </AbsoluteFill>
);

const RideScene: React.FC = () => (
  <AbsoluteFill>
    <Sequence durationInFrames={72}>
      <RideIntro />
    </Sequence>
    <Sequence from={60} durationInFrames={252}>
      <Fade edge={12} inOnly>
        <ForestTrail />
      </Fade>
    </Sequence>
    <Sequence from={300} durationInFrames={162}>
      <Fade edge={12} inOnly>
        <MalabarTrail />
      </Fade>
    </Sequence>
    <Sequence from={450}>
      <Fade edge={12} inOnly>
        <RidersChoose />
      </Fade>
    </Sequence>
  </AbsoluteFill>
);

// Gold = batches with Kazaks already registered
const BATCHES: { b: string; gold?: boolean }[] = [
  { b: "’65" },
  { b: "’82", gold: true },
  { b: "’93" },
  { b: "’96", gold: true },
  { b: "’98", gold: true },
  { b: "’99" },
  { b: "’06" },
  { b: "’11", gold: true },
  { b: "’16", gold: true },
];

const GensScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: `radial-gradient(120% 70% at 50% 30%, ${C.navy}, ${C.night} 75%)` }}>
      <AbsoluteFill style={{ top: 560, height: 608, overflow: "hidden" }}>
        <OffthreadVideo src={staticFile("ride-drone.mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover", opacity: interpolate(frame, [10, 30], [0, 1], clamp) }} />
        <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.night} 0%, rgba(7,11,20,0) 18%, rgba(7,11,20,0) 82%, ${C.night} 100%)` }} />
      </AbsoluteFill>
      <AbsoluteFill
        style={{ padding: "150px 70px 0", flexDirection: "row", flexWrap: "wrap", alignContent: "flex-start", gap: "10px 36px" }}
      >
        {BATCHES.map(({ b, gold }, i) => {
          const s = spring({ frame: frame - i * 4, fps, config: { damping: 12 } });
          return (
            <div
              key={b}
              style={{
                fontFamily: oswald,
                fontWeight: 700,
                fontSize: 104,
                color: gold ? C.amber : "rgba(255,255,255,.85)",
                opacity: s,
                transform: `scale(${0.6 + 0.4 * s})`,
              }}
            >
              {b}
            </div>
          );
        })}
      </AbsoluteFill>
      <Pad>
        <Rise delay={50}>
          <Body size={52}>Relive your school years. Or ride with the veterans.</Body>
        </Rise>
        <Rise delay={90}>
          <Big size={112}>Every batch.</Big>
          <Big size={112} color={C.red}>
            One squad.
          </Big>
        </Rise>
      </Pad>
    </AbsoluteFill>
  );
};

const EndScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = spring({ frame, fps, config: { damping: 11, stiffness: 90 } });
  // Once the logo has landed: one soft amber halo blooms behind it, and the logo gives one gentle pop
  const halo = interpolate(frame, [36, 50, 78], [0, 1, 0], clamp);
  const haloSize = interpolate(frame, [36, 78], [0.8, 1.7], clamp);
  const pop = 1 + 0.06 * interpolate(frame, [36, 45, 60], [0, 1, 0], { ...clamp, easing: Easing.inOut(Easing.quad) });
  return (
    <AbsoluteFill style={{ background: `radial-gradient(100% 60% at 50% 100%, rgba(227,27,35,.35), ${C.night} 70%)` }}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 34, padding: "0 70px", textAlign: "center" }}>
        <div style={{ position: "relative", width: 300, height: 300 }}>
          <div
            style={{
              position: "absolute",
              inset: -110,
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(255,196,110,1) 0%, rgba(255,182,72,.6) 38%, rgba(255,182,72,0) 70%)`,
              opacity: halo,
              transform: `scale(${haloSize})`,
            }}
          />
          <Img
            src={staticFile("oba-logo.png")}
            style={{ position: "relative", width: 300, height: 300, transform: `scale(${logo * pop}) rotate(${(1 - logo) * -40}deg)` }}
          />
        </div>
        <Rise delay={8}>
          <Eyebrow>Kazak Wanderlust · 2026–27</Eyebrow>
        </Rise>
        <Rise delay={12}>
          <Big size={136}>Fall in,</Big>
          <Big size={136} color={C.amber}>
            Kazaks!
          </Big>
        </Rise>
        <Rise delay={28}>
          <div style={{ display: "flex", gap: 22, justifyContent: "center", flexWrap: "wrap" }}>
            <Pill bg={C.red}>🏍️ Ride · 23–25 Jan</Pill>
            <Pill bg="#2f9e5b">🥾 Trek · 5–6 Dec</Pill>
          </div>
        </Rise>
        <Rise delay={44}>
          <Big size={84} color={C.cream}>
            Book your slot
          </Big>
          <Body size={44}>Ride: booking open · Trek: by 31 Oct</Body>
        </Rise>
        <Rise delay={58}>
          <Body size={46} color={C.amber}>
            adventures.sskzmoba.org
          </Body>
        </Rise>
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "flex-end", padding: "0 60px 70px", textAlign: "center" }}>
        <Body size={22} weight={400} color="rgba(169,179,196,.75)">
          SSKZM OBA Communications Cell
          <br />
          Music: “Intended Force” Kevin MacLeod (incompetech.com), CC BY 3.0 · Bugle “Assembly” (public domain) · Siren (CC0)
          <br />
          Photos &amp; clips: Kazak Rider Group, Kazaks Trekking Club &amp; SSKZM OBA · Destination photos via Wikimedia Commons:
          Musheer1999 (CC BY-SA 4.0), Karthick Gopalakrishnan (CC0), Sreeraj PS (CC BY-SA 3.0), Dhruvaraj S (CC BY 2.0), Murugavel.T (CC BY-SA 4.0), Jaseem Hamza (CC BY 3.0),
          Dineshkannambadi, L. Shyamal, PP Yoonus (CC BY-SA 3.0)
        </Body>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- Composition ----------

const Scene: React.FC<{ at: readonly [number, number]; children: React.ReactNode; edge?: number }> = ({
  at,
  children,
  edge = 10,
}) => (
  <Sequence from={at[0]} durationInFrames={at[1]}>
    <Fade edge={edge}>{children}</Fade>
  </Sequence>
);

export const FallIn: React.FC = () => (
  <AbsoluteFill style={{ background: C.night }}>
    <Scene at={S.bugle} edge={14}>
      <BugleScene />
    </Scene>
    <Scene at={S.school}>
      <SchoolScene />
    </Scene>
    <Scene at={S.life} edge={6}>
      <LifeScene />
    </Scene>
    <Scene at={S.calling} edge={4}>
      <CallingScene />
    </Scene>
    <Scene at={S.trek}>
      <TrekScene />
    </Scene>
    <Scene at={S.ride}>
      <RideScene />
    </Scene>
    <Scene at={S.gens}>
      <GensScene />
    </Scene>
    <Sequence from={S.end[0]} durationInFrames={S.end[1]}>
      <Fade edge={10} inOnly>
        <EndScene />
      </Fade>
    </Sequence>

    {/* 05:30 mess siren winds up in the dark, then hands over to the bugle across the parade ground */}
    <Sequence from={0} durationInFrames={185}>
      <Audio
        src={staticFile("siren.wav")}
        startFrom={60}
        volume={(f) => interpolate(f, [0, 20, 135, 185], [0, 1, 1, 0], clamp)}
      />
    </Sequence>
    <Sequence from={140} durationInFrames={330}>
      <Audio
        src={staticFile("assembly.mp3")}
        volume={(f) => interpolate(f, [0, 10, 300, 330], [0, 0.9, 0.9, 0], clamp)}
      />
    </Sequence>
    {/* Music bed: quiet under the nostalgia, full from the "calling again" moment, fades at the end */}
    <Sequence from={300}>
      <Audio
        src={staticFile("music.mp3")}
        volume={(f) =>
          interpolate(
            f,
            [0, 30, S.calling[0] - 300, S.calling[0] - 280, TOTAL_FRAMES - 300 - 45, TOTAL_FRAMES - 300],
            [0, 0.4, 0.4, 0.95, 0.95, 0],
            { ...clamp, easing: Easing.inOut(Easing.ease) }
          )
        }
      />
    </Sequence>
  </AbsoluteFill>
);
