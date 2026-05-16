import type { Metadata } from "next";
import { Inter, Courier_Prime } from "next/font/google";
import Providers from "@/providers/Providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const courierPrime = Courier_Prime({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-courier-prime",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VisionDraft — Your Cinematic Second Brain",
  description:
    "AI-powered cinematic workspace for directors, storytellers, and screenwriters. Capture stories before they disappear.",
  keywords: ["screenplay", "screenwriting", "filmmaking", "director", "AI writing", "cinematic workspace"],
  openGraph: {
    title: "VisionDraft — Your Cinematic Second Brain",
    description: "Where scenes become cinema.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${courierPrime.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
