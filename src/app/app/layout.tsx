import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import { Providers } from "@/providers";
import { fontSans } from "@/config/fonts";
import { ThemeProvider } from "next-themes";
import { AppLayout } from "@/components/AppLayout";

export const metadata: Metadata = {
  title: "App - Prepilo",
  description: "Your interview preparation app",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className={clsx(fontSans.className)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Providers>
            <AppLayout>
              {children}
            </AppLayout>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
} 