import type { Metadata, Viewport } from "next";
import { Open_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-open-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: '#C2185B',
};

export const metadata: Metadata = {
  title: "Site Oficial de Reservas - Rosa Mexicano Restaurante",
  description: "Reserve sua mesa para confraternização de final de ano no Rosa Mexicano - Blumenau/SC",
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Rosa Mexicano Reservas',
  },
  formatDetection: {
    telephone: true,
    email: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${openSans.variable} ${playfair.variable} antialiased`} style={{ fontFamily: 'var(--font-open-sans), Arial, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
