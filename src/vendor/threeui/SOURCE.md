# Vendored from MengTo/threeui

- Upstream: https://github.com/MengTo/threeui
- Commit: `68802d5428071ada5c20db8094b1649e6bb770ed`
- Date copied: 2026-10-25
- License: MIT (`LICENSE` in this directory)

These files are unmodified and must not be edited — restyle through props and tokens only.

`SparkBadge` loads `/spark-badge.html`. That document is the unmodified upstream file `src/shaders/spark-badge/spark-badge.html` from the same commit, placed at `public/spark-badge.html` so the component's default URL resolves. It is a self-contained canvas 2D page. It does not import `three`.

## Lifted techniques

These are not vendored: only the maths or the CSS technique was re-expressed in our own files, which follow our tokens and may be edited (design-system.md 7.1 rows 5–6, 7.2 rule 3). Nothing below is a copy in this directory. Each file carries an MIT attribution comment naming the same commit, `68802d5428071ada5c20db8094b1649e6bb770ed`.

| Piece | Upstream path | Local files |
|---|---|---|
| Guilloché seal (row 5) | `src/shaders/neuform-isolated/sources/kinetic-lathe-certificate.html`: `rosette()` and its parameters in `drawRosettes()` | `scripts/gen-guilloche-seal.ts` (dev-only generator) → `src/assets/ornaments/guilloche-seal.svg`; `.orn-seal` in `src/styles/ornaments.css`. Used on 404, `/thank-you` and the static capstone ceremony |
| Ceremony badge document | `src/shaders/spark-badge/spark-badge.html` (same file as `public/spark-badge.html`) | `public/ceremony-badge.html`: a copy whose canvas wordmark reads "Fin" (the film end card) instead of the upstream product name "Codex", with stroke glyphs F, i, n added to `GLYPH_WIDTHS`/`glyph()` in the upstream style. `CeremonyBadge` passes it as `SparkBadge`'s `sourceUrl`; `SparkBadge.tsx` itself is unmodified. `public/spark-badge.html` stays as the unmodified reference |
| Sheen (row 6) | `src/shaders/rectangle-buttons/RectangleButtons.tsx`: `.threeui-page-button--trochil::before` and `:hover::before` | `src/styles/sheen.css`; the `.sheen` span (`ButtonSheen`) in `src/components/ui/button.tsx`. Only the sweep is taken |
