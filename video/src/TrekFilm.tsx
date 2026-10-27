import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { Big, Body, C, Eyebrow, Fade, KenBurns, MEMORY, OldFilm, Pad, Pill, Rise, Shade, Slides, Tag, clamp, oswald, stencil, inter } from "./FallIn";

// ~46 s trek-only film: "Remember the siren?" → this December, 4 AM by choice → Kolukkumalai → order of the day
// → last year's snapshot (we've done this before) → every batch, ~20 in → under 10 slots → book
const T = {
  intro: [0, 210],
  turn: [210, 90],
  title: [300, 110],
  orders: [410, 400],
  last: [810, 135],
  batches: [945, 140],
  hurry: [1085, 100],
  end: [1185, 210],
} as const;
export const TREK_FRAMES = 1395;

// Music: swap the file here (Kevin MacLeod, incompetech.com, CC BY 4.0); `from` skips a slow intro (seconds)
// "Nonstop" gets loudest ~60 s in; starting at 30 s puts that peak on the slots/book beat and the end card
const MUSIC = { src: "trek-music.mp3", title: "Nonstop", from: 30 };

const TREK = "#8fe0ae";
const GREEN = "#2f9e5b";
const KOLU = "Where we’re going · Kolukkumalai";
const NEYYAR = "Kazaks Trekking Club · Neyyar, Nov 2025";

const Scene: React.FC<{ at: readonly [number, number]; children: React.ReactNode; edge?: number }> = ({ at, children, edge = 10 }) => (
  <Sequence from={at[0]} durationInFrames={at[1]}>
    <Fade edge={edge}>{children}</Fade>
  </Sequence>
);

const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const light = interpolate(frame, [0, 30], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ opacity: light }}>
        <Slides
          each={70}
          overlap={14}
          items={[
            { src: "sc-plane-dawn.jpg", dur: 80 },
            { src: "sc-ptbars.jpg", filter: MEMORY, dur: 65 },
            { src: "sc-run.jpg", filter: MEMORY, wide: true, dur: 65 },
          ]}
        />
      </AbsoluteFill>
      <OldFilm />
      <Shade strength={0.75} />
      <Pad>
        <Rise delay={8}>
          <Eyebrow>Remember?</Eyebrow>
        </Rise>
        <Rise delay={20}>
          <Body size={58} color={C.muted} weight={400}>
            0530 hrs.
          </Body>
        </Rise>
        <Rise delay={34}>
          <Big size={112}>The mess siren.</Big>
        </Rise>
        <Rise delay={95}>
          <Body size={60}>Morning PT. Cross-country.</Body>
        </Rise>
        <Rise delay={150}>
          <Body size={60} color={C.amber}>
            We were up before the sun.
          </Body>
        </Rise>
      </Pad>
    </AbsoluteFill>
  );
};

// 0530 gets struck out, 0400 springs in over the pre-dawn sky
const Turn: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const strike = interpolate(frame, [8, 18], [0, 1], clamp);
  const s = spring({ frame: frame - 20, fps, config: { damping: 12, stiffness: 140 } });
  return (
    <AbsoluteFill>
      <KenBurns src="trek/stars-tall.jpg" from={1.02} to={1.1} />
      <Shade strength={0.85} from="both" />
      <AbsoluteFill style={{ padding: "330px 90px 0", gap: 6 }}>
        <div style={{ position: "relative", alignSelf: "flex-start", fontFamily: stencil, fontSize: 90, color: C.muted, opacity: 1 - 0.5 * strike }}>
          0530 HRS
          <div style={{ position: "absolute", left: -10, top: "52%", height: 10, width: `${strike * 105}%`, background: C.red, transform: "rotate(-4deg)" }} />
        </div>
        <div style={{ fontFamily: stencil, fontSize: 170, lineHeight: 1, whiteSpace: "nowrap", color: C.amber, opacity: s, transform: `scale(${0.6 + 0.4 * s})`, transformOrigin: "left center" }}>0400 HRS</div>
      </AbsoluteFill>
      <Pad>
        <Rise delay={30}>
          <Eyebrow color={TREK}>This year ⏩ Munnar</Eyebrow>
        </Rise>
        <Rise delay={34}>
          <Big size={104}>This December,</Big>
          <Body size={58}>we wake at 4. By choice.</Body>
        </Rise>
      </Pad>
    </AbsoluteFill>
  );
};

