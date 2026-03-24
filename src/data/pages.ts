export interface PageMeta {
  /** URL slug with no leading slash. Empty string = homepage. */
  slug: string;
  /** Full <title> / OG image headline. */
  title: string;
  /** Meta description / OG image subtext. */
  description: string;
  /** Accessible alt text for og:image — falls back to title. */
  ogImageAlt?: string;
  /** og:type value. Defaults to "website". */
  ogType?: 'website' | 'article';
  /** Short kicker badge shown top-left in the OG image. */
  kicker?: string;
  /** Accent bar hex colour in OG image. Defaults to brand crimson. */
  accentColor?: string;
  /** Full robots meta string override. */
  robots?: string;
  /** ISO date of last significant content change — used by sitemap lastmod. */
  lastmod?: string;
}

export const SITE = 'https://www.propfind.me';
export const BRAND_ACCENT = '#e94560';

export const pages: PageMeta[] = [
  {
    slug: '',
    title: 'Prop Find — Professional Landing Pages for Singapore Property Agents',
    description:
      "Stand out in Singapore's competitive property market. A sleek, professional website designed exclusively for real estate agents. $20/yr, done for you.",
    ogImageAlt: 'Prop Find — Professional Landing Pages for Singapore Property Agents',
    ogType: 'website',
    kicker: 'For Agents',
    accentColor: BRAND_ACCENT,
    lastmod: '2026-03-24',
  },
  {
    slug: 'personal-vs-listing',
    title: 'Personal Page vs Portal Listing for Singapore Property Agents — Prop Find',
    description:
      'Why Singapore property agents with a personal page win more clients than those relying on portals like PropertyGuru or 99.co.',
    ogImageAlt: 'Personal Page vs Portal Listing — Prop Find',
    ogType: 'article',
    kicker: 'Deep Dive',
    accentColor: BRAND_ACCENT,
    lastmod: '2026-03-24',
  },
  {
    slug: 'privacy',
    title: 'Privacy Policy — Prop Find',
    description:
      'How Prop Find collects, uses, and protects your personal data in accordance with Singapore PDPA.',
    ogImageAlt: 'Privacy Policy — Prop Find',
    ogType: 'website',
    kicker: 'Legal',
    accentColor: BRAND_ACCENT,
    robots: 'noindex,follow',
    lastmod: '2026-03-24',
  },
];

export function getPage(slug: string): PageMeta | undefined {
  return pages.find((p) => p.slug === slug);
}

export function canonicalUrl(slug: string): string {
  return slug ? `${SITE}/${slug}` : SITE;
}

export function ogImageUrl(slug: string): string {
  return `${SITE}/og/${slug || 'home'}.png`;
}
