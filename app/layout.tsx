import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ShareSphere — Give what you can. Reach who needs it.",
  description:
    "A smart donation management and distribution platform connecting donors with NGOs based on real-time requirements. Powered 100% by transparent mathematical optimization algorithms.",
  keywords: [
    "donation management",
    "NGO requirements",
    "smart donation allocation",
    "verified impact",
    "social impact platform",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}

