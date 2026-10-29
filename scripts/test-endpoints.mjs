const AUTH_COOKIE = 'bw_admin_session=bw_secret_session_key_2024_secure';

async function testRoute(name, url, options = {}) {
  try {
    const res = await fetch(url, options);
    const text = await res.text();
    const isOk = res.status >= 200 && res.status < 400;
    const statusSign = isOk ? 'PASS' : 'FAIL';
    console.log(`[${statusSign}] ${res.status} ${name} (${url}) - ${text.length} bytes`);
    if (!isOk) {
      console.error(`  Error response: ${text.slice(0, 200)}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`[FAIL] ${name} (${url}) - ${err.message}`);
    return false;
  }
}

async function run() {
  console.log('Testing all public and authenticated endpoints on http://localhost:3000 ...\n');
  let failures = 0;

  const publicRoutes = [
    ['Homepage', 'http://localhost:3000/'],
    ['All Writings Archive', 'http://localhost:3000/writings'],
    ['Individual Blog: A Battle Within', 'http://localhost:3000/writings/a-battle-within'],
    ['Individual Blog: Transformation Phase', 'http://localhost:3000/writings/transformation-phase'],
    ['About Page', 'http://localhost:3000/about'],
    ['Privacy Policy', 'http://localhost:3000/privacy'],
    ['RSS 2.0 Feed', 'http://localhost:3000/rss.xml'],
    ['Feed Redirect', 'http://localhost:3000/feed', { redirect: 'manual' }],
    ['Dynamic Sitemap', 'http://localhost:3000/sitemap.xml'],
    ['Robots.txt', 'http://localhost:3000/robots.txt'],
    ['Admin Login Screen', 'http://localhost:3000/admin/login'],
    ['Public Articles API', 'http://localhost:3000/api/articles'],
    ['Public Settings API', 'http://localhost:3000/api/settings'],
  ];

  for (const [name, url, opts] of publicRoutes) {
    const ok = await testRoute(name, url, opts);
    if (!ok) failures++;
  }

  console.log('\n--- TESTING AUTHENTICATED ADMIN PAGES & APIs ---');
  const authRoutes = [
    ['Admin Dashboard', 'http://localhost:3000/admin', { headers: { Cookie: AUTH_COOKIE } }],
    ['Admin Writings List', 'http://localhost:3000/admin/writings', { headers: { Cookie: AUTH_COOKIE } }],
    ['Admin Media Manager', 'http://localhost:3000/admin/media', { headers: { Cookie: AUTH_COOKIE } }],
    ['Admin Settings Page', 'http://localhost:3000/admin/settings', { headers: { Cookie: AUTH_COOKIE } }],
    ['Admin Media API', 'http://localhost:3000/api/media', { headers: { Cookie: AUTH_COOKIE } }],
    ['Admin Backup Export API', 'http://localhost:3000/api/backup', { headers: { Cookie: AUTH_COOKIE } }],
    ['Duplicate Article API', 'http://localhost:3000/api/articles/art-001/duplicate', { method: 'POST', headers: { Cookie: AUTH_COOKIE } }],
  ];

  for (const [name, url, opts] of authRoutes) {
    const ok = await testRoute(name, url, opts);
    if (!ok) failures++;
  }

  console.log('\n--- VERIFYING RSS 2.0 XML STRUCTURE ---');
  try {
    const rssRes = await fetch('http://localhost:3000/rss.xml');
    const rssText = await rssRes.text();
    if (rssText.includes('<rss version="2.0"') && rssText.includes('<channel>') && rssText.includes('<item>')) {
      console.log('[PASS] Valid RSS 2.0 feed with <channel> and <item> elements generated.');
    } else {
      console.error('[FAIL] RSS feed missing standard elements.');
      failures++;
    }
  } catch (e) {
    console.error('[FAIL] Could not verify RSS XML:', e.message);
    failures++;
  }

  const total = publicRoutes.length + authRoutes.length;
  console.log(`\nALL TESTS COMPLETED: ${total - failures}/${total} PASSED (${failures} failures).`);
  if (failures > 0) {
    process.exit(1);
  }
}

run();
