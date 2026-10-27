import type { JSX } from "react";
import { Link } from "react-router-dom";
import { ContactAddress } from "@/components/ContactAddress";
import { WorkingHeader } from "@/components/PageHeader";

export function Terms(): JSX.Element {
  return (
    <article className="page prose-page">
      <WorkingHeader band={false} eyebrow="Terms" title="Terms of use" />
      <p className="page-copy">Last updated 25 October 2026. This is a plain-language summary, not a document prepared by a lawyer.</p>
      <section className="stack">
        <h2>What this is</h2>
        <p className="page-copy">
          Frame by Frame is a free sixteen-week curriculum for making a short film. It is education. It is not legal advice, not a film school enrollment, and not LevelUp’s course. Module order and week titles are inspired by the LevelUp BFP brochure. The assignments and resources were written separately.
        </p>
      </section>
      <section className="stack">
        <h2>Tools and links</h2>
        <p className="page-copy">
          External tools, templates, and footage libraries keep their own licenses. A resource card states the cost and the date it was checked. Those checks can go stale. You are responsible for the license on anything you put in a film, including music, locations, and performances.
        </p>
      </section>
      <section className="stack">
        <h2>No warranty</h2>
        <p className="page-copy">
          The curriculum is offered as-is. Dead links, fee changes, and tool limits happen. The toolkit states the known limits of DaVinci Resolve’s free edition and of ArtCraft.
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
