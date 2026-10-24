// @ts-check
import { defineConfig } from 'astro/config';

// SITE_URL and BASE_PATH come from the hosting setup (e.g. GitHub Pages under /toyverse-web/).
// Without them the site builds for the root of any domain.
export default defineConfig({
  site: process.env.SITE_URL || 'https://example.invalid',
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'always',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
});
