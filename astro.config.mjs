// @ts-check
import { defineConfig } from 'astro/config';

// Fully static site. Vercel serves the files in dist/ as-is.
export default defineConfig({
  site: 'https://boardgameweek.vercel.app',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
});
