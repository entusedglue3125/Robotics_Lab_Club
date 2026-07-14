import type { Metadata } from "next";
import { Inter, Space_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Robotics Lab Club — Build. Innovate. Conquer.",
  description:
    "Robotics Lab Club is an elite robotics and engineering club dedicated to pushing the boundaries of autonomous systems, AI, and competitive robotics. Join us and shape the future.",
  keywords: ["robotics", "Robotics Lab Club", "engineering", "autonomous systems", "AI", "stem", "club"],
  openGraph: {
    title: "Robotics Lab Club",
    description: "Build. Innovate. Conquer.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceMono.variable} h-full`}
    >
      <body className="min-h-full bg-black text-white antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
