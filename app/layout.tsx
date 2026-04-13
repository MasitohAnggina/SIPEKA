import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}