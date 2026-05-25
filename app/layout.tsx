import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ImageCraft",
  description:
    "Client-side image compression, cropping, and SVG placeholder generation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans`}>
        <Navbar/>
        <main className="min-h-screen pt-14 pb-20 pl-0 lg:pt-0 lg:pb-0 lg:pl-64">
          <div className="px-4 py-6 md:px-8 md:py-10 lg:px-10">
            {children}
          </div>
        </main>
        <Footer/>
      </body>
    </html>
    </ClerkProvider>
  );
}
