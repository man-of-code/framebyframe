import type { JSX } from "react";
import { useLocation } from "react-router-dom";
import { SITE } from "@/content/site";
import { pageMeta } from "@/lib/meta";

export function PageMeta(): JSX.Element {
  const { pathname } = useLocation();
  const meta = pageMeta(pathname);
  // Canonical and Open Graph URLs always name production, so previews never compete with it.
  const origin = SITE.origin;
  const url = `${origin}${pathname}`;
  const image = `${origin}/og.png`;

  return (
    <>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <link rel="canonical" href={url} />
      {meta.noindex ? <meta name="robots" content="noindex" /> : null}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content="Frame by Frame, a sixteen-week short-film curriculum" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={image} />
    </>
  );
}
