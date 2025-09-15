import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap stilleri
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Todo App',
  description: 'Next.js + React-Bootstrap',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
