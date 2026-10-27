import type { JSX, ReactNode } from "react";

/**
 * An "intermission card" (design-system.md 3.3, 6): the guilloche seal above a centred playbill title block, then
 * copy and one primary action. The root carries the film grain on --bg-base (5.6; 0 in light, where it holds text).
 */
export function Intermission(props: { eyebrow: string; title: string; children: ReactNode }): JSX.Element {
  const { eyebrow, title, children } = props;
  return (
    <article className="intermission playbill-frame grain grain--film">
      <div className="intermission__body">
        <div className="orn-seal" aria-hidden="true" />
        <div className="title-block">
          <p className="eyebrow orn-fleuron">{eyebrow}</p>
          <h1>{title}</h1>
          <div className="orn-rule-diamond" aria-hidden="true" />
        </div>
        {children}
      </div>
    </article>
  );
}
