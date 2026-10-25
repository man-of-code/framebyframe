import { useEffect, useRef, type JSX } from "react";
import { SparkBadge } from "@/vendor/threeui/spark-badge/SparkBadge";
import { GrainSurface } from "./GrainSurface";

function reducedMotion(): boolean {
  return typeof window.matchMedia === "function"
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function CeremonyBadge(props: { open: boolean; onClose: () => void }): JSX.Element | null {
  const { open, onClose } = props;
  const button = useRef<HTMLButtonElement>(null);
  const show = open && !reducedMotion();

  useEffect(() => {
    if (!show) return undefined;
    button.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") {
        event.preventDefault();
        button.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="ceremony" role="dialog" aria-modal="true" aria-label="Capstone complete">
      <GrainSurface className="ceremony-stage">
        <SparkBadge />
      </GrainSurface>
      <button ref={button} className="page-button ceremony-dismiss" type="button" onClick={onClose}>
        Continue
      </button>
    </div>
  );
}
