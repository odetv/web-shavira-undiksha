"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import SplashScreen from "@/components/SplashScreen";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isLoading, setIsLoading] = useState(isHome);
  useEffect(() => {
    if (isLoading) return;
  }, [isLoading]);

  return (
    <html lang="en">
      <meta name="viewport" content="initial-scale=1, width=device-width" />
      <body className={inter.className}>
        {isLoading && isHome ? (
          <SplashScreen finishLoading={() => setIsLoading(false)} />
        ) : (
          <Providers>
            <Header />
            {children}
            <Footer />
          </Providers>
        )}
      </body>
    </html>
  );
}
