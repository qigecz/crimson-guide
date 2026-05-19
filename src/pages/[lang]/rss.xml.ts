import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import type { Lang } from '../../i18n/ui';

const langs: Lang[] = ['en', 'zh-cn', 'ja', 'ko', 'es', 'pt'];

export const GET: APIRoute = async ({ params }) => {
  const lang = params.lang as Lang;
  const allGuides = await getCollection('guides');
  const guides = allGuides
    .filter((entry) => entry.id.startsWith(`${lang}/`))
    .sort((a, b) => {
      const dateA = a.data.publishDate?.getTime() || 0;
      const dateB = b.data.publishDate?.getTime() || 0;
      return dateB - dateA;
    });

  const rssItems = guides.map((guide) => {
    const slug = guide.id
      .replace(new RegExp(`^${lang}/guides/`), '')
      .replace(/\.(md|mdx)$/, '');
    return `
    <item>
      <title><![CDATA[${guide.data.title}]]></title>
      <link>https://crimsonsguide.com/${lang}/guides/${slug}</link>
      <description><![CDATA[${guide.data.description}]]></description>
      <pubDate>${guide.data.publishDate.toUTCString()}</pubDate>
      <category>${guide.data.category}</category>
    </item>`;
  });

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Crimson Guide${lang !== 'en' ? ` (${lang})` : ''}</title>
    <description>Crimson Desert Guides and News</description>
    <link>https://crimsonsguide.com/${lang}</link>
    <atom:link href="https://crimsonsguide.com/${lang}/rss.xml" rel="self" type="application/rss+xml"/>
    <language>${lang}</language>
    ${rssItems.join('')}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: { 'Content-Type': 'application/xml' },
  });
};

export function getStaticPaths() {
  return langs.map((lang) => ({ params: { lang } }));
}
