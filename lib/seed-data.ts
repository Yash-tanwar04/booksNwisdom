import { Article, SiteSettings, MediaFile } from '@/types';

export const initialSiteSettings: SiteSettings = {
  site_name: 'Books&Wisdom',
  tagline: 'thoughts for a kinder, brighter you ♡',
  author_name: 'Anjali',
  author_intro: "This is my little corner on the internet where I share my thoughts, experiences and lessons from life. Through my writings, I hope to reflect, grow and maybe connect with someone who feels the same.",
  author_story: "Books&Wisdom was born from a journal, a quiet room, and a desire to make sense of the tender, messy, and beautiful experience of being human. Here, I write about finding peace within ourselves, navigating transitions, embracing our vulnerabilities, and learning to be gentle along the way.",
  author_image_url: '/images/homepage/author-introduction.webp',
  hero_image_url: '/images/homepage/homepage-hero.webp',
  logo_image_url: '/images/logo_3d_emblem.jpg',
  quote_image_url: '/images/homepage/reflection-background.webp',
  not_found_image_url: '/images/errors/404-lost-page.webp',
  author_note: 'Just a girl who loves reading, writing and finding beauty in little things ♡',
  hero_headline: 'Books&Wisdom',
  hero_subheading: 'A space for real thoughts, personal journeys and meaningful reflections on life, growth and everything in between.',
  hero_note: 'Good thoughts, brighter days ♡',
  homepage_quote: 'A little perspective can turn a difficult day into a meaningful one.',
  social_instagram: 'https://instagram.com',
  social_linkedin: 'https://linkedin.com',
  social_email: 'hello@booksandwisdom.com',
  social_twitter: 'https://x.com',
  footer_text: 'A space for real thoughts, personal journeys and meaningful reflections on life, growth and everything in between.',
  footer_signoff: 'Good thoughts, Brighter Days ♡',
  seo_default_title: 'Books&Wisdom — Personal Scrapbook & Writings',
  seo_default_description: 'A space for real thoughts, personal journeys and meaningful reflections on life, growth and everything in between.',
};

