
import { Toaster } from 'sonner';
import { ConvexClientProvider } from "@/provider/convex-provider";
import { ThemeProvider } from "@/provider/theme-provider";
import SettingsProvider from '@/provider/settings-provider';
import { EdgeStoreProvider } from '@/lib/edgestore';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";


const font = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "Imran | Notion",
  description: "convert your ultimate thinking into code",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/logo.svg",
        href: "/logo.svg",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/logo-dark.svg",
        href: "/logo-dark.svg",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={font.className}>
        <ConvexClientProvider>
          <EdgeStoreProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Toaster position="bottom-center" />
              <SettingsProvider />
              {children}
            </ThemeProvider>
          </EdgeStoreProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
