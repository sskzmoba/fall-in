import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
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
  school: [150, 180],
  life: [330, 90],
  calling: [420, 90],
  trek: [510, 270],
  ride: [780, 270],
  gens: [1050, 150],
  end: [1200, 150],
} as const;
export const TOTAL_FRAMES = 1350;

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
}> = ({ src, from = 1.05, to = 1.2, x = [0, 0], y = [0, 0], filter, position = "center" }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], clamp);
  const scale = from + (to - from) * p;
  const tx = x[0] + (x[1] - x[0]) * p;
  const ty = y[0] + (y[1] - y[0]) * p;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: position,
          transform: `scale(${scale}) translate(${tx}%, ${ty}%)`,
          filter,
        }}
      />
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

// A slideshow of photos inside one scene, crossfading
const Slides: React.FC<{ items: { src: string; filter?: string; position?: string }[]; each: number; overlap?: number }> = ({
  items,
  each,
  overlap = 12,
}) => (
  <>
    {items.map((it, i) => (
      <Sequence key={it.src} from={i * each} durationInFrames={each + overlap}>
        <Fade edge={overlap} inOnly={i === 0 ? false : true}>
          <KenBurns src={it.src} filter={it.filter} position={it.position} x={i % 2 ? [-2, 2] : [2, -2]} />
        </Fade>
      </Sequence>
    ))}
  </>
);

// ---------- Scenes ----------

const SEPIA = "sepia(.85) contrast(1.1) brightness(.85) saturate(.9)";

const BugleScene: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Pad justify="center">
      <Rise delay={20}>
        <Body size={58} color={C.muted} weight={400}>
          0530 hrs.
        </Body>
      </Rise>
      <Rise delay={45}>
        <Big size={120}>Remember</Big>
        <Big size={120}>the bugle</Big>
        <Big size={120} color={C.amber}>
          at dawn?
        </Big>
      </Rise>
    </Pad>
  </AbsoluteFill>
);

