import React from "react";
import { ClerkProvider } from "@clerk/nextjs";

import "../globals.css";

export const metadata = {
  title: "TrickTrove",
  description: "A Next.js 13 Saketboard Social Application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <section className="main-container">
            <div className="w-full max-w-4xl flex justify-center align-center">
              {children}
            </div>
          </section>
        </body>
      </html>
    </ClerkProvider>
  );
}
