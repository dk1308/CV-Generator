// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Static site generation — each route becomes a static HTML file under dist/
  // Paged.js runs in-browser (dev) or via pagedjs-cli over dist/ (prod PDF)
  output: 'static',
  trailingSlash: 'always',
  build: {
    // Emit clean URLs: /cv/ → /cv/index.html (required for pagedjs-cli to resolve)
    format: 'directory',
  },
});
