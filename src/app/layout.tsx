import type { Metadata } from "next";
import "./globals.css";
import { Press_Start_2P } from 'next/font/google';
import { Providers } from './providers'


const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={pressStart2P.className}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
