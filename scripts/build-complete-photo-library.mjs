import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const BRAIN_DIR = 'C:\\Users\\Yash\\.gemini\\antigravity\\brain\\8e63abe5-b66c-4929-805e-87d92caa14b8';
const PUBLIC_IMAGES = path.join(process.cwd(), 'public', 'images');
const PUBLIC_UPLOADS = path.join(process.cwd(), 'public', 'uploads');

// 1. Direct AI-generated bespoke editorial photographs already in workspace
const localAiMappings = [
  // Homepage
  {
    src: path.join(PUBLIC_UPLOADS, '1792681169420-Sunset_Journalling_by_the_Window.png'),
    dest: path.join(PUBLIC_IMAGES, 'homepage', 'homepage-hero.webp'),
    width: 1800,
    height: 1200,
  },
  {
    src: path.join(BRAIN_DIR, 'embracing_the_slow_days_cover_png_1792680404691.jpg'),
    dest: path.join(PUBLIC_IMAGES, 'homepage', 'featured-writing.webp'),
    width: 1200,
    height: 800,
  },
  {
    src: path.join(BRAIN_DIR, 'reflection_background_editorial_1793258353723.jpg'),
    dest: path.join(PUBLIC_IMAGES, 'homepage', 'reflection-background.webp'),
    width: 1800,
    height: 1200,
  },

  // Writings (AI Generated)
  {
    src: path.join(BRAIN_DIR, 'self_reflection_w01_1793258505344.jpg'),
    dest: path.join(PUBLIC_IMAGES, 'writings', 'self-reflection.webp'),
    width: 1200,
    height: 800,
  },
  {
    src: path.join(BRAIN_DIR, 'regret_and_choices_w02_1793258531330.jpg'),
    dest: path.join(PUBLIC_IMAGES, 'writings', 'regret-and-choices.webp'),
    width: 1200,
    height: 800,
  },
  {
    src: path.join(BRAIN_DIR, 'hope_w05_1793258508624.jpg'),
    dest: path.join(PUBLIC_IMAGES, 'writings', 'hope.webp'),
    width: 1200,
    height: 800,
  },
  {
    src: path.join(BRAIN_DIR, 'responsibility_editorial_1793258349810.jpg'),
    dest: path.join(PUBLIC_IMAGES, 'writings', 'responsibility.webp'),
    width: 1200,
    height: 800,
  },
  {
    src: path.join(BRAIN_DIR, 'perseverance_editorial_1793258371957.jpg'),
    dest: path.join(PUBLIC_IMAGES, 'writings', 'perseverance.webp'),
    width: 1200,
    height: 800,
  },
  {
    src: path.join(BRAIN_DIR, 'celebrate_yourself_editorial_1793258349623.jpg'),
    dest: path.join(PUBLIC_IMAGES, 'writings', 'celebrate-yourself.webp'),
    width: 1200,
    height: 800,
  },
  {
    src: path.join(BRAIN_DIR, 'a_battle_within_editorial_1793258343415.jpg'),
    dest: path.join(PUBLIC_IMAGES, 'writings', 'a-battle-within.webp'),
    width: 1200,
    height: 800,
  },
  {
    src: path.join(BRAIN_DIR, 'transformation_phase_editorial_1793258364734.jpg'),
    dest: path.join(PUBLIC_IMAGES, 'writings', 'transformation-phase.webp'),
    width: 1200,
    height: 800,
  },
  {
    src: path.join(BRAIN_DIR, 'wisdom_and_learning_w18_1793258517685.jpg'),
    dest: path.join(PUBLIC_IMAGES, 'writings', 'wisdom-and-learning.webp'),
    width: 1200,
    height: 800,
  },

  // About & Errors (AI Generated)
  {
    src: path.join(BRAIN_DIR, 'writing_process_editorial_1793258372888.jpg'),
    dest: path.join(PUBLIC_IMAGES, 'about', 'writing-process.webp'),
    width: 1200,
    height: 800,
  },
  {
    src: path.join(BRAIN_DIR, 'lost_page_404_editorial_1793258380068.jpg'),
    dest: path.join(PUBLIC_IMAGES, 'errors', '404-lost-page.webp'),
    width: 1200,
    height: 800,
  },
];

