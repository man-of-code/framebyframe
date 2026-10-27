import { ExternalLink, FlaskConical } from "lucide-react";
import type { JSX } from "react";
import { Link } from "react-router-dom";
import { WorkingHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { tools as allTools } from "@/content/tools";
import "./pages.css";

export function Toolkit(): JSX.Element {
  const tools = [...allTools].sort(
    (a, b) => a.firstWeek - b.firstWeek || a.name.localeCompare(b.name),
  );

  return (
    <article className="page">
      <WorkingHeader
        eyebrow="Toolkit"
        title="Free software"
        note="What each tool does, what it costs, where to download it, and the first week you need it."
      />
      <div className="table-wrap" data-lenis-prevent>
        <table className="tool-table">
          <caption className="visually-hidden">Free software for the course</caption>
          <thead>
            <tr>
              <th scope="col">Tool</th>
              <th scope="col">Purpose</th>
              <th scope="col">Cost</th>
              <th scope="col">Download</th>
              <th scope="col">First week</th>
              <th scope="col">Notes</th>
            </tr>
          </thead>
          <tbody>
            {tools.map((tool) => (
              <tr key={tool.id}>
                <td data-label="Tool">{tool.name}</td>
                <td data-label="Purpose">{tool.purpose}</td>
                <td data-label="Cost">{tool.license}</td>
                <td data-label="Download">
                  <a href={tool.url} target="_blank" rel="noopener noreferrer">
                    Download
                    <ExternalLink aria-hidden="true" size={16} />
                    <span className="visually-hidden"> (opens in a new tab)</span>
                  </a>
                </td>
                <td data-label="First week" className="mono-cell">
                  <Link to={`/week/${tool.firstWeek}`}>Week {tool.firstWeek}</Link>
                </td>
                <td data-label="Notes">
                  {tool.experimental ? (
                    <Badge variant="exp">
                      <FlaskConical aria-hidden="true" />
                      Experimental
                    </Badge>
                  ) : null}
                  {tool.limitations && tool.limitations.length > 0 ? (
                    <ul className="plain-list">
                      {tool.limitations.map((note) => (
                        <li key={note}>{note}</li>
                      ))}
                    </ul>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}
