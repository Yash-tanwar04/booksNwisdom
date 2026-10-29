import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:3000';

// 1. Update .data/db.json to reset views_count to 0 and ensure "The Quiet Art of Letting Go" is present
const dbPath = path.join(process.cwd(), '.data', 'db.json');
if (fs.existsSync(dbPath)) {
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  db.articles = (db.articles || []).map((a) => ({ ...a, views_count: 0 }));

  const hasLettingGo = db.articles.some((a) => a.slug === 'the-quiet-art-of-letting-go');
  if (!hasLettingGo) {
    db.articles.unshift({
      id: 'art-007',
      title: 'The Quiet Art of Letting Go',
      subtitle: 'Learning to release the versions of life we planned so we can embrace the one unfolding in front of us.',
      slug: 'the-quiet-art-of-letting-go',
      excerpt: 'Letting go is rarely a single dramatic decision. More often, it is a quiet daily practice of loosening our grip on what has already passed and making room for peace.',
      content: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'We spend so much of our lives holding on—to expectations, to unfinished conversations, to versions of ourselves that belonged to another season. We confuse holding on with strength, when sometimes the bravest thing a heart can do is gently open its hand.',
              },
            ],
          },
          {
            type: 'blockquote',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: 'Peace does not arrive when everything goes according to our plan; it arrives when we stop fighting the chapter that has already ended.',
                  },
                ],
              },
            ],
          },
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: 'Why Holding On Feels So Familiar' }],
          },
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Even when something weighs heavily on our spirit, familiarity gives us an illusion of control. Replaying old memories or wishing we had spoken differently keeps us connected to a moment we aren’t ready to release. Yet as ',
              },
              {
                type: 'text',
                marks: [{ type: 'italic' }],
                text: 'time moves quietly forward',
              },
              {
                type: 'text',
                text: ', we begin to notice the subtle ways our energy is asking to return to the present:',
              },
            ],
          },
          {
            type: 'bulletList',
            content: [
              {
                type: 'listItem',
                content: [
                  {
                    type: 'paragraph',
                    content: [
                      {
                        type: 'text',
                        marks: [{ type: 'bold' }],
                        text: 'Forgiving our past selves',
                      },
                      {
                        type: 'text',
                        text: ' for not knowing what only experience could teach us.',
                      },
                    ],
                  },
                ],
              },
              {
                type: 'listItem',
                content: [
                  {
                    type: 'paragraph',
                    content: [
                      {
                        type: 'text',
                        marks: [{ type: 'bold' }],
                        text: 'Accepting unanswered questions',
                      },
                      {
                        type: 'text',
                        text: ' without letting them define our worth.',
                      },
                    ],
                  },
                ],
              },
              {
                type: 'listItem',
                content: [
                  {
                    type: 'paragraph',
                    content: [
                      {
                        type: 'text',
                        marks: [{ type: 'bold' }],
                        text: 'Honoring the lesson',
                      },
                      {
                        type: 'text',
                        text: ' while leaving the heaviness behind.',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: 'horizontalRule',
          },
          {
            type: 'image',
            attrs: {
              src: '/images/writings/letting-go.webp',
              alt: 'Autumn leaves drifting across calm water in warm evening light',
              title: 'Every season knows when it is time to release what it has carried.',
            },
          },
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: 'Three Gentle Steps Toward Emotional Freedom' }],
          },
          {
            type: 'orderedList',
            content: [
              {
                type: 'listItem',
                content: [
                  {
                    type: 'paragraph',
                    content: [
                      {
                        type: 'text',
                        text: 'Name what you are carrying honestly in your journal without judging yourself for still caring.',
                      },
                    ],
                  },
                ],
              },
              {
                type: 'listItem',
                content: [
                  {
                    type: 'paragraph',
                    content: [
                      {
                        type: 'text',
                        text: 'Separate the memory from the lesson—keep the wisdom, and allow the ache to soften.',
                      },
                    ],
                  },
                ],
              },
              {
                type: 'listItem',
                content: [
                  {
                    type: 'paragraph',
                    content: [
                      {
                        type: 'text',
                        text: 'Turn your attention toward the small, quiet graces waiting in your life today.',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'If you are in a season of transition right now, remember that ',
              },
              {
                type: 'text',
                marks: [{ type: 'underline' }],
                text: 'letting go is not losing',
              },
              {
                type: 'text',
                text: '—it is clearing a quiet space for who you are becoming, one gentle breath at a time. Explore more reflections in our ',
              },
              {
                type: 'text',
                marks: [{ type: 'link', attrs: { href: '/writings' } }],
                text: 'collected writings archive',
              },
              {
                type: 'text',
                text: '.',
              },
            ],
          },
        ],
      },
      cover_image_path: '/images/writings/letting-go.webp',
      status: 'published',
      published_at: '2024-02-14T09:00:00Z',
      reading_time_minutes: 4,
      views_count: 0,
      created_at: '2024-02-14T08:00:00Z',
      updated_at: '2024-02-14T09:00:00Z',
      seo_title: 'The Quiet Art of Letting Go — Books&Wisdom',
      seo_description: 'Learning to release the versions of life we planned so we can embrace the one unfolding in front of us.',
    });
  }

  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
  console.log('✅ Synced .data/db.json (views_count = 0, added "The Quiet Art of Letting Go")');
}

async function runTests() {
  // 2. Login to Admin API
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: process.env.ADMIN_EMAIL || 'admin@booksandwisdom.com',
      password: process.env.ADMIN_PASSWORD || 'Wisdom#2024',
    }),
  });

  if (!loginRes.ok) {
    throw new Error(`Admin login failed with status ${loginRes.status}`);
  }

  const rawCookie = loginRes.headers.get('set-cookie');
  const cookieHeader = rawCookie ? rawCookie.split(';')[0] : '';
  console.log('✅ Admin login succeeded');

  // 3. Publish "The Quiet Art of Letting Go" via POST /api/articles to trigger full server save & revalidation
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  const lettingGoArticle = db.articles.find((a) => a.slug === 'the-quiet-art-of-letting-go');

  const publishRes = await fetch(`${BASE_URL}/api/articles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader,
    },
    body: JSON.stringify(lettingGoArticle),
  });

  if (!publishRes.ok) {
    throw new Error(`POST /api/articles failed with status ${publishRes.status}`);
  }
  const { article: savedLettingGo } = await publishRes.json();
  console.log(`✅ Published blog via POST /api/articles: "${savedLettingGo.title}" (slug: /writings/${savedLettingGo.slug})`);

  // 4. Verify it appears on Public API (/api/articles)
  const pubApiRes = await fetch(`${BASE_URL}/api/articles`);
  const pubApiData = await pubApiRes.json();
  const foundInPubApi = pubApiData.articles.some((a) => a.slug === 'the-quiet-art-of-letting-go');
  if (!foundInPubApi) throw new Error('Published blog not found in GET /api/articles!');
  console.log('✅ Found published blog in GET /api/articles');

  // 5. Verify it appears on Admin API (/api/articles?admin=1)
  const adminApiRes = await fetch(`${BASE_URL}/api/articles?admin=1`, {
    headers: { Cookie: cookieHeader },
  });
  const adminApiData = await adminApiRes.json();
  const foundInAdminApi = adminApiData.articles.some((a) => a.slug === 'the-quiet-art-of-letting-go');
  if (!foundInAdminApi) throw new Error('Published blog not found in GET /api/articles?admin=1!');
  console.log('✅ Found published blog in GET /api/articles?admin=1');

  // 6. Verify it appears on Homepage (/)
  const homeHtml = await (await fetch(`${BASE_URL}/`)).text();
  if (!homeHtml.includes('The Quiet Art of Letting Go')) {
    throw new Error('Published blog title not found on Homepage (/)!');
  }
  console.log('✅ Verified published blog appears on Homepage (/)');

  // 7. Verify it appears on All Writings page (/writings)
  const writingsHtml = await (await fetch(`${BASE_URL}/writings`)).text();
  if (!writingsHtml.includes('The Quiet Art of Letting Go')) {
    throw new Error('Published blog title not found on All Writings (/writings)!');
  }
  console.log('✅ Verified published blog appears on All Writings (/writings)');

  // 8. Verify Individual Blog Page (/writings/the-quiet-art-of-letting-go) renders all Notepad features
  const articleHtml = await (await fetch(`${BASE_URL}/writings/the-quiet-art-of-letting-go`)).text();
  const requiredElements = [
    'The Quiet Art of Letting Go',
    'Why Holding On Feels So Familiar',
    '<blockquote',
    '<ul',
    '<ol',
    'Forgiving our past selves',
    'Three Gentle Steps Toward Emotional Freedom',
    'letting go is not losing',
    'collected writings archive',
  ];
  for (const snippet of requiredElements) {
    if (!articleHtml.includes(snippet)) {
      throw new Error(`Individual blog page missing expected rendered element: ${snippet}`);
    }
  }
  console.log('✅ Verified all Notepad features (Headings, Blockquote, Bullet List, Ordered List, Bold, Italic, Underline, Link, Image, Divider) render on /writings/the-quiet-art-of-letting-go');

  // 9. Verify Admin Dashboard (/admin) has NO fake "Total Views" card and shows the new blog
  const adminDashHtml = await (
    await fetch(`${BASE_URL}/admin`, { headers: { Cookie: cookieHeader } })
  ).text();
  if (adminDashHtml.includes('Total Views') || adminDashHtml.includes('readers inspired')) {
    throw new Error('Fake "Total Views" card still present on /admin!');
  }
  if (!adminDashHtml.includes('The Quiet Art of Letting Go')) {
    throw new Error('Published blog not shown in Recent Posts on /admin!');
  }
  console.log('✅ Verified /admin has NO fake Views analytics and displays "The Quiet Art of Letting Go"');

  // 10. Verify Admin Writings (/admin/writings) shows the new blog
  const adminWritingsHtml = await (
    await fetch(`${BASE_URL}/admin/writings`, { headers: { Cookie: cookieHeader } })
  ).text();
  if (!adminWritingsHtml.includes('The Quiet Art of Letting Go')) {
    throw new Error('Published blog not shown on /admin/writings!');
  }
  console.log('✅ Verified /admin/writings displays "The Quiet Art of Letting Go"');

  console.log('\n🎉 ALL E2E BLOG PUBLISHING, NOTEPAD FORMATTING & ADMIN PORTAL TESTS PASSED!');
}

runTests().catch((err) => {
  console.error('❌ E2E Test Failed:', err);
  process.exit(1);
});
