import type { Metadata } from "next";
import "./globals.css";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "SIPEKA",
  description: "Sistem Informasi Pemilik Hewan Peliharaan",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </body>
    </html>
  );
}