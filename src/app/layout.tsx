import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "../styles/globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingContactStack from "@/components/contact/FloatingContactStack";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | AFTAZA PLC",
    default: "Real Estate Transaction Advisory & Commercialization Firm in Ethiopia | AFTAZA PLC",
  },
  description:
    "AFTAZA PLC is Ethiopia's structured Real Estate Transaction Advisory & Commercialization firm. We design risk-reduced buying journeys, developer sales systems, and investor-ready documentation.",
  metadataBase: new URL("https://aftazaplc.com"),
  openGraph: {
    title: "AFTAZA PLC",
    description: "Ethiopia's structured Real Estate Transaction Advisory & Commercialization firm",
    url: "https://aftazaplc.com",
    siteName: "AFTAZA PLC",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={sora.variable}>
      <body className="font-sans antialiased">
        <Header />
        <main className="min-h-screen">{children}</main>
        <FloatingContactStack />
        <Footer />
      </body>
    </html>
  );
}
