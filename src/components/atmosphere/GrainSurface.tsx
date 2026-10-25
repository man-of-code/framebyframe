import type { JSX, ReactNode } from "react";
import "./atmosphere.css";

export function GrainSurface(props: {
  children: ReactNode;
  className?: string;
}): JSX.Element {
  const className = props.className ? `grain ${props.className}` : "grain";
  return <div className={className}>{props.children}</div>;
}
