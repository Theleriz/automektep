import type { Metadata, Viewport } from 'next';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://automektep.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'AutoMektep — Алматыдағы автомектеп: A, B, C санаттары',
    template: '%s — AutoMektep',
  },
  description:
    'AutoMektep — Алматыдағы автомектеп. Теория, практика және емтиханға дайындық бір жерде: бағалар, нұсқаушылар, оқу көліктері, онлайн тесттер және оқушының жеке кабинеті.',
  keywords: [
    'автомектеп', 'Алматы', 'жүргізуші куәлігі', 'автошкола', 'B санаты', 'A санаты',
    'C санаты', 'теория', 'практика', 'емтихан', 'AutoMektep',
  ],
  applicationName: 'AutoMektep',
  authors: [{ name: 'AutoMektep' }],
  creator: 'AutoMektep',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'kk_KZ',
    url: siteUrl,
    siteName: 'AutoMektep',
    title: 'AutoMektep — автомектепті басқару жүйесі',
    description:
      'Теория, практика, емтихандар және төлемдер — оқушының жеке кабинетінде. A–D санаттары, нұсқаушылар, оқу көліктері және бағалар.',
    images: [{ url: '/og.svg', width: 1200, height: 630, alt: 'AutoMektep автомектебі' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AutoMektep — автомектепті басқару жүйесі',
    description: 'Теория, практика, емтихандар және төлемдер — оқушының жеке кабинетінде.',
    images: ['/og.svg'],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/favicon.svg' }],
  },
  manifest: '/manifest.webmanifest',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F4F6FB' },
    { media: '(prefers-color-scheme: dark)', color: '#0F1524' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="kk">
      <head>
        <link rel="preload" href="/fonts/inter-cyrillic.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/inter-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          // Автомектеп туралы құрылымдалған деректер (Google іздеуі үшін)
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'DrivingSchool',
              name: 'AutoMektep',
              alternateName: 'AutoMektep автомектебі',
              description:
                'Алматыдағы автомектеп: A, B, C және басқа санаттар бойынша теория мен практика, онлайн тесттер, оқушының жеке кабинеті.',
              url: siteUrl,
              image: `${siteUrl}/og.svg`,
              logo: `${siteUrl}/favicon.svg`,
              telephone: '+77078985244',
              priceRange: '35 000 ₸ – 95 000 ₸',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Алматы',
                addressCountry: 'KZ',
              },
              openingHoursSpecification: [
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                  opens: '09:00',
                  closes: '19:00',
                },
              ],
              areaServed: 'Алматы',
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