export const initialArticles: Article[] = [
  {
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
  },
  {
    id: 'art-001',
    title: 'A Battle Within',
    subtitle: 'Understanding the silent struggles, the unspoken emotions and the journey towards peace with oneself.',
    slug: 'a-battle-within',
    excerpt: 'Sometimes the loudest battles are the ones we fight within ourselves... The battle to understand ourselves, to let go, to forgive, to accept and to move forward.',
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Sometimes the toughest battles are not the ones we fight outside, but the ones within. The battle to understand ourselves, to let go, to forgive, to accept and to move forward.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'As we grow, we lose parts of ourselves, carry regrets, hold grudges and often forget to be grateful for what we have. This is a reflection on those inner battles and the lessons they teach us.',
            },
          ],
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: '1. Lost Element' }],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'There are times when we feel like we’ve lost a part of ourselves. The person we used to feel is unfamiliar, and the things that once brought joy no longer feel the same. We search for that lost spark in familiar places, only to realize that growth often requires shedding versions of ourselves that no longer serve who we are becoming.',
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
                  text: 'Healing begins the moment we choose to be kind to ourselves.',
                },
              ],
            },
          ],
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: '2. Regrets' }],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Regret is a heavy anchor that keeps us tethered to a past we can no longer alter. We replay conversations, choices, and missed opportunities in the quiet hours of the night. But every misstep carried a lesson, and every closed door pointed us toward an unexpected path.',
            },
          ],
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: '3. Grudges' }],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Holding onto resentment is like holding a hot coal with the intent of throwing it at someone else. Forgiveness isn’t about condoning hurtful behavior; it is about freeing our own hearts from the burden of carrying bitterness.',
            },
          ],
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: '4. Ungrateful' }],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'In the constant pursuit of what comes next, we often overlook the sanctuary of the present. Gratitude is not an effortless emotion—it is a conscious discipline of opening our eyes to the quiet blessings that surround us each day.',
            },
          ],
        },
      ],
    },
    cover_image_path: '/images/writings/a-battle-within.webp',
    status: 'published',
    published_at: '2023-11-28T09:00:00Z',
    reading_time_minutes: 5,
    views_count: 0,
    created_at: '2023-11-28T08:00:00Z',
    updated_at: '2023-11-28T09:00:00Z',
    seo_title: 'A Battle Within — Books&Wisdom',
    seo_description: 'Understanding the silent struggles, the unspoken emotions and the journey towards peace with oneself.',
  },
  {
    id: 'art-002',
    title: 'Transformation Phase',
    subtitle: 'Navigating the in-between seasons of life when who we were no longer fits.',
    slug: 'transformation-phase',
    excerpt: 'Change is inevitable, and so is the growth that comes with it. When we stand in the doorway of transformation, discomfort is not failure—it is proof of expansion.',
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Change is inevitable, and so is the growth that comes with it. Standing between who we were and who we are becoming often feels unsettling, but it is precisely in this space of uncertainty where profound transformation takes root.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'We often expect personal evolution to be linear, smooth, and predictable. Yet life teaches us that true expansion is cyclical, requiring patience, gentleness, and an unwavering trust in the unfolding process.',
            },
          ],
        },
      ],
    },
    cover_image_path: '/images/writings/transformation-phase.webp',
    status: 'published',
    published_at: '2023-11-21T09:00:00Z',
    reading_time_minutes: 4,
    views_count: 0,
    created_at: '2023-11-21T08:00:00Z',
    updated_at: '2023-11-21T09:00:00Z',
  },
  {
    id: 'art-003',
    title: 'Be Responsible',
    subtitle: 'Taking ownership of our reactions, our boundaries, and our peace.',
    slug: 'be-responsible',
    excerpt: 'Happiness is not something we stumble upon; it is something we cultivate through daily responsibility and gentle intentionality.',
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Happiness is not something we find; it is something we create. When we stop waiting for external circumstances to align, we reclaim the power to shape our inner peace.',
            },
          ],
        },
      ],
    },
    cover_image_path: '/images/writings/responsibility.webp',
    status: 'published',
    published_at: '2023-11-14T09:00:00Z',
    reading_time_minutes: 3,
    views_count: 0,
    created_at: '2023-11-14T08:00:00Z',
    updated_at: '2023-11-14T09:00:00Z',
  },
  {
    id: 'art-004',
    title: 'Hard Work',
    subtitle: 'The quiet persistence that unfolds when nobody is watching.',
    slug: 'hard-work',
    excerpt: 'Sometimes the things we feel like giving up on are the ones that shape us. True dedication rarely announces itself with noise—it speaks through quiet consistency.',
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Sometimes the things we feel like giving up on are the ones that shape us most deeply. When inspiration fades, commitment is what keeps the flame alive.',
            },
          ],
        },
      ],
    },
    cover_image_path: '/images/writings/perseverance.webp',
    status: 'published',
    published_at: '2023-11-07T09:00:00Z',
    reading_time_minutes: 3,
    views_count: 0,
    created_at: '2023-11-07T08:00:00Z',
    updated_at: '2023-11-07T09:00:00Z',
  },
  {
    id: 'art-005',
    title: 'Celebrate Yourself',
    subtitle: 'Honoring the small milestones and quiet victories that often go unnoticed.',
    slug: 'celebrate-yourself',
    excerpt: 'Happiness is not something to be postponed for the future; it is something you design for the present. Take a moment to honor how much courage it took to reach today.',
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Happiness is not something to be postponed for the future; it is something you design for the present. Honor the silent steps you took when no one was clapping.',
            },
          ],
        },
      ],
    },
    cover_image_path: '/images/writings/celebrate-yourself.webp',
    status: 'published',
    published_at: '2023-10-31T09:00:00Z',
    reading_time_minutes: 4,
    views_count: 0,
    created_at: '2023-10-31T08:00:00Z',
    updated_at: '2023-10-31T09:00:00Z',
  },
  {
    id: 'art-006',
    title: 'Lost Element',
    subtitle: 'Finding our way back to what genuinely matters.',
    slug: 'lost-element',
    excerpt: 'Sometimes the greatest mistake is to forget what we have while we obsess over what we do not. Reconnecting with simplicity brings our spirit home.',
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'There are times when we feel like we’ve lost a part of ourselves. The person we used to be feels unfamiliar, and the things that once brought joy no longer feel the same. Yet this emptiness is often an invitation to rediscover who we truly are.',
            },
          ],
        },
      ],
    },
    cover_image_path: '/images/writings/self-reflection.webp',
    status: 'published',
    published_at: '2023-10-23T09:00:00Z',
    reading_time_minutes: 4,
    views_count: 0,
    created_at: '2023-10-23T08:00:00Z',
    updated_at: '2023-10-23T09:00:00Z',
  },
];

