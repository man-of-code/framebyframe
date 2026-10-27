import { Fragment, type JSX } from "react";
import { splitAtSlashes } from "@/lib/title";

/** Renders text with a <wbr> after every "/", so slash-joined topic lists break at the slash. */
export function BreakableTitle({ text }: { text: string }): JSX.Element {
  const parts = splitAtSlashes(text);
  return (
    <>
      {parts.map((part, index) => (
        <Fragment key={index}>
          {index > 0 ? <wbr /> : null}
          {part}
        </Fragment>
      ))}
    </>
  );
}
