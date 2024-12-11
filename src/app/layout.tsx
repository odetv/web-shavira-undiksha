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
import Copyright from "@/components/Copyright";

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
      <title>Shavira Undiksha</title>
      <meta name="description" content="Shavira Undiksha" />
      <meta name="keywords" content="shavira, helpdesk, undiksha" />
      <meta property="og:title" content="Shavira Undiksha" />
      <meta property="og:description" content="Shavira Undiksha" />
      <meta name="viewport" content="initial-scale=1, width=device-width" />
      <body className={inter.className}>
        {isLoading && isHome ? (
          <SplashScreen finishLoading={() => setIsLoading(false)} />
        ) : (
          <Providers>
            <Header />
            {children}
            <Copyright />
            {/* <Footer /> */}
          </Providers>
        )}
      </body>
    </html>
  );
}
