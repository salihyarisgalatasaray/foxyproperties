import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { RouteTransition } from "../components/site/RouteTransition";
import { ScrollReveal } from "../components/site/ScrollReveal";
import { LanguageProvider } from "../components/i18n/language";
import { LANG_COOKIE, type Lang } from "../lib/i18n";
const inter = Inter({ subsets:["latin"], variable:"--font-inter" });
const playfair = Playfair_Display({ subsets:["latin"], variable:"--font-display" });
export const metadata: Metadata = { title:"FOXY PROPERTY INVESTORS LTD", description:"London property. Strategic investment. Long-term thinking." };
export default async function RootLayout({children}:{children:React.ReactNode}) {
  const lang: Lang = (await cookies()).get(LANG_COOKIE)?.value === "tr" ? "tr" : "en";
  return <html lang={lang}><body className={`${inter.variable} ${playfair.variable}`}><LanguageProvider lang={lang}><RouteTransition>{children}</RouteTransition><ScrollReveal/></LanguageProvider></body></html>;
}
