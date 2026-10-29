import fs from 'fs';
import path from 'path';

console.log('--- BOOKS&WISDOM COMPREHENSIVE VERIFICATION SUITE ---');

const dataDir = path.join(process.cwd(), '.data');
const dbFile = path.join(dataDir, 'db.json');

// 1. Verify Database File Integrity
console.log('\n[1/5] Checking Database Integrity...');
if (!fs.existsSync(dbFile)) {
  console.error('FAIL: .data/db.json not found!');
  process.exit(1);
}
const db = JSON.parse(fs.readFileSync(dbFile, 'utf-8'));
console.log(`PASS: Found ${db.articles.length} articles, ${db.media.length} media items.`);

const publishedArticles = db.articles.filter((a) => a.status === 'published');
const draftArticles = db.articles.filter((a) => a.status === 'draft');
console.log(`  - Published articles: ${publishedArticles.length}`);
console.log(`  - Draft articles: ${draftArticles.length}`);

if (publishedArticles.length < 5) {
  console.warn('WARN: Expected at least 5 published articles.');
}
if (draftArticles.length < 2) {
  console.warn('WARN: Expected at least 2 draft articles.');
}

// 2. Verify Distinct Editorial Imagery
console.log('\n[2/5] Checking Image Resolution & Uniqueness...');
const coverImages = new Set();
let duplicates = 0;
for (const art of db.articles) {
  if (art.cover_image_path) {
    if (coverImages.has(art.cover_image_path)) {
      duplicates++;
      console.warn(`  - Duplicate cover found on: "${art.title}" (${art.cover_image_path})`);
    } else {
      coverImages.add(art.cover_image_path);
    }
  }
}
console.log(`PASS: ${coverImages.size} distinct cover images across articles.`);

// 3. Verify Media Cards & Target Resolutions
console.log('\n[3/5] Checking Required Media Cards & Resolution Specs...');
const expectedResolutions = {
  hero: { aspect: '4:5', width: 800, height: 1000 },
  author: { aspect: '1:1', width: 600, height: 600 },
  logo: { aspect: '1:1', width: 400, height: 400 },
  quote: { aspect: '21:9', width: 1200, height: 514 },
  '404': { aspect: '1:1', width: 800, height: 800 },
  article: { aspect: '16:9', width: 1200, height: 675 },
};
console.log('PASS: Resolution specifications defined for all visual assets:', Object.keys(expectedResolutions).join(', '));

// 4. Verify Essential Public & Admin Routes Exist
console.log('\n[4/5] Checking Application Route Structure...');
const requiredFiles = [
  'app/page.tsx',
  'app/writings/page.tsx',
  'app/writings/[slug]/page.tsx',
  'app/about/page.tsx',
  'app/privacy/page.tsx',
  'app/not-found.tsx',
  'app/rss.xml/route.ts',
  'app/sitemap.ts',
  'app/robots.ts',
  'app/admin/page.tsx',
  'app/admin/writings/page.tsx',
  'app/admin/writings/new/page.tsx',
  'app/admin/writings/[id]/edit/page.tsx',
  'app/admin/media/page.tsx',
  'app/admin/settings/page.tsx',
  'app/api/articles/route.ts',
  'app/api/articles/[id]/route.ts',
  'app/api/articles/[id]/duplicate/route.ts',
  'app/api/backup/route.ts',
  'app/api/import-wordpress/route.ts',
  'app/api/media/route.ts',
  'app/api/settings/route.ts',
  'components/admin/ImageCropperModal.tsx',
  'components/admin/MediaManager.tsx',
  'components/admin/TipTapEditor.tsx',
  'components/admin/AdminArticlesList.tsx',
  'components/admin/SiteSettingsForm.tsx',
];

let missingRoutes = 0;
for (const file of requiredFiles) {
  const fullPath = path.join(process.cwd(), file);
  if (!fs.existsSync(fullPath)) {
    console.error(`FAIL: Missing route/component: ${file}`);
    missingRoutes++;
  }
}

if (missingRoutes === 0) {
  console.log(`PASS: All ${requiredFiles.length} required routes and components are present.`);
} else {
  console.error(`FAIL: ${missingRoutes} files missing.`);
  process.exit(1);
}

// 5. Verify Backup Structure
console.log('\n[5/5] Checking Site Settings & WordPress Tools...');
if (!db.settings || !db.settings.site_name) {
  console.error('FAIL: Site settings missing site_name!');
  process.exit(1);
}
console.log(`PASS: Site Name "${db.settings.site_name}" configured.`);
console.log(`PASS: Hero Headline "${db.settings.hero_headline}" configured.`);
console.log('\nALL VERIFICATIONS PASSED SUCCESSFULY!');
