import type { Metadata } from "next";
import { Oswald, Roboto } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Maurice Nontondji — Expert LinkedIn & Stratégie Digitale",
  description:
    "Consultant en marketing LinkedIn. J'aide les entrepreneurs et personnalités à développer leur personal branding et leur visibilité sur LinkedIn pour générer des opportunités business.",
  keywords: [
    "LinkedIn",
    "marketing",
    "personal branding",
    "réseaux sociaux",
    "stratégie digitale",
    "Maurice Nontondji",
  ],
  authors: [{ name: "Maurice Nontondji" }],
  openGraph: {
    title: "Maurice Nontondji — Expert LinkedIn & Stratégie Digitale",
    description:
      "Consultant en marketing LinkedIn. Développez votre visibilité et générez des opportunités business.",
    siteName: "Maurice Nontondji",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${oswald.variable} ${roboto.variable} antialiased`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}