import React from 'react';
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@src/components/ui/toaster";
import './global.css';

export const metadata = {
  title: "VALVOD | #1 Site for VALORANT VOD Review",
  description: "Upgrade your VALORANT VOD review & make your study more efficient.",
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script src='https://www.youtube.com/iframe_api'></script>
      </head>
      <body>
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
