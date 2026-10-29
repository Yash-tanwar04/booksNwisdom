import { NextResponse } from 'next/server';
import { getPublishedArticles, getSiteSettings } from '@/lib/db';
import { extractTextFromContent } from '@/lib/utils';

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const settings = await getSiteSettings();
  const { articles } = await getPublishedArticles({ limit: 50 });

  const siteTitle = settings.site_name || 'Books&Wisdom';
  const siteDescription = settings.hero_subheading || settings.seo_default_description || 'A quiet space for mindful living, heartfelt essays, and personal reflections.';

  const itemsXml = articles
    .map((article) => {
      const articleUrl = `${siteUrl}/writings/${article.slug}`;
      const pubDate = new Date(article.published_at || article.created_at).toUTCString();
      const rawText = typeof article.content === 'string' 
        ? article.content.replace(/<[^>]*>/g, '') 
        : extractTextFromContent(article.content);
      const excerpt = article.excerpt || rawText.slice(0, 200);

      const enclosure = article.cover_image_path
        ? `<enclosure url="${article.cover_image_path.startsWith('http') ? article.cover_image_path : siteUrl + article.cover_image_path}" type="image/jpeg" />`
        : '';

      return `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${articleUrl}</link>
      <guid isPermaLink="true">${articleUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${excerpt}]]></description>
      <content:encoded><![CDATA[${rawText}]]></content:encoded>
      ${enclosure}
    </item>`;
    })
    .join('');

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${siteTitle}]]></title>
    <link>${siteUrl}</link>
    <description><![CDATA[${siteDescription}]]></description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    ${itemsXml}
  </channel>
</rss>`;

  return new NextResponse(rssXml.trim(), {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
