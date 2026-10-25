import type { JSX } from "react";
import { Link } from "react-router-dom";
import { DecodeHeading } from "@/components/atmosphere/DecodeHeading";
import { ContactAddress } from "@/components/ContactAddress";
import { ExportImport } from "@/components/ExportImport";
import { GapCard } from "@/components/resource/GapCard";
import { content } from "@/content";
import { WithProgress } from "@/hooks/ProgressProvider";
import "./pages.css";

const LEGAL = [
  "Module order and week titles follow the LevelUp BFP brochure. Topic wording, assignments, and resources were written fresh. Credit the brochure as inspiration. LevelUp's own terms were not retrieved — the brochure page is JavaScript-rendered and screenshots were the source — and have to be checked before a public launch.",
  "Link only to scripts the writer or the studio published. Script Slug, IMSDb, and similar gray-area reposts stay off the core path.",
  "Every music and sound library carries its license caveat on the resource card. The BBC Sound Effects Archive is non-commercial, and it is not usable if the film is monetized.",
  "Lead with the CC BY 4.0 CGChannel/Q-DDL LUT pack. Any other pack needs a check of the vendor's license before redistribution.",
  "DaVinci Resolve's free edition lacks hardware-accelerated HEVC decode and several ResolveFX. The toolkit states that limit on the Resolve row.",
  "ArtCraft is experimental, early-alpha, AI-generated software. It is not a dependable production tool. GIMP, Krita, and Inkscape are the reliable default.",
  "Release templates are generic. They are not legal advice. Actors and locations sign a release before the shoot. Two of the three verified free templates are email-gated.",
  "WGA East script registration is $25 for 10 years. The Indian SWA route is about ₹7,500 for membership, plus a per-title fee that is still unconfirmed. Leave that fee unconfirmed until a direct check at swaindia.org.",
  "Paid items are benchmarks only. TakeTen's grant has to be re-checked for a live 2026 cycle before this site tells anyone to apply now.",
];

const OPEN_ITEMS = [
  "LevelUp's own terms of use for the brochure credit",
  "Current India copyright and SWA registration fees",
  "Mixkit and YouTube Audio Library license text",
  "getartcraft.com's actual license",
  "Whether TakeTen has an open 2026 cycle",
];

export function About(): JSX.Element {
  const gaps = content.gaps.filter((gap) => gap.scope !== "week");

  return (
    <article className="page prose-page">
      <header className="stack">
        <p className="eyebrow">About</p>
        <DecodeHeading text="How this was made" />
      </header>

      <section className="stack" aria-labelledby="method-heading">
        <h2 id="method-heading">Method</h2>
        <p className="page-copy">
          Resources were gathered in research passes, deduped, and dropped from the core path when they could not be verified. A missing resource stays visible as a gap. Nothing here was filled in to make a section look complete.
        </p>
      </section>

      <section className="stack" aria-labelledby="trust-heading">
        <h2 id="trust-heading">Trust</h2>
        <p className="page-copy">
          Verified means the page was fetched, or only seen in search results. Seen is the weaker of the two: the result was visible, and the page was not opened. A seen source is a lead, not a page this project read.
        </p>
      </section>

      <section className="stack" aria-labelledby="credit-heading">
        <h2 id="credit-heading">LevelUp brochure</h2>
        <p className="page-copy">
          Module order and week titles are inspired by the LevelUp BFP brochure. The topic wording, assignments, and resources on this site were written separately. This is not LevelUp's course, and it does not include their paid lessons.
        </p>
      </section>

      <section className="stack" aria-labelledby="legal-heading">
        <h2 id="legal-heading">Legal and licensing</h2>
        <ul className="plain-list">
          {LEGAL.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </section>

      <section className="stack" aria-labelledby="open-heading">
        <h2 id="open-heading">Open items</h2>
        <p className="page-copy">These still need a direct human check before a public launch.</p>
        <ul className="plain-list">
          {OPEN_ITEMS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="stack" aria-labelledby="gaps-heading">
        <h2 id="gaps-heading">Help wanted</h2>
        {gaps.map((gap) => (
          <GapCard key={gap.id} gap={gap} />
        ))}
      </section>

      <section className="stack" aria-labelledby="progress-file-heading">
        <h2 id="progress-file-heading">Progress file</h2>
        <WithProgress>
          {(api) => <ExportImport progress={api.progress} replace={api.replace} />}
        </WithProgress>
      </section>

      <section className="stack" aria-labelledby="contact-heading">
        <h2 id="contact-heading">Contact</h2>
        <ContactAddress />
        <div className="control-row">
          <Link className="text-link" to="/contact">Write a note</Link>
          <Link className="text-link" to="/privacy">Privacy</Link>
          <Link className="text-link" to="/terms">Terms</Link>
        </div>
      </section>

      <Link className="text-link" to="/?intro=1">See the intro again</Link>
    </article>
  );
}
