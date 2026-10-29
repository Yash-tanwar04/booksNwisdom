# Books&Wisdom — Premium Scrapbook-Style Blogging Platform

A custom-built, full-stack personal writing and reflection website called **Books&Wisdom**. Designed with a handcrafted **Personal Scrapbook** visual identity inspired by handwritten journals, pressed botanicals, warm paper textures, and washi tape accents.

---

## 🌸 Visual Identity & Aesthetic

- **Warm Paper Canvas:** `#FBF3EA`
- **Cream Writing Surface:** `#FFF9F3`
- **Dusty Rose:** `#D8A5A0`
- **Muted Rose:** `#B87873`
- **Deep Brown:** `#59413B`
- **Dark Text:** `#302622`
- **Muted Text:** `#88756D`
- **Paper Border:** `#E8D7CC` / `#EBD7CC`
- **Soft Blush:** `#F3E1DC`
- **Sage Accent:** `#A7B29E`
- **Typography:**
  - **Headlines:** Playfair Display (Serif)
  - **Body Text:** DM Sans
  - **Handwritten Accents:** Caveat (Cursive)

---

## 🚀 Technology Stack

- **Framework:** Next.js (App Router) + TypeScript
- **Styling:** Tailwind CSS + `@tailwindcss/typography`
- **Icons:** Lucide React
- **Rich Text Editor:** TipTap Editor with custom toolbar (headings 1-3, bold, italic, underline, strike, lists, blockquote, links, inline images, dividers, undo/redo)
- **Database:** Supabase PostgreSQL with Row Level Security (RLS) + Resilient Offline Local Persistence
- **Storage:** Supabase Storage + Local fallback in `public/uploads`
- **Auth:** Supabase Auth + Secure HTTP-only administrative sessions
- **Theme:** `next-themes` (Light & Charcoal Dark Mode with zero flicker)

---

## 🗂️ Project Structure

```
├── app/
│   ├── layout.tsx              # Root layout with Google fonts & ThemeProvider
│   ├── page.tsx                # Scrapbook Split Hero, Latest Writings, Quote Ribbon, Author Bio
│   ├── writings/
│   │   ├── page.tsx            # All Writings archive (no categories, live search, Load More)
│   │   └── [slug]/page.tsx     # Blog Reading Page (Drop caps, reading progress, TOC, share)
│   ├── about/page.tsx          # About the Author & Purpose of Books&Wisdom
│   ├── privacy/page.tsx        # Privacy policy
│   ├── not-found.tsx           # Custom 404 scrapbook error page
│   ├── sitemap.ts              # Dynamic XML sitemap for SEO
│   ├── robots.ts               # Robots.txt configuration
│   ├── admin/
│   │   ├── layout.tsx          # Protected admin layout with sidebar
│   │   ├── login/page.tsx      # Admin login with password toggle
│   │   ├── page.tsx            # Dashboard with stats cards & recent posts
│   │   ├── writings/           # Manage all articles, draft filtering, publishing
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx    # Create new blog with TipTap editor & cover uploader
│   │   │   └── [id]/edit/page.tsx # Edit existing blog
│   │   ├── media/page.tsx      # Media library with drag & drop uploads & URL copying
│   │   └── settings/page.tsx   # Site settings, quotes, bio, and WordPress importer
│   └── api/
│       ├── auth/               # Login & logout endpoints
│       ├── articles/           # CRUD, search, and pagination API
│       ├── settings/           # Site settings API
│       ├── media/              # Media upload and deletion API
│       └── import-wordpress/   # WXR XML and WP REST API JSON importer
├── components/
│   ├── navigation/             # Navbar, Footer, ThemeToggle
│   ├── decorations/            # BookLogo, WashiTape, FloralAccent, TornPaper
│   ├── articles/               # ArticleCard, ArticleRenderer, ReadingProgress, ShareButtons
│   ├── search/                 # SearchModal overlay
│   ├── admin/                  # TipTapEditor, AdminSidebar, AdminHeader, MediaManager, etc.
│   └── providers/              # ThemeProvider
├── lib/
│   ├── db.ts                   # Unified data access layer (Supabase + Local fallback)
│   ├── auth.ts                 # Session and Supabase auth verification
│   ├── supabase/               # Browser and SSR server clients
│   ├── utils.ts                # Slugify, reading time, date formatting, cn
│   └── seed-data.ts            # Authentic seed data matching target UI board
└── supabase/
    └── migrations/
        └── 001_initial_schema.sql # Complete PostgreSQL schema, RLS policies & buckets
```

---

## 🛠️ Local Development Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Configuration:**
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Administrator Studio Credentials

- **Admin Login Route:** `/admin/login`
- **Default Email:** `admin@booksandwisdom.com`
- **Default Password:** `Wisdom#2024`
- *(Configurable in `.env.local` via `ADMIN_EMAIL` and `ADMIN_PASSWORD`)*

---

## 🗄️ Supabase PostgreSQL & Storage Setup

To connect to your live Supabase project:

1. Create a new project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** in your Supabase dashboard.
3. Paste and run the complete migration script located at:
   `supabase/migrations/001_initial_schema.sql`
4. Copy your project URL and keys to `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
5. All published articles, drafts, settings, and media files will automatically sync to your Supabase PostgreSQL database and Storage bucket!

---

## 📦 WordPress Blog Migration

In the Admin Studio, navigate to **Site Settings → WordPress Importer**:
- Paste your WordPress export file (either raw XML `<rss>` export from WordPress Tools → Export, or JSON array of posts from WP REST API `/wp-json/wp/v2/posts`).
- Click **Import WordPress Articles**.
- All titles, content, publication dates, and slugs will be safely preserved.
