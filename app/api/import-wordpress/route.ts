import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { saveArticle } from '@/lib/db';
import { slugify, calculateReadingTime } from '@/lib/utils';

export async function POST(req: Request) {
  try {
    const isAuth = await isAuthenticated();
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { format, data } = await req.json();

    if (!data) {
      return NextResponse.json({ error: 'No data provided for import' }, { status: 400 });
    }

    const importedArticles = [];

    // Format 1: JSON array of posts (from WP REST API or custom export)
    if (Array.isArray(data)) {
      for (const item of data) {
        const title = item.title?.rendered || item.title || 'Untitled Post';
        const rawContent = item.content?.rendered || item.content || '';
        const excerpt = item.excerpt?.rendered || item.excerpt || '';
        const slug = item.slug || slugify(title);
        const publishedDate = item.date || item.published_at || new Date().toISOString();
        const coverImage = item.featured_media_url || item.cover_image || null;

        const imported = await saveArticle({
          title,
          slug,
          excerpt: excerpt.replace(/<[^>]*>/g, '').slice(0, 160).trim(),
          content: rawContent, // Supported by HTML renderer
          cover_image_path: coverImage,
          status: 'published',
          published_at: publishedDate,
          reading_time_minutes: calculateReadingTime(rawContent),
        });

        importedArticles.push(imported);
      }
    } else if (typeof data === 'string' && data.includes('<rss')) {
      // Format 2: WordPress WXR XML Export parser
      const itemMatches = data.match(/<item>([\s\S]*?)<\/item>/g) || [];

      for (const itemXml of itemMatches) {
        const postType = itemXml.match(/<wp:post_type><!\[CDATA\[(.*?)\]\]><\/wp:post_type>/)?.[1];
        if (postType && postType !== 'post') continue; // Skip attachments/pages

        const title = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] ||
                      itemXml.match(/<title>(.*?)<\/title>/)?.[1] ||
                      'Untitled Reflection';

        const content = itemXml.match(/<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/)?.[1] || '';
        const excerpt = itemXml.match(/<excerpt:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/excerpt:encoded>/)?.[1] || '';
        const postDate = itemXml.match(/<wp:post_date><!\[CDATA\[(.*?)\]\]><\/wp:post_date>/)?.[1] || new Date().toISOString();
        const postName = itemXml.match(/<wp:post_name><!\[CDATA\[(.*?)\]\]><\/wp:post_name>/)?.[1] || slugify(title);
        const status = itemXml.match(/<wp:status><!\[CDATA\[(.*?)\]\]><\/wp:status>/)?.[1] === 'publish' ? 'published' : 'draft';

        if (!title && !content) continue;

        const imported = await saveArticle({
          title,
          slug: postName,
          excerpt: excerpt.replace(/<[^>]*>/g, '').slice(0, 160).trim(),
          content,
          status: status as any,
          published_at: status === 'published' ? new Date(postDate).toISOString() : null,
          reading_time_minutes: calculateReadingTime(content),
        });

        importedArticles.push(imported);
      }
    }

    return NextResponse.json({
      success: true,
      importedCount: importedArticles.length,
      articles: importedArticles,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
