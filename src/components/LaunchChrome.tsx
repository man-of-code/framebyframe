import type { JSX } from "react";
import { ConsentAnalytics, CookieBanner, useConsent } from "@/components/CookieBanner";
import { SmoothScroll } from "@/components/SmoothScroll";
import { StickyCta } from "@/components/StickyCta";
import type { Progress } from "@/lib/types";

export function LaunchChrome({ progress }: { progress: Progress }): JSX.Element {
  const [consent, chooseConsent] = useConsent();
  return (
    <>
      <SmoothScroll />
      <StickyCta progress={progress} />
      <CookieBanner consent={consent} onChoose={chooseConsent} />
      <ConsentAnalytics consent={consent} />
    </>
  );
}
