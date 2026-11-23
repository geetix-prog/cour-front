import type { Metadata } from "next";
import { logout } from "@/lib/actions/auth";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const jetbrainsMono = JetBrains_Mono({subsets:['latin'],variable:'--font-mono'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cour",
  description: "Pose des drops sur la carte et découvre ceux des autres.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-mono", jetbrainsMono.variable)} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans">
        <header>
          <form action={logout}>
            <button type="submit">Logout</button>
          </form>
        </header>
        {children}
      </body>
    </html>
  );
}
