import type { JSX } from "react";
import { Link } from "react-router-dom";
import { ContactAddress } from "@/components/ContactAddress";
import { WorkingHeader } from "@/components/PageHeader";

export function Terms(): JSX.Element {
  return (
    <article className="page prose-page">
      <WorkingHeader band={false} eyebrow="Terms" title="Terms of use" />
      <p className="page-copy">Last updated 25 October 2026. This is a plain-language summary, not a document written by a lawyer.</p>
      <section className="stack">
        <h2>What this is</h2>
        <p className="page-copy">
          Frame by Frame is a free, sixteen-week course on making a short film. It is for learning. It is not legal advice and it is not a film school.
        </p>
      </section>
      <section className="stack">
        <h2>Tools and links</h2>
        <p className="page-copy">
          The tools, templates and footage libraries we link to belong to other people and keep their own licenses. Each resource card shows its cost and the date we last checked it, but things change. You are responsible for having the right to use anything you put in your film, including music, locations and performances.
        </p>
      </section>
      <section className="stack">
        <h2>No warranty</h2>
        <p className="page-copy">
          The course is offered as it is, with no guarantees. Links stop working, fees change and tools have limits. The Toolkit page lists the known limits of DaVinci Resolve’s free edition and of ArtCraft.
        </p>
      </section>
      <section className="stack">
        <h2>Contact</h2>
        <ContactAddress />
        <Link className="text-link" to="/privacy">Privacy policy</Link>
      </section>
    </article>
  );
}
