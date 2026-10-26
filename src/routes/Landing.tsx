import type { FormEvent, JSX } from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DecodeHeading } from "@/components/atmosphere/DecodeHeading";
import { HeroCanvas } from "@/components/atmosphere/HeroCanvas";
import { Letterbox } from "@/components/atmosphere/Letterbox";
import "@/components/filmstrip/filmstrip.css";
import { gaps } from "@/content/gaps";
import { weeks as allWeeks } from "@/content/weeks";
import type { ProgressApi } from "@/hooks/ProgressProvider";
import { startDateError } from "@/lib/form";
import { LumenCta } from "@/vendor/threeui/lumen-cta/LumenCta";
import "./pages.css";

const MODULES = [
  { n: 1, title: "Writing" },
  { n: 2, title: "Pre-production" },
  { n: 3, title: "Directing" },
  { n: 4, title: "Cinematography" },
  { n: 5, title: "Editing and Sound" },
  { n: 6, title: "Post-production and VFX" },
  { n: 7, title: "Marketing, Distribution and Career" },
] as const;

function useDocumentLight(): boolean {
  const [light, setLight] = useState(() => document.documentElement.classList.contains("light"));
  useEffect(() => {
    const node = document.documentElement;
    const sync = () => setLight(node.classList.contains("light"));
    const observer = new MutationObserver(sync);
    observer.observe(node, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  return light;
}

function localToday(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function weekSpan(module: number): { first: number; label: string } | null {
  const weeks = allWeeks.filter((week) => week.module === module).map((week) => week.n);
  if (weeks.length === 0) return null;
  const first = Math.min(...weeks);
  const last = Math.max(...weeks);
  const start = String(first).padStart(2, "0");
  const end = String(last).padStart(2, "0");
  return { first, label: start === end ? `WK ${start}` : `WK ${start}–${end}` };
}

export function Landing(props: { api: ProgressApi; replay: boolean }): JSX.Element {
  const { api, replay } = props;
  const navigate = useNavigate();
  const light = useDocumentLight();
  const [date, setDate] = useState(api.progress.startDate ?? localToday());
  const [dateError, setDateError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const gap = gaps.find((item) => item.id === "indian-language-craft");
  const buffer = weekSpan(0);

  function start(event?: FormEvent) {
    event?.preventDefault();
    const message = startDateError(date);
    setDateError(message);
    if (message) return;
    setPending(true);
    api.setStartDate(date);
    navigate("/week/1");
  }

  return (
    <article className="page">
      <header className="hero">
        <Letterbox>
          <HeroCanvas enabled={!replay} />
          <div className="hero-copy">
            <p className="eyebrow">16 weeks</p>
            <DecodeHeading text="Frame by Frame" />
            <div className="control-row">
              <LumenCta
                className="hero-lumen"
                label="Start week 1"
                type="button"
                mode={light ? "light" : "dark"}
                hue={-48}
                saturation={0.85}
                onClick={() => {
                  const form = document.getElementById("start-date");
                  if (form instanceof HTMLFormElement) form.requestSubmit();
                }}
              />
              <Link className="text-link" to="/plan">Browse the plan first</Link>
            </div>
            <p className="page-copy">
              A sixteen-week path to a short film, shot on an Android phone, with free tools.
            </p>
            {replay ? <Link className="text-link" to="/">Back to today</Link> : null}
          </div>
        </Letterbox>
      </header>

      <section className="stack" aria-labelledby="shape-heading">
        <h2 id="shape-heading">The 16-week shape</h2>
        <nav className="filmstrip-nav" aria-label="Modules">
          <ol className="filmstrip" data-orientation="horizontal">
            {MODULES.map((module) => {
              const span = weekSpan(module.n);
              if (!span) return null;
              return (
                <li key={module.n}>
                  <Link className="module-block" to={`/week/${span.first}`}>
                    <span className="eyebrow">Module {String(module.n).padStart(2, "0")}</span>
                    <span>{module.title}</span>
                    <span className="mono">{span.label}</span>
                  </Link>
                </li>
              );
            })}
            {buffer ? (
              <li>
                <Link className="module-block" to={`/week/${buffer.first}`}>
                  <span className="eyebrow">Buffer</span>
                  <span>Weeks 13–16</span>
                  <span className="mono">{buffer.label}</span>
                </Link>
              </li>
            ) : null}
          </ol>
        </nav>
      </section>

      <section className="stack" aria-labelledby="make-heading">
        <h2 id="make-heading">What you'll make</h2>
        <p className="page-copy">
          A 3–5 minute thriller or science-fiction short. One location, two actors at most, an Android phone, and the free edition of DaVinci Resolve.
        </p>
      </section>

      <section className="stack" aria-labelledby="cost-heading">
        <h2 id="cost-heading">What this costs</h2>
        <p className="page-copy">₹0 for the curriculum and the free-path tools.</p>
        <ul className="plain-list">
          <li>Script registration is extra.</li>
          <li>Festival fees are extra.</li>
          <li>An optional clip-on lens is extra.</li>
        </ul>
      </section>

      <section className="stack" aria-labelledby="missing-heading">
        <h2 id="missing-heading">What's missing</h2>
        <p className="page-copy">
          {gap?.missing ?? "No verified Indian-language filmmaking-craft channels."}
        </p>
        <Link className="text-link" to="/about">Read the gap</Link>
      </section>

      <form id="start-date" className="stack" onSubmit={start} noValidate>
        <h2>Start date</h2>
        <label className="field">
          Start date
          <input
            type="date"
            value={date}
            aria-invalid={dateError ? true : undefined}
            aria-describedby={dateError ? "start-date-error" : undefined}
            onChange={(event) => {
              setDate(event.target.value);
              setDateError(startDateError(event.target.value));
            }}
          />
          {dateError ? <span className="field-error" id="start-date-error" role="alert">{dateError}</span> : null}
        </label>
        <button className="page-button" type="submit" disabled={pending} aria-busy={pending}>
          {pending ? "Saving…" : "Set start date"}
        </button>
      </form>
    </article>
  );
}
