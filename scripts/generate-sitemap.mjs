import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = process.env.SITE_URL || 'https://ais-dev-qqazyveljoah7o737g6gsb-887693439055.asia-southeast1.run.app';
const publicDir = path.resolve(__dirname, '../public');
const sitemapPath = path.join(publicDir, 'sitemap.xml');

const defaultPosts = [
  { slug: 'optimizing-3d-web-experiences-webgl-threejs-performance', date: '2026-08-20' },
  { slug: 'modern-web-animation-architecture-css-canvas-motion', date: '2026-08-22' },
  { slug: 'building-next-generation-interactive-portfolios-that-convert', date: '2026-08-25' },
  { slug: 'seo-strategies-single-page-applications-spa-2026', date: '2026-08-27' },
];

const staticRoutes = [
  { path: '', priority: '1.0', changefreq: 'weekly' },
  { path: 'blog', priority: '0.9', changefreq: 'daily' },
  { path: 'contact', priority: '0.8', changefreq: 'monthly' },
  { path: 'services/web-design', priority: '0.8', changefreq: 'monthly' },
  { path: 'services/frontend-development', priority: '0.8', changefreq: 'monthly' },
  { path: 'services/backend-api-development', priority: '0.8', changefreq: 'monthly' },
  { path: 'services/ecommerce-development', priority: '0.8', changefreq: 'monthly' },
  { path: 'services/website-maintenance-optimization', priority: '0.8', changefreq: 'monthly' },
];

export function generateSitemap(customPosts = defaultPosts) {
  const today = new Date().toISOString().slice(0, 10);

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  for (const route of staticRoutes) {
    const loc = route.path ? `${BASE_URL}/${route.path}` : `${BASE_URL}/`;
    xml += `  <url>\n`;
    xml += `    <loc>${loc}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
    xml += `    <priority>${route.priority}</priority>\n`;
    xml += `  </url>\n`;
  }

  for (const post of customPosts) {
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}/blog/${post.slug}</loc>\n`;
    xml += `    <lastmod>${post.date || today}</lastmod>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
  }

  xml += `</urlset>\n`;

  fs.writeFileSync(sitemapPath, xml, 'utf8');
  console.log(`[Sitemap] Generated ${sitemapPath} successfully.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateSitemap();
}
