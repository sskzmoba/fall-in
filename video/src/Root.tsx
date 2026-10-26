import React from "react";
import { Composition } from "remotion";
import { FallIn, TOTAL_FRAMES } from "./FallIn";
import { RouteTeaser, ROUTE_FRAMES } from "./RouteTeaser";
import { TrekFilm, TREK_FRAMES } from "./TrekFilm";

export const Root: React.FC = () => (
  <>
    <Composition
      id="FallIn"
      component={FallIn}
      durationInFrames={TOTAL_FRAMES}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="RouteTeaser"
      component={RouteTeaser}
      durationInFrames={ROUTE_FRAMES}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="TrekFilm"
      component={TrekFilm}
      durationInFrames={TREK_FRAMES}
      fps={30}
      width={1080}
      height={1920}
    />
  </>
);
