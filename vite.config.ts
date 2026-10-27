import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { existsSync, readFileSync, statSync } from "node:fs";
import { join, resolve, sep } from "node:path";
import { fileURLToPath, URL } from "node:url";

/**
 * `vite preview` falls back to dist/index.html for every path (even /assets/missing.js), which would serve the
 * landing for /plan and hide whether prerendering works. This serves dist/ the way vercel.json does: a real
 * file, else <path>/index.html, else 404.html with status 404; a trailing slash 308s to the bare path.
 */
function vercelLikePreview(): Plugin {
  return {
    name: "fbf-vercel-like-preview",
    configurePreviewServer(server) {
      const dist = resolve(server.config.root, server.config.build.outDir);
      server.middlewares.use((req, res, next) => {
        const url = new URL(req.url ?? "/", "http://preview.local");
        const path = decodeURIComponent(url.pathname);
        if (path.length > 1 && path.endsWith("/")) {
          res.statusCode = 308;
          res.setHeader("Location", `${path.replace(/\/+$/, "") || "/"}${url.search}`);
          res.end();
          return;
        }
        const file = resolve(dist, `.${path}`);
        if (file !== dist && !file.startsWith(dist + sep)) return next();
        if (existsSync(file) && statSync(file).isFile()) return next();
        if (existsSync(join(file, "index.html"))) {
          req.url = `${path === "/" ? "" : path}/index.html${url.search}`;
          return next();
        }
        res.statusCode = 404;
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.end(readFileSync(join(dist, "404.html")));
      });
    },
  };
}

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), tailwindcss(), vercelLikePreview()],
  // The SSR build (scripts/prerender.ts input, dist-ssr/) is never deployed: no public/ copy, no manifest.
  publicDir: isSsrBuild ? false : "public",
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  build: {
    manifest: !isSsrBuild,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: "atmosphere",
              test: /src[\\/]vendor[\\/]threeui-derived[\\/]crt[\\/]/,
              includeDependenciesRecursively: false,
            },
          ],
        },
      },
    },
  },
}));
