import React from 'react';
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Toaster } from "@src/components/ui/toaster";
import './global.css';

export const metadata = {
  title: "VALVOD | #1 Site for VALORANT VOD Review",
  description: "Find the most useful VALORANT VODs quickly & make your study more efficient.",
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {/* google adsense */}
        {/* <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1274565998932925" crossOrigin="anonymous"></script> */}
        <script src='https://www.youtube.com/iframe_api'></script>
      </head>
      <body>
        {children}
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
