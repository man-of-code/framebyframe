import type { JSX } from "react";
import { Link } from "react-router-dom";
import { DecodeHeading } from "@/components/atmosphere/DecodeHeading";
import { ContactAddress } from "@/components/ContactAddress";
import { PlaybillHeader } from "@/components/PageHeader";
import { ExportImport } from "@/components/ExportImport";
import { GapCard } from "@/components/resource/GapCard";
import { gaps as allGaps } from "@/content/gaps";
import { WithProgress } from "@/hooks/ProgressProvider";
import "./pages.css";

const LICENSING = [
  "Free to watch does not mean free to use. Music, sound effects, footage and templates each come with their own rules. Check the license on every one before it goes into your film.",
  "The BBC Sound Effects Archive is for non-commercial use only. Do not use it if you plan to earn money from your film.",
  "For color presets, start with the free CGChannel/Q-DDL pack. For any other pack, check the maker's license before you share your film.",
  "DaVinci Resolve's free edition cannot decode some phone video formats quickly, and it leaves out a few effects. The Toolkit page lists what to expect.",
  "ArtCraft is a very early, experimental tool and is not dependable. GIMP, Krita and Inkscape are the reliable choices for posters and titles.",
  "The release forms we link to are generic templates and are not legal advice. Have your actors and location owners sign one before you shoot.",
  "Fees change. Always check the current price at the registration or festival site before you pay or apply.",
];

export function About(): JSX.Element {
  const gaps = allGaps.filter((gap) => gap.scope !== "week");

  return (
    <article className="page prose-centered ruled-sections">
      <PlaybillHeader
        eyebrow="About"
        title="About Frame by Frame"
        heading={<DecodeHeading text="About Frame by Frame" />}
      />

      <section className="stack" aria-labelledby="what-heading">
        <h2 id="what-heading">What this is</h2>
        <p className="page-copy">
          Frame by Frame is a free, sixteen-week path to making your first short film on an Android phone, using only free tools. Each week tells you what to watch, what to read and what to make, and the library collects free videos, articles and tools to help.
        </p>
        <p className="page-copy">
          Every resource shows what it costs and when we last checked it. Where we could not find something good, we say so below rather than guess.
        </p>
      </section>

      <section className="stack" aria-labelledby="legal-heading">
        <h2 id="legal-heading">Before you use anything in your film</h2>
        <ul className="plain-list">
          {LICENSING.map((note) => (
            <li key={note}>{note}</li>
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
