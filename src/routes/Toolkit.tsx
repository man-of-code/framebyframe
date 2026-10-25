import { ExternalLink, TriangleAlert } from "lucide-react";
import type { JSX } from "react";
import { Link } from "react-router-dom";
import { content } from "@/content";
import "./pages.css";

export function Toolkit(): JSX.Element {
  const tools = [...content.tools].sort(
    (a, b) => a.firstWeek - b.firstWeek || a.name.localeCompare(b.name),
  );

  return (
    <article className="page">
      <header className="stack">
        <p className="eyebrow">Toolkit</p>
        <h1>Free software</h1>
        <p className="page-copy">
          Purpose, license, the official download, and the first week you need it.
        </p>
      </header>
      <div className="table-wrap">
        <table className="tool-table">
          <caption className="visually-hidden">Free software for the curriculum</caption>
          <thead>
            <tr>
              <th scope="col">Tool</th>
              <th scope="col">Purpose</th>
              <th scope="col">License</th>
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
                <td data-label="License">{tool.license}</td>
                <td data-label="Download">
                  <a href={tool.url} target="_blank" rel="noopener noreferrer">
                    Download
                    <ExternalLink aria-hidden="true" size={16} />
                    <span className="visually-hidden"> (opens in a new tab)</span>
                  </a>
                </td>
                <td data-label="First week">
                  <Link to={`/week/${tool.firstWeek}`}>Week {tool.firstWeek}</Link>
                </td>
                <td data-label="Notes">
                  {tool.experimental ? (
                    <p className="flag-chip">
                      <TriangleAlert aria-hidden="true" size={16} />
                      Experimental
                    </p>
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
