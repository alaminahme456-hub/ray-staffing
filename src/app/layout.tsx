import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SupabaseAuthProvider } from "@/lib/supabase/auth-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RAY Staffing Consulting Ltd | Quality Housing, HR & Talent",
  description: "RAY Staffing Consulting Ltd delivers quality, safe and compliant housing, comprehensive HR consultancy for SMEs, and specialist talent placement services across the UK.",
  keywords: ["RAY Staffing", "housing services UK", "HR consultancy", "recruitment UK", "healthcare staffing", "NHS recruitment", "UK employment law"],
  authors: [{ name: "RAY Staffing Consulting Ltd" }],
  icons: {
    icon: "/images/logo.jpg",
  },
  openGraph: {
    title: "RAY Staffing Consulting Ltd",
    description: "Quality Housing. Smarter HR. Exceptional Talent. Professional services across the United Kingdom.",
    type: "website",
    siteName: "RAY Staffing Consulting Ltd",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <SupabaseAuthProvider>
          {children}
          <Toaster position="top-right" richColors />
        </SupabaseAuthProvider>
      </body>
    </html>
  );
}