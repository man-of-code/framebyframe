import type { JSX } from "react";
import { Link } from "react-router-dom";
import { ContactAddress } from "@/components/ContactAddress";
import { WorkingHeader } from "@/components/PageHeader";

export function Privacy(): JSX.Element {
  return (
    <article className="page prose-page">
      <WorkingHeader band={false} eyebrow="Privacy" title="Privacy policy" />
      <p className="page-copy">Last updated 25 October 2026.</p>
      <section className="stack">
        <h2>Progress stays on this device</h2>
        <p className="page-copy">
          Checked tasks, notes, the start date, the theme, and a week override are stored in this browser’s localStorage. Export writes a file you choose. Nothing in that progress record is sent to a server by this site.
        </p>
      </section>
      <section className="stack">
        <h2>Analytics</h2>
        <p className="page-copy">
          Vercel Web Analytics loads only after you accept the cookie banner. Until then it is not requested. Reject leaves it unloaded. The script, when accepted, records page views for this deployment. It is not used to sell data, and it is not required to use the curriculum.
        </p>
      </section>
      <section className="stack">
        <h2>Contact</h2>
        <p className="page-copy">
          The contact form builds a mailto link and opens your mail app. The message is not posted to Frame by Frame. The published contact is below. A street address is not published, because this project does not have one on file.
        </p>
        <ContactAddress />
        <Link className="text-link" to="/contact">Contact form</Link>
      </section>
    </article>
  );
}
