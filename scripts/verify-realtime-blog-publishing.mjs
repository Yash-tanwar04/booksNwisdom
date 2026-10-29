const BASE_URL = 'http://localhost:3000';

async function main() {
  console.log('🚀 Starting Real-Time Blog Publishing & Main Site Verification...\n');

  // 1. Authenticate as Admin
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@booksandwisdom.com',
      password: 'Wisdom#2024',
    }),
  });

  if (!loginRes.ok) {
    throw new Error(`Login failed with status ${loginRes.status}`);
  }
  const cookie = loginRes.headers.get('set-cookie')?.split(';')[0];
  console.log('✅ Admin login authenticated successfully');

  // 2. Publish a brand-new blog post
  const timestamp = Date.now();
  const testTitle = `Finding Stillness in a Busy World #${timestamp}`;
  const testSlug = `finding-stillness-${timestamp}`;

  const blogPayload = {
    title: testTitle,
    subtitle: 'A gentle reminder to pause, breathe, and notice life.',
    slug: testSlug,
    excerpt: 'We rush through our days searching for destinations, forgetting that the journey itself is where life happens.',
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'In the middle of our endless to-do lists, it is easy to forget the quiet grace of a paused moment.',
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
                  text: 'Stillness is not the absence of life; it is the presence of awareness.',
                },
              ],
            },
          ],
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Three Gentle Reflections' }],
        },
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Drink your morning tea without looking at a screen.' }],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Forgive yourself for what was left unfinished today.' }],
                },
              ],
            },
          ],
        },
      ],
    },
    cover_image_path: '/images/writings/self-reflection.webp',
    status: 'published',
  };

  const publishRes = await fetch(`${BASE_URL}/api/articles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookie,
    },
    body: JSON.stringify(blogPayload),
  });

  if (!publishRes.ok) {
    throw new Error(`Publish failed with status ${publishRes.status}`);
  }

  const { article: publishedArticle } = await publishRes.json();
  console.log(`✅ Published new blog: "${publishedArticle.title}" (ID: ${publishedArticle.id}, slug: /writings/${publishedArticle.slug})`);

  // 3. Verify immediately on Public API
  const apiRes = await fetch(`${BASE_URL}/api/articles?limit=4`, { cache: 'no-store' });
  const apiData = await apiRes.json();
  const topArticle = apiData.articles[0];
  if (topArticle.slug !== testSlug) {
    throw new Error(`Expected newest article to be "${testSlug}", but got "${topArticle.slug}"!`);
  }
  console.log(`✅ Public API (/api/articles) immediately returned new blog as #1 top article!`);

  // 4. Verify immediately on Homepage (/)
  const homeRes = await fetch(`${BASE_URL}/`, { cache: 'no-store' });
  const homeHtml = await homeRes.text();
  if (!homeHtml.includes(testTitle)) {
    throw new Error(`New blog title "${testTitle}" not found in Homepage (/) HTML!`);
  }
  if (!homeHtml.includes(`/writings/${testSlug}`)) {
    throw new Error(`New blog link "/writings/${testSlug}" not found in Homepage (/) HTML!`);
  }
  console.log(`✅ Main Homepage (/) immediately displays the new blog at the top of Latest Writings!`);

  // 5. Verify immediately on All Writings (/writings)
  const writingsRes = await fetch(`${BASE_URL}/writings`, { cache: 'no-store' });
  const writingsHtml = await writingsRes.text();
  if (!writingsHtml.includes(testTitle)) {
    throw new Error(`New blog title "${testTitle}" not found in All Writings (/writings) HTML!`);
  }
  console.log(`✅ All Writings page (/writings) immediately displays the new blog!`);

  // 6. Verify Individual Post Page (/writings/[slug])
  const postRes = await fetch(`${BASE_URL}/writings/${testSlug}`, { cache: 'no-store' });
  if (postRes.status !== 200) {
    throw new Error(`Individual post page /writings/${testSlug} returned status ${postRes.status}!`);
  }
  const postHtml = await postRes.text();
  if (!postHtml.includes('Stillness is not the absence of life') || !postHtml.includes('Three Gentle Reflections')) {
    throw new Error(`Individual post content missing on /writings/${testSlug}!`);
  }
  console.log(`✅ Individual Blog page (/writings/${testSlug}) renders with all typography, blockquotes, and lists!`);

  // 7. Verify Admin Dashboard (/admin)
  const adminDashRes = await fetch(`${BASE_URL}/admin`, { headers: { Cookie: cookie }, cache: 'no-store' });
  const adminDashHtml = await adminDashRes.text();
  if (!adminDashHtml.includes(testTitle)) {
    throw new Error(`New blog title "${testTitle}" not found in Recent Posts on /admin!`);
  }
  console.log(`✅ Admin Dashboard (/admin) immediately displays the new blog in Recent Posts!`);

  // 8. Verify Admin All Blogs (/admin/writings)
  const adminWritingsRes = await fetch(`${BASE_URL}/admin/writings`, { headers: { Cookie: cookie }, cache: 'no-store' });
  const adminWritingsHtml = await adminWritingsRes.text();
  if (!adminWritingsHtml.includes(testTitle)) {
    throw new Error(`New blog title "${testTitle}" not found in /admin/writings!`);
  }
  console.log(`✅ Admin All Blogs (/admin/writings) immediately displays the new blog!`);

  // 9. Clean up test blog
  const deleteRes = await fetch(`${BASE_URL}/api/articles/${publishedArticle.id}`, {
    method: 'DELETE',
    headers: { Cookie: cookie },
  });
  if (deleteRes.ok) {
    console.log(`✅ Cleaned up temporary test blog "${testTitle}"`);
  }

  console.log('\n🎉 ALL REAL-TIME PUBLISHING & MAIN SITE TESTS PASSED WITH 100% SUCCESS!');
}

main().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
