import type { JSX } from "react";
import { ConsentAnalytics, useConsent } from "@/components/CookieBanner";
import { SmoothScroll } from "@/components/SmoothScroll";
import { StickyCta } from "@/components/StickyCta";
import { Toaster } from "@/components/ui/sonner";
import type { Progress } from "@/lib/types";

export function LaunchChrome({ progress }: { progress: Progress }): JSX.Element {
  // The banner itself is prerendered in Root; analytics load only after an explicit accept.
  const [consent] = useConsent();
  return (
    <>
      <SmoothScroll />
      <StickyCta progress={progress} />
      <ConsentAnalytics consent={consent} />
      <Toaster position="top-center" />
    </>
  );
}
