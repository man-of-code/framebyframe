import {
  Component,
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type JSX,
  type ReactNode,
} from "react";
import { useFpsGuard } from "@/hooks/useFpsGuard";
import {
  acquireWebglSlot,
  releaseWebglSlot,
  shouldRenderCanvas,
  type CanvasEnv,
} from "@/lib/webgl-guard";

const SLOT = "hero";

const CrtBackground = lazy(() =>
  import("@/vendor/threeui/crt/CrtBackground").then((mod) => ({ default: mod.CrtBackground })),
);

function readEnv(): CanvasEnv {
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  return {
    reducedMotion: typeof window.matchMedia === "function"
      && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    width: window.innerWidth,
    cores: typeof navigator.hardwareConcurrency === "number" ? navigator.hardwareConcurrency : undefined,
    memory: typeof nav.deviceMemory === "number" ? nav.deviceMemory : undefined,
    saveData: nav.connection?.saveData,
  };
}

function webglAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl");
    if (!gl) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

class CanvasBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError(): { failed: boolean } {
    return { failed: true };
  }

  componentDidCatch(): void {
    this.props.onError();
  }

  render(): ReactNode {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

function CrtMount(props: { onLost: () => void }): JSX.Element {
  const host = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const { onLost } = props;

  // Layout runs before the child effect that throws "CRT requires WebGL".
  useLayoutEffect(() => {
    const onError = (event: ErrorEvent) => {
      const message = event.error instanceof Error ? event.error.message : event.message;
      if (!message.includes("CRT")) return;
      event.preventDefault();
      onLost();
    };
    window.addEventListener("error", onError);
    return () => window.removeEventListener("error", onError);
  }, [onLost]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const canvas = host.current?.querySelector("canvas");
    if (!(canvas instanceof HTMLCanvasElement)) return undefined;
    canvas.setAttribute("aria-hidden", "true");
    const onContextLost = (event: Event) => {
      event.preventDefault();
      onLost();
    };
    canvas.addEventListener("webglcontextlost", onContextLost);
    return () => canvas.removeEventListener("webglcontextlost", onContextLost);
  }, [onLost]);

  return (
    <div ref={host} className={shown ? "hero-canvas is-in" : "hero-canvas"} aria-hidden="true">
      <CrtBackground variant="cinematic" />
    </div>
  );
}

export function HeroCanvas(props: { enabled: boolean }): JSX.Element {
  const { enabled } = props;
  const [armed, setArmed] = useState(false);
  const [lost, setLost] = useState(false);
  const drop = useCallback(() => setLost(true), []);
  const fpsOk = useFpsGuard(armed && !lost);
  const show = enabled && armed && !lost && fpsOk;

  useEffect(() => {
    if (!enabled) {
      setArmed(false);
      return undefined;
    }
    if (!shouldRenderCanvas(readEnv()) || !webglAvailable()) return undefined;
    if (!acquireWebglSlot(SLOT)) return undefined;
    setArmed(true);
    return () => {
      releaseWebglSlot(SLOT);
    };
  }, [enabled]);

  useEffect(() => {
    if (fpsOk && !lost) return;
    releaseWebglSlot(SLOT);
  }, [fpsOk, lost]);

  return (
    <>
      <img
        className="hero-poster"
        src="/posters/hero-crt.webp"
        alt="Still of a green phosphor terminal, the poster behind the landing title."
        aria-hidden="true"
      />
      {show ? (
        <CanvasBoundary onError={drop}>
          <Suspense fallback={null}>
            <CrtMount onLost={drop} />
          </Suspense>
        </CanvasBoundary>
      ) : null}
    </>
  );
}