const Title: React.FC = () => (
  <AbsoluteFill>
    <KenBurns src="trek/peak-sunrise.jpg" from={1.02} to={1.12} />
    <Tag>{KOLU}</Tag>
    <Shade strength={0.9} />
    <AbsoluteFill style={{ padding: "150px 90px", justifyContent: "flex-start" }}>
      <Rise delay={8}>
        <Pill bg={C.amber} color="#1b1200">
          New destination · 2026
        </Pill>
      </Rise>
    </AbsoluteFill>
    <Pad>
      <Rise delay={0}>
        <Eyebrow color={TREK}>This year · Kazak Trek</Eyebrow>
      </Rise>
      <Rise delay={8}>
        <Big size={124} color={TREK}>
          Dawn @
        </Big>
        <Big size={100} color={TREK}>
          Kolukkumalai
        </Big>
      </Rise>
      <Rise delay={20}>
        <Body size={56}>5–6 December · Munnar</Body>
      </Rise>
    </Pad>
  </AbsoluteFill>
);

// "Order of the day": each photo gets a time stamp and one line, like drill orders
const ORDERS = [
  { src: "trek/tea-wide.jpg", band: true, dur: 60, tag: KOLU, when: "Day 1 · 05:30", what: "Bus rolls out of Kowdiar, TVM" },
  { src: "trek/k-jeep-track.jpg", dur: 70, tag: KOLU, when: "Day 1", what: "Jeeps up the world’s highest tea estate" },
  { src: "trek/k-tents-night.jpg", band: true, dur: 65, tag: "Tent stay", when: "Night", what: "Tents under the stars" },
  { src: "trek/k-dawn-walk.jpg", band: true, position: "center 88%", dur: 70, tag: KOLU, when: "Day 2 · 04:00", what: "Torch-lit climb to the viewpoint" },
  { src: "trek/k-peak-sun.jpg", band: true, dur: 75, tag: KOLU, when: "Day 2 · sunrise", what: "The sun breaks over the clouds", gold: true },
  { src: "trek/k-clouds-tall.jpg", dur: 60, tag: "Munnar hills", when: "Day 2", what: "Above the clouds. Then home." },
];

const Order: React.FC<{ when: string; what: string; gold?: boolean }> = ({ when, what, gold }) => (
  <Pad>
    <Rise delay={2}>
      <div style={{ fontFamily: oswald, fontWeight: 700, fontSize: 52, letterSpacing: 4, color: gold ? C.amber : TREK }}>{when}</div>
    </Rise>
    <Rise delay={8}>
      <Big size={gold ? 104 : 92} color={gold ? C.amber : C.cream}>
        {what}
      </Big>
    </Rise>
  </Pad>
);

