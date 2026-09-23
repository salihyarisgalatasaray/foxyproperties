import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { RouteTransition } from "../components/site/RouteTransition";
import { ScrollReveal } from "../components/site/ScrollReveal";
const inter = Inter({ subsets:["latin"], variable:"--font-inter" });
const playfair = Playfair_Display({ subsets:["latin"], variable:"--font-display" });
export const metadata: Metadata = { title:"FOXY PROPERTY INVESTORS LTD", description:"London property. Strategic investment. Long-term thinking." };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en"><body className={`${inter.variable} ${playfair.variable}`}><RouteTransition>{children}</RouteTransition><ScrollReveal/></body></html>; }
