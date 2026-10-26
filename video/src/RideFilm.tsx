import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadBarlow } from "@remotion/google-fonts/Barlow";
import { C, Fade, ForestTrail, KenBurns, Pill, Rise, Shade, Stamp, clamp, inter } from "./FallIn";
import { Stage, Sticker, StickerFan, WavingFlag } from "./RideKit";

// v4, ~63 s ride-only film, calmer and filmic: the sticker on the bike → misty road → kit → Jan 2026 (banner, roll-out,
// red shirts at Coonoor, the group) → THE FOREST TRAIL (three riders in the mist) → route → trail moments (chital,
// elephant, peacocks, 27 hairpins, if you're lucky) → riders → book. One grade and grain over everything.
const T = {
  open: [0, 120],
  mist: [120, 108],
  gear: [228, 220],
  last: [448, 270],
  intro: [718, 100],
  route: [818, 260],
  trail: [1078, 485],
  riders: [1563, 130],
  end: [1693, 200],
} as const;
export const RIDE_FRAMES = 1893;

// Two music versions. "bigrock": Kevin MacLeod (CC BY 4.0), one continuous take entering with the kit and running into
// the track's own fade under the end card. "sample": the music of the group's ride sample, looped twice on its
// 13.70 s phrase (jump 21.65 s → 7.95 s) so its natural ending lands on the end card.
export type RideProps = { music?: "bigrock" | "sample" };
const BIGROCK_AT = T.gear[0];
const BIGROCK_FROM = 172.2; // track seconds at BIGROCK_AT; the track fades out 216–229 s
const SAMPLE_AT = 18;
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

// The road from the group's ride sample, in the mist
const MistRoad: React.FC = () => (
  <AbsoluteFill style={{ background: C.night }}>
    <Band>
      <Clip src="ride/mist-pov.mp4" dur={T.mist[1]} position="center top" from={1.02} to={1.1} />
    </Band>
    <Low>
      <Words delay={10} kick="January 2027" a="The forest roads" b="are calling." />
    </Low>
  </AbsoluteFill>
);

// The group's own kit photo as a framed print: slow push-in and a light pass
const KitPhoto: React.FC<{ src: string }> = ({ src }) => {
  const frame = useCurrentFrame();
  const push = interpolate(frame, [0, EACH + 6], [1.06, 1], clamp);
  const sweep = interpolate(frame, [4, 32], [-30, 130], clamp);
  return (
    <div style={{ position: "relative", width: 760, height: 900, overflow: "hidden", borderRadius: 4, boxShadow: "0 50px 120px rgba(0,0,0,.85)", outline: "1px solid rgba(244,239,230,.35)", outlineOffset: 14 }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${push})`, filter: "contrast(1.06) saturate(.95)" }} />
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(115deg, transparent ${sweep - 22}%, rgba(255,255,255,.2) ${sweep}%, transparent ${sweep + 22}%)` }} />
    </div>
  );
};

// Kit: the real bandana, scarf, tee and flag as prints, then the redrawn stickers
const KIT: { label: string; el: React.ReactNode; tint?: string }[] = [
  { label: "Bandana", el: <KitPhoto src="ride/bandana.jpg" />, tint: "rgba(60,90,180,.25)" },
  { label: "Scarf", el: <KitPhoto src="ride/scarf.jpg" />, tint: "rgba(60,90,180,.25)" },
  { label: "Squad tee", el: <KitPhoto src="ride/tee.jpg" /> },
  { label: "Flag", el: <KitPhoto src="ride/flag.jpg" /> },
  { label: "Stickers", el: <StickerFan size={380} />, tint: "rgba(92,192,230,.2)" },
];
const EACH = 36;