export const CURATED_WRITING_COVERS = [
  { id: 'W01', title: 'Self-Reflection', path: '/images/writings/self-reflection.webp', emotion: 'Introspection & self-awareness' },
  { id: 'W02', title: 'Regret & Choices', path: '/images/writings/regret-and-choices.webp', emotion: 'Looking back & accepting the past' },
  { id: 'W03', title: 'Personal Growth', path: '/images/writings/personal-growth.webp', emotion: 'Gradual growth, patience & renewal' },
  { id: 'W04', title: 'Gratitude', path: '/images/writings/gratitude.webp', emotion: 'Appreciation & small pleasures' },
  { id: 'W05', title: 'Hope', path: '/images/writings/hope.webp', emotion: 'Possibility, renewal & optimism' },
  { id: 'W06', title: 'Emotional Distance', path: '/images/writings/emotional-distance.webp', emotion: 'Distance & things left unsaid' },
  { id: 'W07', title: 'Responsibility', path: '/images/writings/responsibility.webp', emotion: 'Accountability & intentional action' },
  { id: 'W08', title: 'Perseverance', path: '/images/writings/perseverance.webp', emotion: 'Persistence, effort & discipline' },
  { id: 'W09', title: 'Social Perspectives', path: '/images/writings/social-perspectives.webp', emotion: 'Observation & understanding the world' },
  { id: 'W10', title: 'Feeling Unloved', path: '/images/writings/feeling-unloved.webp', emotion: 'Vulnerability & longing for connection' },
  { id: 'W11', title: 'Celebrate Yourself', path: '/images/writings/celebrate-yourself.webp', emotion: 'Self-appreciation & quiet happiness' },
  { id: 'W12', title: 'Life Happened', path: '/images/writings/life-happened.webp', emotion: 'Transitions & accepting change' },
  { id: 'W13', title: 'Inner Conflict', path: '/images/writings/inner-conflict.webp', emotion: 'Contradiction & self-discovery' },
  { id: 'W14', title: 'Letting Go', path: '/images/writings/letting-go.webp', emotion: 'Release, acceptance & emotional freedom' },
  { id: 'W15', title: 'Relationships', path: '/images/writings/relationships.webp', emotion: 'Connection, conversation & understanding' },
  { id: 'W16', title: 'A Battle Within', path: '/images/writings/a-battle-within.webp', emotion: 'Inner struggle & moving forward' },
  { id: 'W17', title: 'Transformation Phase', path: '/images/writings/transformation-phase.webp', emotion: 'New perspectives & becoming' },
  { id: 'W18', title: 'Wisdom & Learning', path: '/images/writings/wisdom-and-learning.webp', emotion: 'Curiosity, study & reflection' },
  { id: 'W19', title: 'A Kinder Perspective', path: '/images/writings/kind-perspective.webp', emotion: 'Empathy, kindness & gentleness' },
  { id: 'W20', title: 'Choices & Uncertainty', path: '/images/writings/choices-and-uncertainty.webp', emotion: 'Diverging paths & possibility' },
];

export const initialMediaFiles: MediaFile[] = [
  {
    id: 'med-001',
    file_path: 'reading_hero_sunset.jpg',
    url: '/images/reading_hero_sunset.jpg',
    filename: 'sunset-reflection.jpg',
    mime_type: 'image/jpeg',
    size_bytes: 145000,
    alt_text: 'Sunset silhouette over mountain horizon',
    created_at: '2023-11-28T08:00:00Z',
  },
  {
    id: 'med-002',
    file_path: 'cover_road.jpg',
    url: '/images/cover_road.jpg',
    filename: 'autumn-road.jpg',
    mime_type: 'image/jpeg',
    size_bytes: 128000,
    alt_text: 'Winding road through autumn trees',
    created_at: '2023-11-21T08:00:00Z',
  },
  {
    id: 'med-003',
    file_path: 'cover_coffee.jpg',
    url: '/images/cover_coffee.jpg',
    filename: 'morning-coffee-journal.jpg',
    mime_type: 'image/jpeg',
    size_bytes: 110000,
    alt_text: 'Coffee and open journal by the window',
    created_at: '2023-11-14T08:00:00Z',
  },
  {
    id: 'med-004',
    file_path: 'cover_candles.jpg',
    url: '/images/cover_candles.jpg',
    filename: 'cozy-desk-lights.jpg',
    mime_type: 'image/jpeg',
    size_bytes: 132000,
    alt_text: 'Cozy writing desk with fairy lights and candles',
    created_at: '2023-11-07T08:00:00Z',
  },
  {
    id: 'med-005',
    file_path: 'author_photo.jpg',
    url: '/images/author_photo.jpg',
    filename: 'anjali-portrait.jpg',
    mime_type: 'image/jpeg',
    size_bytes: 98000,
    alt_text: 'Anjali looking towards the mountains',
    created_at: '2023-10-01T08:00:00Z',
  },
  {
    id: 'med-006',
    file_path: 'hero_polaroid_card.jpg',
    url: '/images/hero_polaroid_card.jpg',
    filename: 'peaceful-view.jpg',
    mime_type: 'image/jpeg',
    size_bytes: 115000,
    alt_text: 'Girl sitting peacefully in nature',
    created_at: '2023-10-05T08:00:00Z',
  },
];
