import type { JSX } from "react";
import { Link } from "react-router-dom";
import { ContactAddress } from "@/components/ContactAddress";

export function ThankYou(): JSX.Element {
  return (
    <article className="page prose-page">
      <p className="eyebrow">Sent to your mail app</p>
      <h1>Thank you</h1>
      <p className="page-copy">
        If a mail app opened, the note is waiting there for you to send. Frame by Frame did not receive a copy, and it did not store one.
      </p>
      <ContactAddress />
      <div className="control-row">
        <Link className="page-button" to="/">Back to today</Link>
        <Link className="text-link" to="/contact">Write another note</Link>
      </div>
    </article>
  );
}
