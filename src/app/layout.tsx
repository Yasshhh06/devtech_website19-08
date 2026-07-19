import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevTech IT Solution | Your Vision. Our Tech.",
  description: "DevTech IT Solution is a premium IT consulting and software development company providing world-class tech solutions to global businesses, startups, and enterprises.",
};

import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import PremiumLoader from "@/components/Loader";
import GlobalFeatures from "@/components/GlobalFeatures";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plusJakarta.variable} antialiased`}
    >
      <body className="flex flex-col font-sans bg-background text-foreground min-h-screen">
        <SmoothScrollProvider>
          <GlobalFeatures />
          <PremiumLoader />
          {children}
        </SmoothScrollProvider>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
