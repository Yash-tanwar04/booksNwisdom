import type { Metadata } from 'next';
import { Playfair_Display, DM_Sans, Caveat } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { Navbar } from '@/components/navigation/Navbar';
import { Footer } from '@/components/navigation/Footer';

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans',
});

const caveat = Caveat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-caveat',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'Books&Wisdom — Personal Scrapbook & Writings',
  description: 'A space for real thoughts, personal journeys and meaningful reflections on life, growth and everything in between.',
  icons: {
    icon: '/images/favicon_circle.png',
    apple: '/images/app_icon.png',
  },
  alternates: {
    types: {
      'application/rss+xml': '/rss.xml',
    },
  },
  openGraph: {
    title: 'Books&Wisdom — Personal Scrapbook & Writings',
    description: 'A space for real thoughts, personal journeys and meaningful reflections on life, growth and everything in between.',
    images: ['/images/banner_polaroid_tape.png'],
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${playfair.variable} ${dmSans.variable} ${caveat.variable}`}>
      <body className="min-h-screen flex flex-col font-sans antialiased selection:bg-rose-dusty/40 selection:text-brown-deep">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
