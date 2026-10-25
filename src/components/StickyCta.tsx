import type { JSX } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { Progress } from "@/lib/types";
import { resolveCurrentWeek } from "@/lib/week";

export function StickyCta({ progress }: { progress: Progress }): JSX.Element | null {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  if (pathname === "/thank-you") return null;

  const current = resolveCurrentWeek(progress, new Date());
  if (!progress.startDate) {
    return (
      <div className="sticky-cta">
        <button
          className="page-button"
          type="button"
          onClick={() => {
            const form = document.getElementById("start-date");
            if (form instanceof HTMLFormElement) {
              form.requestSubmit();
              return;
            }
            navigate("/#start-date");
          }}
        >
          Start week 1
        </button>
      </div>
    );
  }

  if (current.complete && current.source !== "override") {
    return (
      <div className="sticky-cta">
        <Link className="page-button" to="/capstone">Open the capstone</Link>
      </div>
    );
  }

  return (
    <div className="sticky-cta">
      <Link className="page-button" to={`/week/${current.week}`}>Continue week {current.week}</Link>
    </div>
  );
}
