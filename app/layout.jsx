import './globals.css';
import Script from 'next/script';

export const metadata = {
  title: 'See Your Home Illuminated',
  description: 'Upload a daytime photo of your home and see it lit up at night with professional landscape lighting.',
};

// Nextdoor pixel ID (public — inlined into the browser bundle at build time).
// Set NEXT_PUBLIC_NEXTDOOR_PIXEL_ID in the environment; when absent, the pixel
// is simply not injected so the app still runs (e.g. local dev).
const NEXTDOOR_PIXEL_ID = process.env.NEXT_PUBLIC_NEXTDOOR_PIXEL_ID;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {NEXTDOOR_PIXEL_ID && (
          // Nextdoor's official universal-pixel snippet, verbatim — only the
          // pixel id is parameterized from the env var (do not edit the rest).
          // The Lead conversion is fired from the submit handler in app/page.jsx.
          <Script
            id="nextdoor-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                !function(e,n){var t,p;e.ndp||((t=e.ndp=function(){
                t.handleRequest?t.handleRequest.apply(t,arguments):t.queue.push(arguments)
                }).queue=[],t.v=1,(p=n.createElement(e="script")).async=!0,
                p.src="https://ads.nextdoor.com/public/pixel/ndp.js?id=${NEXTDOOR_PIXEL_ID}",
                (n=n.getElementsByTagName(e)[0]).parentNode.insertBefore(p,n))
                }(window,document);
                ndp('init','${NEXTDOOR_PIXEL_ID}', {});
                ndp('track','PAGE_VIEW');
              `,
            }}
          />
        )}
        {children}
      </body>
    </html>
  );
}
