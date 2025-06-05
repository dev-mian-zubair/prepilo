import "@/styles/globals.css";
import { Metadata } from "next";
import clsx from "clsx";

import { Providers } from "@/providers";
import { fontSans } from "@/config/fonts";
import { AppLayout } from "@/components/AppLayout";
import { APP_CONFIG } from "@/config/app";

export const metadata: Metadata = {
  title: `App - ${APP_CONFIG.name}`,
  description: APP_CONFIG.description,
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