// 2. Curated editorial photography for the remaining specific scenes, color-graded to match Kodak Portra warm scrapbook palette
const curatedRemoteMappings = [
  // H04: author-introduction.webp (Intimate photograph of a writing desk, an open book, a journal, and natural light)
  {
    url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1400&q=85',
    dest: path.join(PUBLIC_IMAGES, 'homepage', 'author-introduction.webp'),
    width: 1200,
    height: 800,
  },
  // A01: about-hero.webp (Quiet, personal scene of a journal, books, flowers, and sunlight near a window)
  {
    url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1800&q=85',
    dest: path.join(PUBLIC_IMAGES, 'about', 'about-hero.webp'),
    width: 1800,
    height: 1200,
  },
  // A03: personal-inspiration.webp (Nostalgic arrangement of books, dried flowers, photographs, and a journal)
  {
    url: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=1400&q=85',
    dest: path.join(PUBLIC_IMAGES, 'about', 'personal-inspiration.webp'),
    width: 1200,
    height: 800,
  },
  // Admin Welcome: admin-welcome.webp (Subtle wide image of a warm writing desk)
  {
    url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1600&q=85',
    dest: path.join(PUBLIC_IMAGES, 'admin', 'admin-welcome.webp'),
    width: 1600,
    height: 500,
  },
  // W03: personal-growth.webp (A small green plant growing toward sunlight beside an open book and a notebook)
  {
    url: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1200&q=85',
    dest: path.join(PUBLIC_IMAGES, 'writings', 'personal-growth.webp'),
    width: 1200,
    height: 800,
  },
  // W04: gratitude.webp (Morning sunlight falling across a simple breakfast, a journal, and a vase of small flowers)
  {
    url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=85',
    dest: path.join(PUBLIC_IMAGES, 'writings', 'gratitude.webp'),
    width: 1200,
    height: 800,
  },
  // W06: emotional-distance.webp (Two empty chairs near a window, with late-afternoon light falling between them)
  {
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85',
    dest: path.join(PUBLIC_IMAGES, 'writings', 'emotional-distance.webp'),
    width: 1200,
    height: 800,
  },
  // W09: social-perspectives.webp (A person looking out at a city from a quiet balcony or window, with the city softly blurred)
  {
    url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=85',
    dest: path.join(PUBLIC_IMAGES, 'writings', 'social-perspectives.webp'),
    width: 1200,
    height: 800,
  },
  // W10: feeling-unloved.webp (A quiet bedroom corner with an empty chair, soft window light, a closed journal, and muted flowers)
  {
    url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=85',
    dest: path.join(PUBLIC_IMAGES, 'writings', 'feeling-unloved.webp'),
    width: 1200,
    height: 800,
  },
  // W12: life-happened.webp (A train window overlooking a changing landscape, with warm light reflecting across the glass)
  {
    url: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1200&q=85',
    dest: path.join(PUBLIC_IMAGES, 'writings', 'life-happened.webp'),
    width: 1200,
    height: 800,
  },
  // W13: inner-conflict.webp (A person standing between light and shadow near a window, photographed from behind)
  {
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=85',
    dest: path.join(PUBLIC_IMAGES, 'writings', 'inner-conflict.webp'),
    width: 1200,
    height: 800,
  },
  // W14: letting-go.webp (A dried leaf drifting across a still pond or resting on calm water, with muted reflections)
  {
    url: 'https://images.unsplash.com/photo-1507041957456-9c397ce39c97?auto=format&fit=crop&w=1200&q=85',
    dest: path.join(PUBLIC_IMAGES, 'writings', 'letting-go.webp'),
    width: 1200,
    height: 800,
  },
  // W15: relationships.webp (Two cups of tea on a table near a window, with a shared book and soft afternoon light)
  {
    url: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1200&q=85',
    dest: path.join(PUBLIC_IMAGES, 'writings', 'relationships.webp'),
    width: 1200,
    height: 800,
  },
  // W19: kind-perspective.webp (Sunlight falling across a quiet garden bench, with delicate flowers and softly blurred greenery)
  {
    url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=85',
    dest: path.join(PUBLIC_IMAGES, 'writings', 'kind-perspective.webp'),
    width: 1200,
    height: 800,
  },
  // W20: choices-and-uncertainty.webp (A quiet pathway splitting into two directions in a peaceful natural setting)
  {
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=85',
    dest: path.join(PUBLIC_IMAGES, 'writings', 'choices-and-uncertainty.webp'),
    width: 1200,
    height: 800,
  },
];

async function processLocalAiMappings() {
  for (const item of localAiMappings) {
    if (!fs.existsSync(item.src)) {
      console.error('Missing local AI source:', item.src);
      continue;
    }
    await sharp(item.src)
      .resize(item.width, item.height, { fit: 'cover', position: 'centre' })
      .webp({ quality: 86 })
      .toFile(item.dest);
    console.log('Converted AI Asset ->', path.relative(process.cwd(), item.dest));
  }
}

async function processRemoteCuratedMappings() {
  for (const item of curatedRemoteMappings) {
    try {
      const res = await fetch(item.url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const arrayBuf = await res.arrayBuffer();
      const inputBuf = Buffer.from(arrayBuf);

      // Warm golden-hour film color grading overlay (#FBF3EA / #D8A5A0 subtle warm film tone)
      const warmOverlay = Buffer.from(
        `<svg width="${item.width}" height="${item.height}">
          <rect width="100%" height="100%" fill="#FBF3EA" fill-opacity="0.12"/>
          <rect width="100%" height="100%" fill="#D8A5A0" fill-opacity="0.08"/>
        </svg>`
      );

      await sharp(inputBuf)
        .resize(item.width, item.height, { fit: 'cover', position: 'centre' })
        .modulate({ saturation: 0.86, brightness: 1.02 })
        .composite([{ input: warmOverlay, blend: 'soft-light' }])
        .webp({ quality: 85 })
        .toFile(item.dest);

      console.log('Fetched & Color-Graded ->', path.relative(process.cwd(), item.dest));
    } catch (err) {
      console.error('Fallback needed for:', item.dest, err.message);
      // Fallback to local warm AI image with slight crop variation if offline
      const fallbackSrc = path.join(BRAIN_DIR, 'embracing_the_slow_days_cover_png_1792680404691.jpg');
      await sharp(fallbackSrc)
        .resize(item.width, item.height, { fit: 'cover' })
        .webp({ quality: 85 })
        .toFile(item.dest);
    }
  }
}

await processLocalAiMappings();
await processRemoteCuratedMappings();
console.log('All photographic WebP assets generated!');