const Orders: React.FC = () => {
  let at = 0;
  return (
    <AbsoluteFill>
      <Slides each={70} items={ORDERS} />
      <Shade strength={0.9} from="both" />
      <AbsoluteFill style={{ padding: "150px 90px 0" }}>
        <div style={{ fontFamily: oswald, fontWeight: 700, fontSize: 40, letterSpacing: 10, color: C.cream, textShadow: "0 2px 16px rgba(0,0,0,.9)" }}>ORDER OF THE DAY</div>
        <div style={{ marginTop: 10, height: 4, width: 220, background: GREEN }} />
      </AbsoluteFill>
      {ORDERS.map((o) => {
        const from = at;
        at += o.dur;
        return (
          <Sequence key={o.src} from={from} durationInFrames={o.dur}>
            <Fade edge={8}>
              <Order when={o.when} what={o.what} gold={o.gold} />
            </Fade>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

const LastYear: React.FC = () => (
  <AbsoluteFill>
    <Slides
      each={45}
      items={[
        { src: "trek/stream.jpg", band: true, dur: 45, tag: NEYYAR },
        { src: "trek-line.mp4", video: true, dur: 45, tag: NEYYAR },
        { src: "trek-cheer.mp4", video: true, dur: 45, tag: NEYYAR },
      ]}
    />
    <OldFilm />
    <Shade strength={0.88} from="both" />
    <AbsoluteFill style={{ padding: "150px 90px 0" }}>
      <Rise delay={2}>
        <Pill bg="rgba(7,11,20,.7)" color={C.cream}>
          ⏪ Last year · a snapshot
        </Pill>
      </Rise>
    </AbsoluteFill>
    <Pad>
      <Rise delay={6}>
        <Eyebrow color={TREK}>Kazak Trek 2025</Eyebrow>
      </Rise>
      <Rise delay={12}>
        <Big size={120}>Neyyar.</Big>
        <Body size={52}>We’ve done this before.</Body>
      </Rise>
    </Pad>
  </AbsoluteFill>
);

// Batch years on screen: those already registered for the trek (public list, 26 Oct) light up in gold.
// Only batches known to exist (see build.md).
const ALL_BATCHES = ["’65", "’76", "’82", "’93", "’96", "’98", "’99", "’06", "’07", "’11", "’16"];
const IN_BATCHES = new Set(["’76", "’82", "’98", "’06", "’07"]);

const Batches: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lit = spring({ frame: frame - 30, fps, config: { damping: 14 } });
  const count = Math.round(interpolate(frame, [48, 78], [1, 20], { ...clamp, easing: Easing.out(Easing.cubic) }));
  const countPop = spring({ frame: frame - 78, fps, config: { damping: 8, stiffness: 180 } });
  return (
    <AbsoluteFill style={{ background: `radial-gradient(120% 70% at 50% 30%, #123d2a, ${C.night} 75%)` }}>
      <AbsoluteFill style={{ padding: "230px 70px 0", flexDirection: "row", flexWrap: "wrap", alignContent: "flex-start", justifyContent: "center", gap: "18px 64px" }}>
        {ALL_BATCHES.map((b, i) => {
          const s = spring({ frame: frame - i * 2, fps, config: { damping: 14 } });
          const on = IN_BATCHES.has(b);
          return (
            <div
              key={b}
              style={{
                position: "relative",
                fontFamily: oswald,
                fontWeight: 700,
                fontSize: 128,
                color: on ? C.amber : C.cream,
                opacity: s * (on ? 0.3 + 0.7 * lit : 0.3),
                transform: `scale(${(0.7 + 0.3 * s) * (on ? 1 + 0.12 * lit : 1)})`,
                textShadow: on ? `0 0 ${30 * lit}px rgba(255,182,72,.8)` : "none",
              }}
            >
              {b}
              {on && (
                <span style={{ position: "absolute", top: 6, right: -30, width: 44, height: 44, borderRadius: 999, background: GREEN, color: "#fff", fontFamily: inter, fontSize: 26, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", opacity: lit, transform: `scale(${lit})` }}>
                  ✓
                </span>
              )}
            </div>
          );
        })}
      </AbsoluteFill>
      <Pad>
        <Rise delay={44}>
          <Body size={52} color={TREK} weight={800}>
            ✓ Batches already in
          </Body>
          <div style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
            <Big size={110}>Nearly</Big>
            <div style={{ fontFamily: stencil, fontSize: 230, lineHeight: 0.95, color: C.amber, transform: `scale(${1 + 0.1 * countPop - 0.1 * Math.min(1, countPop)})`, textShadow: "0 0 40px rgba(255,182,72,.5)" }}>
              {count}
            </div>
          </div>
          <Big size={110} color={TREK}>
            already booked.
          </Big>
        </Rise>
        <Rise delay={90}>
          <Body size={54} color={C.amber} weight={800}>
            All ages. All batches. One team.
          </Body>
        </Rise>
      </Pad>
    </AbsoluteFill>
  );
};

// Scarcity beat: tents are limited, so slots are too
const Hurry: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 26, fps, config: { damping: 9, stiffness: 160 } });
  return (
    <AbsoluteFill>
      <KenBurns src="trek/k-tents-night.jpg" band position="85% center" from={1} to={1.06} />
      <Tag>Tent stay</Tag>
      <Shade strength={0.92} from="both" />
      <Pad>
        <Rise delay={2}>
          <Body size={58}>Tents are limited.</Body>
        </Rise>
        <Rise delay={8}>
          <div
            style={{
              alignSelf: "flex-start",
              display: "inline-block",
              padding: "12px 34px 6px",
              borderRadius: 22,
              background: C.red,
              boxShadow: `0 0 ${40 + 30 * Math.sin(frame / 5)}px rgba(227,27,35,.75)`,
              transform: `scale(${1 + 0.035 * Math.sin(frame / 5)})`,
              transformOrigin: "left center",
            }}
          >
            <div style={{ whiteSpace: "nowrap" }}><Big size={140}>Under 10</Big></div>
          </div>
          <Big size={120}>slots left.</Big>
        </Rise>
        <div style={{ alignSelf: "flex-start", marginTop: 16, opacity: s, transform: `scale(${1.45 * (0.7 + 0.3 * s)}) rotate(-3deg)`, transformOrigin: "left center" }}>
          <Pill bg={C.amber} color="#1b1200">BOOK FAST</Pill>
        </div>
      </Pad>
    </AbsoluteFill>
  );
};

const End: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = spring({ frame, fps, config: { damping: 11, stiffness: 90 } });
  const halo = interpolate(frame, [36, 50, 78], [0, 1, 0], clamp);
  const haloSize = interpolate(frame, [36, 78], [0.8, 1.7], clamp);
  const pop = 1 + 0.06 * interpolate(frame, [36, 45, 60], [0, 1, 0], { ...clamp, easing: Easing.inOut(Easing.quad) });
  return (
    <AbsoluteFill style={{ background: `radial-gradient(100% 60% at 50% 100%, rgba(47,158,91,.4), ${C.night} 70%)` }}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 30, padding: "0 70px", textAlign: "center" }}>
        <div style={{ position: "relative", width: 280, height: 280 }}>
          <div
            style={{
              position: "absolute",
              inset: -110,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,196,110,1) 0%, rgba(255,182,72,.6) 38%, rgba(255,182,72,0) 70%)",
              opacity: halo,
              transform: `scale(${haloSize})`,
            }}
          />
          <Img src={staticFile("oba-logo.png")} style={{ position: "relative", width: 280, height: 280, transform: `scale(${logo * pop}) rotate(${(1 - logo) * -40}deg)` }} />
        </div>
        <Rise delay={10}>
          <Big size={124}>Let’s go</Big>
          <Big size={124} color={C.amber}>
            chase the dawn
          </Big>
        </Rise>
        <Rise delay={24}>
          <Pill bg={GREEN}>🥾 Kazak Trek · 5–6 Dec</Pill>
        </Rise>
        <Rise delay={36}>
          <Big size={72}>Book by 31 Oct</Big>
        </Rise>
        <Rise delay={48}>
          <Body size={50} color={C.amber}>
            adventures.sskzmoba.org/trek
          </Body>
        </Rise>
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "flex-end", padding: "0 60px 60px", textAlign: "center" }}>
        <div style={{ fontFamily: inter, fontSize: 15, lineHeight: 1.4, color: "rgba(169,179,196,.6)" }}>
          SSKZM OBA Communications Cell · Music: “{MUSIC.title}” Kevin MacLeod (incompetech.com), CC BY 4.0 · Siren (CC0)
          <br />
          Photos &amp; clips: Kazaks Trekking Club &amp; SSKZM OBA · Via Wikimedia Commons: Yahya, Jan J George (CC BY-SA 4.0),
          Musheer1999, Alok Kumar, NjaanAnoop (CC BY-SA 4.0), Dharaniyakumar (CC BY 4.0), Joshua Tree National Park (public domain)
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const TrekFilm: React.FC = () => (
  <AbsoluteFill style={{ background: C.night }}>
    <Scene at={T.intro} edge={14}>
      <Intro />
    </Scene>
    <Scene at={T.turn} edge={6}>
      <Turn />
    </Scene>
    <Scene at={T.title}>
      <Title />
    </Scene>
    <Scene at={T.orders}>
      <Orders />
    </Scene>
    <Scene at={T.last}>
      <LastYear />
    </Scene>
    <Scene at={T.batches}>
      <Batches />
    </Scene>
    <Scene at={T.hurry} edge={8}>
      <Hurry />
    </Scene>
    <Sequence from={T.end[0]} durationInFrames={T.end[1]}>
      <Fade edge={10} inOnly>
        <End />
      </Fade>
    </Sequence>

    {/* The 05:30 mess siren opens, then upbeat music drives the rest */}
    <Sequence from={0} durationInFrames={225}>
      <Audio src={staticFile("siren.wav")} startFrom={60} volume={(f) => interpolate(f, [0, 20, 175, 225], [0, 1, 1, 0], clamp)} />
    </Sequence>
    <Sequence from={T.turn[0] + 6}>
      <Audio
        src={staticFile(MUSIC.src)}
        startFrom={Math.round(MUSIC.from * 30)}
        volume={(f) => interpolate(f, [0, 8, TREK_FRAMES - T.turn[0] - 70, TREK_FRAMES - T.turn[0] - 6], [0, 0.9, 0.9, 0], { ...clamp, easing: Easing.inOut(Easing.ease) })}
      />
    </Sequence>
  </AbsoluteFill>
);
