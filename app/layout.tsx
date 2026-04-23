import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DiveMix - Gas & Compressor Technologies",
  description:
    "Leading the industry in compressed air and gas solutions since 1990",
  icons: {
    icon: "/img/faveicon.ico",
  },
};

// Single document root. Locale-specific `lang` / `dir` on `<html>` is updated
// client-side from `app/[locale]/layout.tsx` via `SetHtmlDocument`.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
