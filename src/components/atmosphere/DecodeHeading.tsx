import { useEffect, useRef, type JSX } from "react";
import { startArticleHeadingDecode } from "@/vendor/threeui/article-headings/articleHeadingDecode";

const DECODE = {
  duration: 1400,
  stagger: 0,
  scrambleLength: 3,
  preserveChance: 0.08,
  tailChance: 0.45,
};

export function DecodeHeading(props: { text: string }): JSX.Element {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof window.matchMedia !== "function") return undefined;
    return startArticleHeadingDecode(node, DECODE);
  }, []);

  return (
    // One accessible name (aria-label). The invisible sizer holds the final string so the box never changes
    // size while the live copy decodes; both children are aria-hidden.
    <h1 ref={ref} className="decode-heading" aria-label={props.text}>
      <span className="decode-heading__sizer" aria-hidden="true">
        {props.text}
      </span>
      <span className="decode-heading__live" aria-hidden="true" data-article-heading>
        {props.text}
      </span>
    </h1>
  );
}
