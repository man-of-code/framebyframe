import { useEffect, useRef, useState, type JSX } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { useAuroraPause } from "@/hooks/useAuroraPause";
import { readCanvasEnv, shouldRenderCanvas } from "@/lib/webgl-guard";
import { SparkBadge } from "@/vendor/threeui/spark-badge/SparkBadge";
import "./ceremony.css";

/**
 * Capstone ceremony (design-system.md 6). Live on a capable desktop: SparkBadge on a #000 film-grain stage under a
 * live aurora. Static whenever any 7.2 rule 1 condition holds (phone, coarse pointer, reduced motion, Save-Data,
 * few cores or little memory): the guilloche seal on the same stage, static aurora. Both put Continue on the
 * playbill frame's --bg-raised surface, never on the aurora.
 */
function CeremonyOverlay(props: { onClose: () => void }): JSX.Element {
  const { onClose } = props;
  const [live] = useState(() => shouldRenderCanvas(readCanvasEnv()));
  const button = useRef<HTMLButtonElement>(null);
  const aurora = useRef<HTMLDivElement>(null);
  useAuroraPause(aurora);

  useEffect(() => {
    const trigger = document.activeElement;
    button.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") {
        event.preventDefault();
        button.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus();
    };
  }, [onClose]);

  return (
    <div
      className={live ? "ceremony ceremony--live" : "ceremony ceremony--static"}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ceremony-title"
      data-lenis-prevent
    >
      <div
        ref={aurora}
        className={live ? "ceremony__aurora aurora aurora--live" : "ceremony__aurora aurora"}
        aria-hidden="true"
      />
      <div className="ceremony__frame playbill-frame">
        <div className="ceremony-stage grain grain--film" aria-hidden="true">
          {live ? <SparkBadge /> : <div className="orn-seal ceremony__seal" />}
        </div>
        <p className="eyebrow orn-fleuron">Capstone · Complete</p>
        <h2 id="ceremony-title" className="ceremony__title">Capstone complete</h2>
        <Button ref={button} type="button" onClick={onClose}>
          Continue
        </Button>
      </div>
    </div>
  );
}

export function CeremonyBadge(props: { open: boolean; onClose: () => void }): JSX.Element | null {
  if (!props.open) return null;
  // Portalled to <body> so no page layout rule (such as the prose column's max-width) or stacking context clips it.
  return createPortal(<CeremonyOverlay onClose={props.onClose} />, document.body);
}
