import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import { ThemeProvider } from "next-themes";

import { Providers } from "@/providers";
import { fontSans } from "@/config/fonts";
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <body className={clsx(fontSans.className)}>
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <AppLayout>{children}</AppLayout>
        </Providers>
      </body>
    </html>
  );
}
