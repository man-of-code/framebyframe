import type { JSX, ReactNode } from "react";

/** Playbill title block on a static aurora band (design-system.md 3.3, 5.4). Only primary and secondary text sit on the band. */
export function PlaybillHeader(props: {
  eyebrow: string;
  title: ReactNode;
  note?: string;
  className?: string;
  /** Wraps the block in a playbill frame on an opaque surface; children then sit inside the frame. */
  framed?: boolean;
  children?: ReactNode;
}): JSX.Element {
  const { eyebrow, title, note, className, framed = false, children } = props;
  const block = (
    <>
      <div className="title-block">
        <p className="eyebrow orn-fleuron">{eyebrow}</p>
        <h1>{title}</h1>
        <div className="orn-rule-diamond" aria-hidden="true" />
        {note ? <p className="title-note">{note}</p> : null}
      </div>
      {children}
    </>
  );
  return (
    <header className={`page-band aurora ${className ?? ""}`.trim()}>
      <div className="band-inner hud-grid">
        {framed ? <div className="playbill-frame title-frame">{block}</div> : block}
      </div>
    </header>
  );
}

/** Left-aligned working header on a static band: no fleurons (design-system.md 3.3). */
export function WorkingHeader(props: {
  eyebrow: string;
  title: string;
  note?: string;
  className?: string;
}): JSX.Element {
  const { eyebrow, title, note, className } = props;
  return (
    <header className={`page-band page-band--working aurora ${className ?? ""}`.trim()}>
      <div className="band-inner hud-grid">
        <div className="working-block">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          {note ? <p className="title-note">{note}</p> : null}
        </div>
      </div>
    </header>
  );
}
