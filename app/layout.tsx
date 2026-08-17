import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://careertransformer.in"),
  title: {
    default: "Career Transformer | Data Analytics Career Program",
    template: "%s | Career Transformer",
  },
  description:
    "Transform Your Skills. Build Your Career. Master Excel, SQL, Power BI, Tableau, Python, and Statistics through practical projects, portfolio building, and personalized career mentorship.",
  keywords: [
    "Data Analytics Course",
    "SQL for Analytics",
    "Power BI Certification",
    "Tableau Training",
    "Python Data Analysis",
    "Business Analyst Career",
    "Data Analytics Portfolio",
    "Career Transformer",
  ],
  authors: [{ name: "Career Transformer Academic Faculty" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://careertransformer.in",
    title: "Career Transformer | Data Analytics Career Program",
    description:
      "Transform Your Skills. Build Your Career. Master Excel, SQL, Power BI, Tableau, Python, and Statistics with 6 industry portfolio projects.",
    siteName: "Career Transformer",
  },
  twitter: {
    card: "summary_large_image",
    title: "Career Transformer | Data Analytics Career Program",
    description:
      "Transform Your Skills. Build Your Career. 16-Week hands-on data analytics cohort with verified mentor code reviews.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Career Transformer",
    url: "https://careertransformer.in",
    logo: "https://careertransformer.in/logos/logo.png",
    description:
      "A structured career transformation platform providing Data Analytics, SQL, Power BI, and Python training with portfolio builds.",
    sameAs: [],
  };

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#06101D] text-[#F5F8FC]">
        {children}
        {/* Razorpay Checkout Script */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
