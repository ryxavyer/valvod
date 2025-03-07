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
