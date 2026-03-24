import type { APIRoute, GetStaticPaths } from 'astro';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { pages, BRAND_ACCENT } from '../../data/pages';

// ── Static paths from the shared registry ────────────────────────────────────
export const getStaticPaths: GetStaticPaths = () =>
  pages.map((p) => ({ params: { slug: p.slug || 'home' } }));

// ── Font loading ──────────────────────────────────────────────────────────────
const font400 = readFileSync(
  resolve('node_modules/@fontsource/inter/files/inter-latin-400-normal.woff')
).buffer as ArrayBuffer;

const font700 = readFileSync(
  resolve('node_modules/@fontsource/inter/files/inter-latin-700-normal.woff')
).buffer as ArrayBuffer;

// ── OG image renderer ─────────────────────────────────────────────────────────
export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug as string;
  const page = pages.find((p) => (p.slug || 'home') === slug);

  if (!page) {
    return new Response('Not found', { status: 404 });
  }

  const accent = page.accentColor ?? BRAND_ACCENT;
  const titleSize = page.title.length > 50 ? '44px' : page.title.length > 30 ? '52px' : '64px';

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '64px 72px',
          background: '#18202e',
          position: 'relative',
          fontFamily: 'Inter',
        },
        children: [
          // Background radial glow using brand accent colour
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                inset: '0',
                background: `radial-gradient(ellipse 70% 60% at 50% 100%, ${accent}28, transparent)`,
              },
            },
          },
          // Top-left brand mark
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                top: '52px',
                left: '72px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      width: '36px',
                      height: '36px',
                      background: `${accent}e6`,
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    },
                    children: {
                      type: 'div',
                      props: {
                        style: {
                          width: '16px',
                          height: '16px',
                          background: '#ffffff',
                          borderRadius: '3px',
                        },
                      },
                    },
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '18px',
                      fontWeight: 700,
                      color: '#ffffff',
                      letterSpacing: '-0.01em',
                    },
                    children: 'PropFind',
                  },
                },
              ],
            },
          },
          // Kicker badge — top-right, only when defined in registry
          ...(page.kicker
            ? [
                {
                  type: 'div',
                  props: {
                    style: {
                      position: 'absolute',
                      top: '52px',
                      right: '72px',
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase' as const,
                      color: accent,
                      background: `${accent}1a`,
                      border: `1px solid ${accent}40`,
                      borderRadius: '3px',
                      padding: '6px 12px',
                    },
                    children: page.kicker,
                  },
                },
              ]
            : []),
          // Accent bar — brand crimson
          {
            type: 'div',
            props: {
              style: {
                width: '48px',
                height: '3px',
                background: accent,
                marginBottom: '24px',
                borderRadius: '2px',
              },
            },
          },
          // Title
          {
            type: 'div',
            props: {
              style: {
                fontSize: titleSize,
                fontWeight: 700,
                color: '#ffffff',
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                marginBottom: '20px',
                maxWidth: '900px',
              },
              children: page.title,
            },
          },
          // Description
          {
            type: 'div',
            props: {
              style: {
                fontSize: '22px',
                fontWeight: 400,
                color: 'rgba(200, 210, 240, 0.8)',
                lineHeight: 1.5,
                maxWidth: '780px',
                letterSpacing: '-0.01em',
              },
              children: page.description,
            },
          },
          // Bottom-right domain
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                bottom: '52px',
                right: '72px',
                fontSize: '16px',
                fontWeight: 600,
                color: 'rgba(140, 160, 220, 0.6)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase' as const,
              },
              children: 'propfind.me',
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Inter', data: font400, weight: 400, style: 'normal' },
        { name: 'Inter', data: font700, weight: 700, style: 'normal' },
      ],
    }
  );

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
  const pngBuffer = resvg.render().asPng();
  const png = new Uint8Array(pngBuffer).buffer;

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