const KitItem: React.FC<{ i: number; label: string; el: React.ReactNode; tint?: string }> = ({ i, label, el, tint }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 20, stiffness: 90 } });
  return (
    <AbsoluteFill style={{ background: C.night }}>
      <Stage tint={tint}>
        <div style={{ opacity: s, transform: `translateY(${(1 - s) * 50}px) scale(${0.94 + 0.06 * s})` }}>{el}</div>
      </Stage>
      <div style={{ position: "absolute", left: 110, top: 1360 }}>
        <Kick>
          Kit {two(i + 1)} / {two(KIT.length)}
        </Kick>
        <Rule delay={4} />
        <div style={{ opacity: s, transform: `translateX(${(1 - s) * -30}px)` }}>
          <Title size={110}>{label}</Title>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Gear: React.FC = () => {
  const done = KIT.length * EACH;
  return (
    <AbsoluteFill style={{ background: C.night }}>
      {KIT.map((k, i) => (
        <Sequence key={k.label} from={i * EACH} durationInFrames={EACH + 6}>
          <Fade edge={6} inOnly>
            <KitItem i={i} {...k} />
          </Fade>
        </Sequence>
      ))}
      <Sequence from={done}>
        <Fade edge={8} inOnly>
          <AbsoluteFill style={{ background: C.night, alignItems: "center", justifyContent: "center" }}>
            <div style={{ opacity: 0.32, marginBottom: 160 }}>
              <WavingFlag w={900} h={570} />
            </div>
          </AbsoluteFill>
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center" }}>
            <Rise>
              <Kick>Kit check · 5 / 5</Kick>
              <Title size={150}>Squad</Title>
              <Title size={150} color={C.amber}>
                ready.
              </Title>
            </Rise>
          </AbsoluteFill>
        </Fade>
      </Sequence>
    </AbsoluteFill>
  );
};

// Last year's banner, laid flat and square like a framed print, with a slow light pass
const Banner: React.FC = () => {
  const frame = useCurrentFrame();
  const push = interpolate(frame, [0, 70], [1, 1.04], clamp);
  const sweep = interpolate(frame, [8, 50], [-30, 130], clamp);
  const W = 960;
  const H = 600;
  return (
    <AbsoluteFill style={{ background: C.night }}>
      <AbsoluteFill style={{ transform: "scale(1.3)" }}>
        <Img src={staticFile("ride/banner.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(40px) brightness(.32)" }} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: (1080 - W) / 2, top: 400, width: W, height: H, overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,.75)", outline: "1px solid rgba(244,239,230,.35)", outlineOffset: 14 }}>
        <Img src={staticFile("ride/banner.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${push})` }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(115deg, transparent ${sweep - 22}%, rgba(255,255,255,.22) ${sweep}%, transparent ${sweep + 22}%)` }} />
      </div>
    </AbsoluteFill>
  );
};

const Still: React.FC<{ src: string; lift?: number }> = ({ src, lift = 420 }) => <KenBurns src={src} wide lift={lift} from={1} to={1.05} />;

const LastYear: React.FC = () => (
  <AbsoluteFill>
    <Sequence durationInFrames={75}>
      <Banner />
      <Low>
        <Words delay={4} kick="Jan 2026" a="Ride to Coonoor." size={100} />
      </Low>
    </Sequence>
    <Sequence from={65} durationInFrames={90}>
      <Fade edge={10} inOnly>
        <AbsoluteFill style={{ background: C.night }}>
          <Band>
            <Clip src="ride/gate-rollout.mp4" dur={90} startFrom={13 * 30} rate={1.5} position="55% center" from={1.02} to={1.06} />
          </Band>
          <Credit>{RIDERS}</Credit>
          <Low>
            <Words delay={6} kick="Jan 2026" a="Rolling out." />
          </Low>
        </AbsoluteFill>
      </Fade>
    </Sequence>
    <Sequence from={145} durationInFrames={80}>
      <Fade edge={10} inOnly>
        <AbsoluteFill>
          <Still src="coonoor.jpg" />
          <Credit>Kazak Rider Group · Coonoor, Jan 2026</Credit>
          <Low>
            <Words delay={4} kick="Jan 2026 · Coonoor" a="One squad." />
          </Low>
        </AbsoluteFill>
      </Fade>
    </Sequence>
    <Sequence from={215}>
      <Fade edge={10} inOnly>
        <AbsoluteFill>
          <Still src="ride/group.jpg" />
          <Credit>{RIDERS}</Credit>
          <Low>
            <Words delay={4} a="Every batch." b="One road." />
          </Low>
        </AbsoluteFill>
      </Fade>
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
        <Kick>January 2027 · Kazak Bike Ride</Kick>
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

// One trail moment: a landscape clip in the band, words below
const Moment: React.FC<{ src: string; dur: number; position?: string; kick?: string; a: string; b: string; from?: number; to?: number; filter?: string }> = ({ src, dur, position, kick, a, b, from, to, filter }) => (
  <AbsoluteFill style={{ background: C.night }}>
    <Band>
      <Clip src={src} dur={dur} position={position} from={from} to={to} filter={filter} />
    </Band>
    <Low>
      <Words delay={6} kick={kick} a={a} b={b} />
    </Low>
  </AbsoluteFill>
);

// The peacocks seen from the saddle: a slow, steady right-to-left pan with a slight ride bob
const Peacocks: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, dur], [22, 78]);
  const bob = Math.sin(frame / 5) * 5;
  return (
    <AbsoluteFill style={{ background: C.night }}>
      <Band>
        <OffthreadVideo src={staticFile("ride/peacock.mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: `${x}% 50%`, transform: `translateY(${bob}px) scale(1.04)` }} />
      </Band>
      <Low>
        <Words delay={8} a="Ride past" b="the dancers." />
      </Low>
    </AbsoluteFill>
  );
};

// The ghats in one beat: two road clips under a single caption, the count climbing to 27
const Hairpins: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const n = Math.round(interpolate(frame, [8, dur - 22], [1, 27], { ...clamp, easing: Easing.out(Easing.quad) }));
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
        <Words delay={4} kick="Into the ghats" a={<span style={{ fontVariantNumeric: "tabular-nums" }}>{n} hairpins.</span>} b="Take them all." />
      </Low>
    </AbsoluteFill>
  );
};