const SchoolScene: React.FC = () => (
  <AbsoluteFill>
    <Slides
      each={90}
      items={[
        { src: "school.jpg", filter: SEPIA, position: "30% center" },
        { src: "cadets.jpg", filter: SEPIA, position: "center 40%" },
      ]}
    />
    <OldFilm />
    <Shade strength={0.8} />
    <Pad>
      <Rise delay={10}>
        <Body size={64}>Dawn PT.</Body>
      </Rise>
      <Rise delay={40}>
        <Body size={64}>The parade ground.</Body>
      </Rise>
      <Rise delay={95}>
        <Body size={64}>Cross-country through the hills.</Body>
      </Rise>
      <Rise delay={125}>
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
  const idx = Math.min(words.length - 1, Math.floor(interpolate(frame, [30, 90], [0, words.length], clamp)));
  const shake = frame > 30 ? Math.sin(frame * 3) * 4 : 0;
  return (
    <AbsoluteFill style={{ background: "#1a1d23" }}>
      <Pad justify="center">
        <Body size={60} color={C.muted} weight={400}>
          Then life happened.
        </Body>
        {frame > 30 && (
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
      <KenBurns src="hero.jpg" from={1.25} to={1.08} filter={`sepia(${sep})`} position="center 35%" />
      <Shade strength={0.85} from="both" />
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
      <Pad>
        <Rise delay={8}>
          <Big size={118}>The bugle is</Big>
          <Big size={118} color={C.amber}>
            calling again.
          </Big>
        </Rise>
      </Pad>
    </AbsoluteFill>
  );
};

const TrekScene: React.FC = () => (
  <AbsoluteFill>
    <Slides
      each={68}
      items={[
        { src: "trek.jpg", position: "65% center" },
        { src: "stars.jpg" },
        { src: "reach.jpg", position: "center 30%" },
        { src: "trail.jpg" },
      ]}
    />
    <Shade strength={0.88} from="both" />
    <AbsoluteFill style={{ padding: "150px 90px", justifyContent: "flex-start" }}>
      <Rise delay={6}>
        <Pill bg={C.amber} color="#1b1200">
          Only 26 seats
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
      <Rise delay={80}>
        <Body size={50} weight={400}>
          A night under the stars.
        </Body>
      </Rise>
      <Rise delay={140}>
        <Body size={50} weight={400}>
          4 AM reveille — just like old times.
        </Body>
      </Rise>
      <Rise delay={200}>
        <Body size={50} weight={400}>
          Sunrise above the clouds.
        </Body>
      </Rise>
    </Pad>
  </AbsoluteFill>
);

const RideScene: React.FC = () => (
  <AbsoluteFill>
    <Slides
      each={68}
      items={[
        { src: "ride.jpg" },
        { src: "churam-night.jpg" },
        { src: "bikes.jpg", position: "70% center" },
        { src: "tea.jpg" },
      ]}
    />
    <Shade strength={0.88} from="both" />
    <AbsoluteFill style={{ padding: "150px 90px", justifyContent: "flex-start" }}>
      <Rise delay={6}>
        <Pill bg={C.red}>Republic Day weekend</Pill>
      </Rise>
    </AbsoluteFill>
    <Pad>
      <Rise delay={0}>
        <Eyebrow color={C.ride}>Kazak Bike Ride</Eyebrow>
      </Rise>
      <Rise delay={10}>
        <Big size={124} color={C.ride}>
          Malabar
        </Big>
        <Big size={124} color={C.ride}>
          Days
        </Big>
      </Rise>
      <Rise delay={24}>
        <Body size={56}>23–25 January · Wayanad</Body>
      </Rise>
      <Rise delay={80}>
        <Body size={50} weight={400}>
          Bangalore &amp; Kochi groups meet in Wayanad.
        </Body>
      </Rise>
      <Rise delay={140}>
        <Body size={50} weight={400}>
          Misty hills. Winding ghat roads.
        </Body>
      </Rise>
      <Rise delay={200}>
        <Body size={50} weight={400}>
          After Ooty — the roads are calling again.
        </Body>
      </Rise>
    </Pad>
  </AbsoluteFill>
);

const BATCHES = ["’66", "’71", "’77", "’83", "’88", "’92", "’96", "’99", "’03", "’06", "’11", "’15", "’20"];

const GensScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: `radial-gradient(120% 70% at 50% 30%, ${C.navy}, ${C.night} 75%)` }}>
      <AbsoluteFill
        style={{ padding: "170px 70px 0", flexDirection: "row", flexWrap: "wrap", alignContent: "flex-start", gap: "18px 26px" }}
      >
        {BATCHES.map((b, i) => {
          const s = spring({ frame: frame - i * 3, fps, config: { damping: 12 } });
          return (
            <div
              key={b}
              style={{
                fontFamily: oswald,
                fontWeight: 700,
                fontSize: 92,
                color: i % 3 === 2 ? C.amber : "rgba(255,255,255,.85)",
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
        <Rise delay={40}>
          <Body size={58}>Relive your school years.</Body>
        </Rise>
        <Rise delay={65}>
          <Body size={58}>Or ride with the veterans.</Body>
        </Rise>
        <Rise delay={95}>
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
  return (
    <AbsoluteFill style={{ background: `radial-gradient(100% 60% at 50% 100%, rgba(227,27,35,.35), ${C.night} 70%)` }}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 34, padding: "0 70px", textAlign: "center" }}>
        <Img
          src={staticFile("oba-logo.png")}
          style={{ width: 300, height: 300, transform: `scale(${logo}) rotate(${(1 - logo) * -40}deg)` }}
        />
        <Rise delay={12}>
          <Big size={136}>Fall in,</Big>
          <Big size={136} color={C.amber}>
            Kazaks!
          </Big>
        </Rise>
        <Rise delay={28}>
          <div style={{ display: "flex", gap: 22, justifyContent: "center", flexWrap: "wrap" }}>
            <Pill bg="#2f9e5b">🥾 Trek · 5–6 Dec</Pill>
            <Pill bg={C.red}>🏍️ Ride · 23–25 Jan</Pill>
          </div>
        </Rise>
        <Rise delay={44}>
          <Big size={84} color={C.cream}>
            Book by 31 Oct
          </Big>
        </Rise>
        <Rise delay={58}>
          <Body size={46} color={C.amber}>
            sskzmoba.github.io/fall-in
          </Body>
        </Rise>
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "flex-end", padding: "0 60px 70px", textAlign: "center" }}>
        <Body size={22} weight={400} color="rgba(169,179,196,.75)">
          SSKZM OBA · ज्ञान · अनुशासन · सहयोग
          <br />
          Music: “Intended Force” Kevin MacLeod (incompetech.com), CC BY 3.0 · Reveille: US Army Band (public domain)
          <br />
          Photos: Wikimedia Commons contributors (CC0 / CC BY / CC BY-SA)
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

    {/* Reveille opens the film, and returns briefly when "the bugle is calling again" */}
    <Sequence from={0} durationInFrames={170}>
      <Audio
        src={staticFile("reveille.mp3")}
        volume={(f) => interpolate(f, [0, 130, 170], [0.9, 0.9, 0], clamp)}
      />
    </Sequence>
    {/* Music bed: quiet under the nostalgia, full from the "calling again" moment, fades at the end */}
    <Sequence from={140}>
      <Audio
        src={staticFile("music.mp3")}
        volume={(f) =>
          interpolate(
            f,
            [0, 40, S.calling[0] - 160, S.calling[0] - 140, TOTAL_FRAMES - 140 - 45, TOTAL_FRAMES - 140],
            [0, 0.35, 0.35, 0.85, 0.85, 0],
            { ...clamp, easing: Easing.inOut(Easing.ease) }
          )
        }
      />
    </Sequence>
  </AbsoluteFill>
);
