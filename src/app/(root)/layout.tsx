import "@/styles/globals.css";
import "@/styles/scrollbar.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";

import Footer from "../../components/Footer";
import { Providers } from "@/providers";
import { APP_CONFIG } from "@/config/app";
import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/NavBar";

export const metadata: Metadata = {
  title: {
    default: APP_CONFIG.name,
    template: `%s - ${APP_CONFIG.name}`,
  },
  description: APP_CONFIG.description,
  metadataBase: new URL("https://prepilo.com"),
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: APP_CONFIG.og,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning lang="en">
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "system" }}>
          <div className="relative flex flex-col min-h-screen">
            <div className="container mx-auto px-4">
              <Navbar />
            </div>
            <main className="flex-grow container mx-auto px-4">{children}</main>
            <div className="container mx-auto px-4">
              <Footer />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
