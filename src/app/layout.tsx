import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/src/components/layout/navbar";
import Footer from "@/src/components/layout/footer";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Planora",
  description:
    "Plan, join, and manage events with complete workflow including invitations, payments, and reviews.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-slate-50 text-slate-950">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      </body>
    </html>
  );
}