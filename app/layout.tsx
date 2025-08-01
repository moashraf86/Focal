import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/layout/Footer";
import StoreFeatures from "@/components/shared/StoreFeatures";
import QuickView from "@/components/shared/QuickView";
import Header from "@/components/layout/Header";
import SearchDrawer from "@/components/shared/SearchDrawer";
import { barlow } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Home | Focal Store",
    template: "%s | Focal Store",
  },
  description:
    "An e-commerce store built with Next.js, TailwindCSS, Shadcn/ui and Strapi",
  keywords: [
    "Next.js",
    "E-commerce",
    "Clerk",
    "Shadcn UI",
    "React",
    "Tailwind CSS",
    "Online Store",
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL as string),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl="/sign-in">
      <html lang="en">
        <body className={`${barlow.className} antialiased`}>
          <Header />
          {children}
          <StoreFeatures />
          <Footer />
          <QuickView />
          <Toaster />
          <SearchDrawer />
        </body>
      </html>
    </ClerkProvider>
  );
}
