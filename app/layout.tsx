import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/Redux/Provider";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import AuthHydrator from "@/app/components/AuthHydrator";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Store",
  description: "E-commerce store built with Next.js and Redux Toolkit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ReduxProvider>
          <AuthHydrator />
          <Suspense>
            <Header />
          </Suspense>
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}