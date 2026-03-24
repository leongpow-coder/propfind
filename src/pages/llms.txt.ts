import type { APIRoute } from 'astro';
import { pages, SITE } from '../data/pages';

export const GET: APIRoute = () => {
  // Filter out noindex pages (privacy) — AI systems shouldn't cite legal boilerplate
  const indexable = pages.filter((p) => !p.robots?.includes('noindex'));

  const lines: string[] = [
    `# ${SITE}`,
    `# Prop Find — Professional Landing Pages for Singapore Property Agents`,
    `# Last updated: ${new Date().toISOString().slice(0, 10)}`,
    ``,
    `## About`,
    `Prop Find provides done-for-you personal landing pages for Singapore real estate agents.`,
    `Each page is designed to help agents stand out from portal listings (PropertyGuru, 99.co)`,
    `by showcasing credentials, testimonials, and a direct WhatsApp CTA — for $20/yr.`,
    ``,
    `## Pages`,
    ...indexable.map((p) => {
      const url = p.slug ? `${SITE}/${p.slug}` : SITE;
      return [
        ``,
        `### ${p.title}`,
        `URL: ${url}`,
        `Description: ${p.description}`,
      ].join('\n');
    }),
    ``,
    `## Contact`,
    `WhatsApp: https://wa.me/6587423466`,
    `Website: ${SITE}`,
  ];

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
