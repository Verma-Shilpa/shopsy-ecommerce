import type { Metadata } from "next";
import { AppBootstrap } from "@/components/layout/AppBootstrap";
import { AppHeader } from "@/components/layout/AppHeader";
import { StoreProvider } from "@/store/StoreProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shopsy",
  description: "A responsive e-commerce product listing application.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <AppBootstrap />
          <AppHeader />
          <main className="app-main">{children}</main>
        </StoreProvider>
      </body>
    </html>
  );
}
