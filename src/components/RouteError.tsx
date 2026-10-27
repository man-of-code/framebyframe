import type { JSX } from "react";
import { Intermission } from "@/components/Intermission";

/**
 * Route error element (R4.1): shown inside the shell when a route throws, most often a lazy chunk that no longer
 * exists after a deploy. It lives in the entry graph, so it uses the pop classes directly rather than `Button`.
 */
export function RouteError(): JSX.Element {
  return (
    <Intermission eyebrow="Reel jammed" title="This page did not load">
      <p className="page-copy">
        The site may have been updated since this tab opened, or the connection dropped. Reloading fetches the current version. Your progress is stored in this browser and is not affected.
      </p>
      <div className="control-row">
        <button
          type="button"
          data-slot="button"
          data-variant="default"
          className="pop pop--teal inline-flex min-h-12 items-center justify-center gap-2 px-5 text-sm font-semibold"
          onClick={() => window.location.reload()}
        >
          <span className="sheen" aria-hidden="true" />
          Reload
        </button>
      </div>
    </Intermission>
  );
}
