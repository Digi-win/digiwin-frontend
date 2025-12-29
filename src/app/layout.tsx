import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-geist-sans" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: "DigiWin - Decentralized Number Guessing Game",
  description: "Create games, make guesses, and win prizes on Stacks blockchain.",
};

import { Providers } from "@/components/Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${spaceGrotesk.variable} antialiased min-h-screen`}>
        <Providers>
          <Navbar />
          {children}
          
          {/* Footer */}
          <footer className="py-8 text-center text-gray-500 text-sm glass mt-20 border-t border-white/5">
            <p>© 2024 DigiWin. Built on Stacks.</p>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
