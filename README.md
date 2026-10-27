# React + TypeScript + Vite

## Frame by Frame: build and prerender

- `npm run dev` — Vite dev server (client render only).
- `npm run build` — content validation, `tsc -b`, the client build (`dist/`), an SSR build of `src/entry-server.tsx` (`dist-ssr/`, never deployed), `scripts/prerender.ts` (writes `dist/index.html`, `dist/<route>/index.html` for every static route and `dist/404.html`, each with its own title, meta, canonical, route CSS and modulepreloads), `scripts/finalize-dist.ts` (service-worker cache name, sitemap, robots) and the JS budget gate `scripts/assert-bundle.ts`.
- `npx vite preview` serves `dist/` the way Vercel does (real file, then `<path>/index.html`, else `404.html` with status 404); see `vercelLikePreview` in `vite.config.ts`.
- `npm test` (Vitest, including a Node-environment prerender test), `npm run e2e` (dev-server smoke), `npm run e2e:preview` (hydration matrix against the built preview; run `npm run build` first).
- The page hydrates only when `#root[data-prerendered]` matches the URL, there is no query string, and it is not `/` for a learner with a stored start date; otherwise it is client-rendered. Render code must not read browser state; see `.cursor/rules/framebyframe-architecture.mdc`.


This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
