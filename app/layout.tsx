import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import HideFooterOnAdmin from "@/components/HideFooterOnAdmin";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Doralp - Endüstriyel Çelik Yapı Çözümleri",
  description: "25+ yıllık deneyimle endüstriyel çelik yapı, fabrika inşaatı ve proje yönetimi hizmetleri.",
  keywords: "çelik yapı, endüstriyel inşaat, fabrika, proje yönetimi, doralp",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Navbar />
          <main>{children}</main>
          <HideFooterOnAdmin />
        </ThemeProvider>
      </body>
    </html>
  )
}
