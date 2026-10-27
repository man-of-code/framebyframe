import type { JSX } from "react";
import { Link } from "react-router-dom";
import { Button, ButtonSheen } from "@/components/ui/button";
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
        <Button asChild>
          <Link to="/"><ButtonSheen />Back to today</Link>
        </Button>
        <Link className="text-link" to="/contact">Write another note</Link>
      </div>
    </article>
  );
}
