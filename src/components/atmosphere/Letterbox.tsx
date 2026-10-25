import type { JSX, ReactNode } from "react";
import { GrainSurface } from "./GrainSurface";

export function Letterbox(props: {
  children: ReactNode;
  ratio?: "2.39" | "1.85";
}): JSX.Element {
  const ratio = props.ratio ?? "2.39";
  const frame = ratio === "1.85" ? "letterbox-185" : "letterbox-239";
  return <GrainSurface className={`letterbox ${frame}`}>{props.children}</GrainSurface>;
}