// "If you're lucky": through a camera viewfinder; the focus box settles, a soft shutter flash
const SPOTS = [
  { src: "ride/spot-tiger.jpg", label: "Tiger", fx: 0.74, fy: 0.55 },
  { src: "ride/spot-bear.jpg", label: "Sloth bear", fx: 0.33, fy: 0.4 },
  { src: "ride/spot-gaur.jpg", label: "Gaur", fx: 0.6, fy: 0.55 },
];
const SHOT = 35;
const VW = 880;
const VH = 1000;
const VX = 100;
const VY = 330;

const Sighting: React.FC<{ sp: (typeof SPOTS)[number]; i: number }> = ({ sp, i }) => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, SHOT], [1.16, 1.04], { ...clamp, easing: Easing.out(Easing.cubic) });
  const blur = interpolate(frame, [0, 9], [10, 0], clamp);
  const lock = interpolate(frame, [0, 10], [1.5, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const flash = interpolate(frame, [10, 11, 16], [0, 0.3, 0], clamp);
  const label = interpolate(frame, [11, 19], [0, 1], clamp);
  const box = interpolate(frame, [SHOT - 7, SHOT - 2], [1, 0], clamp);
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
        <Sequence key={sp.src} from={i * SHOT} durationInFrames={SHOT}>
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
    <Sequence durationInFrames={90}>
      <Moment src="ride/chital.mp4" dur={90} kick="On the Forest Trail" a="Ride along" b="the chital." />
    </Sequence>
    <Sequence from={90} durationInFrames={85}>
      <Fade edge={10} inOnly>
        <Moment src="ride/elephant.mp4" dur={85} position="35% center" a="Stop." b="Elephants first." from={1.05} to={1.13} filter="saturate(.78) hue-rotate(10deg) brightness(.96)" />
      </Fade>
    </Sequence>
    <Sequence from={175} durationInFrames={105}>
      <Fade edge={10} inOnly>
        <Peacocks dur={105} />
      </Fade>
    </Sequence>
    <Sequence from={280} durationInFrames={100}>
      <Fade edge={10} inOnly>
        <Hairpins dur={100} />
      </Fade>
    </Sequence>
    <Sequence from={380}>
      <Fade edge={10} inOnly>
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
      <Fade edge={10} inOnly>
        <KenBurns src="ooty-pillion.mp4" video from={1} to={1.05} />
      </Fade>
    </Sequence>
    <Credit>{RIDERS}</Credit>
    <Shade strength={0.9} />
    <Low>
      <Words delay={4} a="Lead." b="Or keep pace." size={120} />
      <Rise delay={46}>
        <div style={{ marginTop: 26, fontFamily: barlow, fontWeight: 500, fontSize: 42, letterSpacing: 1, color: C.cream }}>Pillion welcome. Full gear a must.</div>
      </Rise>
    </Low>
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
        const at = i ? p.at - X : p.at;
        const skip = i ? p.skip - X : p.skip;
        const dur = p.dur + (i ? X : 0) + (i < parts.length - 1 ? X : 0);
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
        <Scene at={T.mist}>
          <MistRoad />
        </Scene>
        <Scene at={T.gear} edge={8}>
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
      <Sfx src="sfx/rain.mp3" at={0} dur={330} vol={0.3 * fx} fade={20} />
      <Sfx src="sfx/bike1.mp3" at={T.mist[0] - 6} dur={120} vol={0.45 * fx} fade={14} />
      <Sfx src="sfx/rain.mp3" at={T.intro[0]} dur={T.intro[1]} vol={0.22 * fx} skip={300} fade={16} />
      <Sfx src="sfx/birds.mp3" at={T.trail[0]} dur={T.trail[1]} vol={0.5 * fx} skip={600} fade={20} />
      <Sfx src="sfx/elephant.mp3" at={T.trail[0] + 104} dur={45} vol={0.7 * fx} fade={3} />
      <Sfx src="sfx/peacock.mp3" at={T.trail[0] + 190} dur={90} vol={0.55 * fx} fade={10} />
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
