import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://kitty.miithii.com'),
  title: "meow meow - desi billi 🐱",
  description: "Chat with Desi Billi, your friendly and flirty AI companion who brings joy and laughter to your conversations. Experience the purr-fect blend of wit, charm, and personality!",
  keywords: ["AI companion", "chat bot", "desi billi", "virtual friend", "AI chat"],
  authors: [{ name: "Desi Billi Team" }],
  openGraph: {
    title: "meow meow - desi billi 🐱",
    description: "Chat with Desi Billi, your friendly and flirty AI companion who brings joy and laughter to your conversations. Experience the purr-fect blend of wit, charm, and personality!",
    type: "website",
    url: "https://kitty.miithii.com",
    images: [
      {
        url: "/og-image.jpg", // You'll need to add this image to your public folder
        width: 1200,
        height: 630,
        alt: "meow meow - desi billi 🐱",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "meow meow - desi billi 🐱",
    description: "Chat with Desi Billi, your friendly and flirty AI companion who brings joy and laughter to your conversations. Experience the purr-fect blend of wit, charm, and personality!",
    images: ["/og-image.jpg"], // Same image as OpenGraph
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
