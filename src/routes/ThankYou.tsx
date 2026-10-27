import type { JSX } from "react";
import { Link } from "react-router-dom";
import { ContactAddress } from "@/components/ContactAddress";
import { Intermission } from "@/components/Intermission";
import { Button, ButtonSheen } from "@/components/ui/button";

export function ThankYou(): JSX.Element {
  return (
    <Intermission eyebrow="Thank you" title="Your note is ready to send">
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
    </Intermission>
  );
}
