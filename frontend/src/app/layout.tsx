import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import AppProviders from "@/providers/AppProviders";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Promage - Admin Dashboard",
  description: "High-End E-commerce Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <head>
        {/* Inline script to prevent theme/brand flashing before hydration completes */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const saved = localStorage.getItem('brand-color') || 'zinc';
                document.documentElement.setAttribute('data-brand', saved);
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        className={`${geist.variable} font-sans antialiased bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50`}
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
