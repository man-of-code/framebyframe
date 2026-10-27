# Vendored from MengTo/threeui

- Upstream: https://github.com/MengTo/threeui
- Commit: `68802d5428071ada5c20db8094b1649e6bb770ed`
- Date copied: 2026-10-25
- License: MIT (`LICENSE` in this directory)

These files are unmodified and must not be edited — restyle through props and tokens only.

`SparkBadge`'s default `sourceUrl` is `/spark-badge.html`, the upstream document `src/shaders/spark-badge/spark-badge.html` from the same commit. It is **not shipped**: it draws the upstream product name "Codex", so the app always passes `sourceUrl="/ceremony-badge.html"` (a recorded derivative, below). `public/spark-badge.html` was removed on 2026-10-27; fetch it from the upstream SHA to diff against the derivative.

## Lifted techniques

These are not vendored: only the maths or the CSS technique was re-expressed in our own files, which follow our tokens and may be edited (design-system.md 7.1 rows 5–6, 7.2 rule 3). Nothing below is a copy in this directory. Each file carries an MIT attribution comment naming the same commit, `68802d5428071ada5c20db8094b1649e6bb770ed`.

| Piece | Upstream path | Local files |
|---|---|---|
| Guilloché seal (row 5) | `src/shaders/neuform-isolated/sources/kinetic-lathe-certificate.html`: `rosette()` and its parameters in `drawRosettes()` | `scripts/gen-guilloche-seal.ts` (dev-only generator) → `src/assets/ornaments/guilloche-seal.svg`; `.orn-seal` in `src/styles/ornaments.css`. Used on 404, `/thank-you` and the static capstone ceremony |
| Ceremony badge document | `src/shaders/spark-badge/spark-badge.html` (upstream file; not shipped) | `public/ceremony-badge.html`: a copy whose canvas wordmark reads "Fin" (the film end card) instead of the upstream product name "Codex", with stroke glyphs F, i, n added to `GLYPH_WIDTHS`/`glyph()` in the upstream style. `CeremonyBadge` passes it as `SparkBadge`'s `sourceUrl`; `SparkBadge.tsx` itself is unmodified. `public/spark-badge.html` stays as the unmodified reference |
| CRT background (row 1), derived copy | `src/shaders/crt/{CrtBackground.tsx, crtRenderer.ts, crtScreens.ts, crtShaders.ts}` | Moved from `src/vendor/threeui/crt/` to `src/vendor/threeui-derived/crt/` (R4.1, `git mv`, so `git log --follow` shows the change). Only `crtScreens.ts` differs from upstream: the cinematic corner label "MONO · ACADEMY" now reads "FRAME BY FRAME" and the title card "T H E   L O N G   Q U I E T" reads "Y O U R   F I R S T   F I L M". Each file has an MIT header naming the upstream path and commit. `HeroCanvas` lazy-imports it; the vite `atmosphere` chunk group matches the new path |
| Sheen (row 6) | `src/shaders/rectangle-buttons/RectangleButtons.tsx`: `.threeui-page-button--trochil::before` and `:hover::before` | `src/styles/sheen.css`; the `.sheen` span (`ButtonSheen`) in `src/components/ui/button.tsx`. Only the sweep is taken |
