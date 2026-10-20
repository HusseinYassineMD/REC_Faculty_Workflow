import type { Metadata } from "next";
import { Playfair_Display, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const source = Source_Sans_3({ subsets: ["latin"], variable: "--font-source" });
const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "REC Faculty & RPPR Workflow | USC ADRC",
  description:
    "Dashboard and intake forms for REC scholars, faculty, training programs, and NACC RPPR reporting.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${source.variable} ${display.variable} font-sans`}>{children}</body>
    </html>
  );
}
