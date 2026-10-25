import type { JSX } from "react";
import { SITE } from "@/content/site";

export function ContactAddress(): JSX.Element {
  return (
    <address className="contact-address">
      <span>{SITE.name}</span>
      <a className="text-link" href={`mailto:${SITE.email}`}>{SITE.email}</a>
    </address>
  );
}
