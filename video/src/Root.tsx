import React from "react";
import { Composition } from "remotion";
import { FallIn, TOTAL_FRAMES } from "./FallIn";

export const Root: React.FC = () => (
  <Composition
    id="FallIn"
    component={FallIn}
    durationInFrames={TOTAL_FRAMES}
    fps={30}
    width={1080}
    height={1920}
  />
);
