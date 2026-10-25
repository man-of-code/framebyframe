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
    <h1 ref={ref}>
      <span data-article-heading>{props.text}</span>
    </h1>
  );
}
