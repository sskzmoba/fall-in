import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { Big, Body, C, Eyebrow, Fade, KenBurns, MEMORY, OldFilm, Pad, Pill, Rise, Shade, Slides, Tag, clamp, oswald, stencil, inter } from "./FallIn";

// 45 s trek-only film: school dawns → 4 AM by choice → Kolukkumalai "order of the day" → last year → book
const T = {
  intro: [0, 210],
  turn: [210, 90],
  title: [300, 120],
  orders: [420, 370],
  last: [790, 300],
  batches: [1090, 120],
  end: [1210, 140],
} as const;
export const TREK_FRAMES = 1350;

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
        <Rise delay={18}>
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
          26 slots · 8 left
        </Pill>
      </Rise>
    </AbsoluteFill>
    <Pad>
      <Rise delay={0}>
        <Eyebrow color={TREK}>Adventure · Kazak Trek</Eyebrow>
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
  { src: "trek/tea-wide.jpg", band: true, dur: 70, tag: KOLU, when: "Day 1 · 05:30", what: "Bus rolls out of Kowdiar, TVM" },
  { src: "trek/jeep.jpg", dur: 70, tag: "Jeeps in Munnar", when: "Day 1", what: "Jeeps up the world’s highest tea estate" },
  { src: "trek/tent-stars.jpg", dur: 70, tag: "Tent stay", when: "Night", what: "Tents under the stars" },
  { src: "trek/trail-dawn.jpg", filter: "brightness(1.35) contrast(1.05)", dur: 70, tag: KOLU, when: "Day 2 · 04:00", what: "Torch-lit climb to the viewpoint" },
  { src: "trek/sunrise-wide.jpg", band: true, dur: 90, tag: KOLU, when: "Day 2 · sunrise", what: "The sun breaks over the clouds", gold: true },
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
      each={75}
      items={[
        { src: "trek/stream.jpg", band: true, dur: 55, tag: NEYYAR },
        { src: "trek-boat.mp4", video: true, dur: 60, tag: NEYYAR },
        { src: "trek-line.mp4", video: true, dur: 60, tag: NEYYAR },
        { src: "trek-hand.jpg", dur: 60, tag: NEYYAR },
        { src: "trek-cheer.mp4", video: true, dur: 65, tag: NEYYAR },
      ]}
    />
    <Shade strength={0.88} from="both" />
    <Sequence durationInFrames={175}>
      <Fade edge={10}>
        <Pad>
          <Rise delay={4}>
            <Eyebrow color={TREK}>Last November</Eyebrow>
          </Rise>
          <Rise delay={10}>
            <Big size={120}>Neyyar.</Big>
            <Body size={52}>Forest streams, a boat crossing, a waterfall.</Body>
          </Rise>
        </Pad>
      </Fade>
    </Sequence>
    <Sequence from={175}>
      <Fade edge={10} inOnly>
        <Pad>
          <Rise delay={4}>
            <Big size={120}>Nobody</Big>
            <Big size={120} color={C.amber}>
              left behind.
            </Big>
          </Rise>
        </Pad>
      </Fade>
    </Sequence>
  </AbsoluteFill>
);

// Batches already registered (from the public list, 26 Oct)
const IN_BATCHES = ["’76", "’82", "’98", "’06", "’07"];

const Batches: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: `radial-gradient(120% 70% at 50% 30%, #123d2a, ${C.night} 75%)` }}>
      <AbsoluteFill style={{ padding: "260px 70px 0", flexDirection: "row", flexWrap: "wrap", alignContent: "flex-start", gap: "10px 40px" }}>
        {IN_BATCHES.map((b, i) => {
          const s = spring({ frame: frame - i * 5, fps, config: { damping: 12 } });
          return (
            <div key={b} style={{ fontFamily: oswald, fontWeight: 700, fontSize: 128, color: C.amber, opacity: s, transform: `scale(${0.6 + 0.4 * s})` }}>
              {b}
            </div>
          );
        })}
      </AbsoluteFill>
      <Pad>
        <Rise delay={30}>
          <Big size={112}>14 Kazaks</Big>
          <Big size={112} color={TREK}>
            already in.
          </Big>
        </Rise>
        <Rise delay={50}>
          <Body size={52}>+ family · 8 of 26 slots left</Body>
        </Rise>
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
          <Big size={124}>Fall in</Big>
          <Big size={124} color={C.amber}>
            for the dawn
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
        <div style={{ fontFamily: inter, fontSize: 21, lineHeight: 1.4, color: "rgba(169,179,196,.75)" }}>
          SSKZM OBA Communications Cell · Music: “Americana” Kevin MacLeod (incompetech.com), CC BY 4.0 · Siren (CC0)
          <br />
          Photos &amp; clips: Kazaks Trekking Club &amp; SSKZM OBA · Via Wikimedia Commons: Yahya, Jan J George (CC BY-SA 4.0),
          Dharaniyakumar (CC BY 4.0), Joshua Tree National Park (public domain)
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
    <Sequence from={T.end[0]} durationInFrames={T.end[1]}>
      <Fade edge={10} inOnly>
        <End />
      </Fade>
    </Sequence>

    {/* The 05:30 mess siren opens, then the music takes over at "0400 hrs" */}
    <Sequence from={0} durationInFrames={225}>
      <Audio src={staticFile("siren.wav")} startFrom={60} volume={(f) => interpolate(f, [0, 20, 175, 225], [0, 1, 1, 0], clamp)} />
    </Sequence>
    <Sequence from={T.turn[0] - 10}>
      <Audio
        src={staticFile("americana.mp3")}
        volume={(f) => interpolate(f, [0, 40, TREK_FRAMES - T.turn[0] - 40, TREK_FRAMES - T.turn[0] + 10], [0, 0.95, 0.95, 0], { ...clamp, easing: Easing.inOut(Easing.ease) })}
      />
    </Sequence>
  </AbsoluteFill>
);
