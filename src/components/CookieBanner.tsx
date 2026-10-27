import { useEffect, useState, useSyncExternalStore, type ComponentType, type JSX } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

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

// Shared by the banner (Root) and the analytics loader (the deferred chrome). `chosen` keeps this view's choice
// when storage refuses it.
let chosen: Consent | null = null;
const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function snapshot(): Consent {
  return chosen ?? readConsent();
}

function choose(next: Exclude<Consent, "unknown">) {
  try {
    localStorage.setItem(KEY, next);
  } catch {
    /* the choice still applies for this view */
  }
  chosen = next;
  for (const listener of listeners) listener();
}

/**
 * The prerender and the hydration render see "unknown", so the banner ships in the HTML; the pre-paint script in
 * index.html hides it (html.has-consent) when a choice is stored. Storage is read once hydrated, or on the first
 * render of a plain client render.
 */
export function useConsent(): [Consent, (next: Exclude<Consent, "unknown">) => void] {
  const consent = useSyncExternalStore(subscribe, snapshot, () => "unknown" as const);
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
    <aside className="cookie-banner pop-outline" aria-label="Cookie consent">
      <p>
        Analytics stay off until you accept. Progress on this site stays in this browser either way.{" "}
        <Link to="/privacy">Privacy</Link>
      </p>
      <div className="cookie-actions">
        <Button variant="outline" type="button" onClick={() => onChoose("accepted")}>
          Accept
        </Button>
        <Button variant="outline" type="button" onClick={() => onChoose("rejected")}>
          Reject
        </Button>
      </div>
    </aside>
  );
}
