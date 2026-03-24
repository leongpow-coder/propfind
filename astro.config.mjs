// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Import page registry for lastmod dates
import { pages } from './src/data/pages.ts';

/** Build a slug → lastmod lookup from the indexable pages in the registry */
const lastmodMap = Object.fromEntries(
  pages
    .filter((p) => p.lastmod && !p.robots?.includes('noindex'))
    .map((p) => {
      const url = p.slug
        ? `https://www.propfind.me/${p.slug}/`
        : 'https://www.propfind.me/';
      return [url, p.lastmod];
    })
);

// https://astro.build/config
export default defineConfig({
  site: 'https://www.propfind.me',
  integrations: [
    sitemap({
      // Exclude noindex pages (privacy) from the sitemap
      filter: (page) => !page.includes('/privacy'),
      serialize(item) {
        const lastmod = lastmodMap[item.url];
        const priority = item.url === 'https://www.propfind.me/' ? 1.0 : 0.8;
        return lastmod
          ? { ...item, lastmod, priority }
          : { ...item, priority };
      },
    }),
  ],
});
