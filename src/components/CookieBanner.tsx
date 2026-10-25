import { useEffect, useState, type ComponentType, type JSX } from "react";
import { Link } from "react-router-dom";

const KEY = "fbf:consent";

export type Consent = "unknown" | "accepted" | "rejected";

function readConsent(): Consent {
  try {
    const stored = localStorage.getItem(KEY);
    if (stored === "accepted" || stored === "rejected") return stored;
  } catch {
    /* private mode */
  }
  return "unknown";
}

export function useConsent(): [Consent, (next: Exclude<Consent, "unknown">) => void] {
  const [consent, setConsent] = useState<Consent>(readConsent);

  function choose(next: Exclude<Consent, "unknown">) {
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* the choice still applies for this view */
    }
    setConsent(next);
  }

  return [consent, choose];
}

export function ConsentAnalytics({ consent }: { consent: Consent }): JSX.Element | null {
  const [View, setView] = useState<ComponentType | null>(null);

  useEffect(() => {
    if (consent !== "accepted") return undefined;
    let live = true;
    void import("@vercel/analytics/react").then((mod) => {
      if (live) setView(() => mod.Analytics);
    });
    return () => {
      live = false;
    };
  }, [consent]);

  if (!View) return null;
  return <View />;
}

export function CookieBanner({
  consent,
  onChoose,
}: {
  consent: Consent;
  onChoose: (next: Exclude<Consent, "unknown">) => void;
}): JSX.Element | null {
  if (consent !== "unknown") return null;

  return (
    <aside className="cookie-banner" aria-label="Cookie consent">
      <p>
        Analytics stay off until you accept. Progress on this site stays in this browser either way.{" "}
        <Link to="/privacy">Privacy</Link>
      </p>
      <div className="cookie-actions">
        <button className="page-button" type="button" onClick={() => onChoose("accepted")}>
          Accept
        </button>
        <button className="page-button page-button-quiet" type="button" onClick={() => onChoose("rejected")}>
          Reject
        </button>
      </div>
    </aside>
  );
}
