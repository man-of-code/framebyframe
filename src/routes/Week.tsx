import { useParams } from "react-router-dom";

export function Week() {
  const { n } = useParams();
  return (
    <article>
      <p className="eyebrow">Week</p>
      <h1>Week {n}</h1>
    </article>
  );
}
