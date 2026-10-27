import type { JSX } from "react";
import { Link } from "react-router-dom";
import { Intermission } from "@/components/Intermission";
import { Button, ButtonSheen } from "@/components/ui/button";

export function NotFound(): JSX.Element {
  return (
    <Intermission eyebrow="Missing reel" title="Page not found">
      <p className="page-copy">
        That address is not one of the sixteen weeks, and it is not in the library.
      </p>
      <div className="control-row">
        <Button asChild>
          <Link to="/"><ButtonSheen />Back to today</Link>
        </Button>
        <Link className="text-link" to="/plan">Browse the plan</Link>
        <Link className="text-link" to="/contact">Contact</Link>
      </div>
    </Intermission>
  );
}
