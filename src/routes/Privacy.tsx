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
          Your checked tasks, notes, start date, light or dark choice and any week you have switched to are saved in this web browser, on your own device. You can save a copy as a file. This site does not send any of it anywhere.
        </p>
      </section>
      <section className="stack">
        <h2>Analytics</h2>
        <p className="page-copy">
          If you accept the cookie banner, we use Vercel Web Analytics to count visits to the site. Until you accept, it does not run, and if you reject it, it never runs. We do not sell your data, and you do not need analytics to use the course.
        </p>
      </section>
      <section className="stack">
        <h2>Contact</h2>
        <p className="page-copy">
          The contact form opens your email app with your message ready to send. Nothing is sent to us until you press send there. Our email address is below. We do not publish a street address.
        </p>
        <ContactAddress />
        <Link className="text-link" to="/contact">Contact form</Link>
      </section>
    </article>
  );
}
