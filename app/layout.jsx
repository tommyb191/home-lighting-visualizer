import './globals.css';

export const metadata = {
  title: 'See Your Home Illuminated',
  description: 'Upload a daytime photo of your home and see it lit up at night with professional landscape lighting.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
