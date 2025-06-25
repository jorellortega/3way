import type React from "react"
import { Inter } from "next/font/google"
import Link from "next/link"
import { Bell, Menu, Search, ShoppingCart, User } from "lucide-react"
import { createContext, useContext, useState, ReactNode } from "react"
import "./globals.css"
import { Suspense } from "react"
import { CartProvider } from "./cart-context"
import NavBar from "@/components/NavBar"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Paradise Baddies",
  description: "Premium digital content marketplace for pictures and videos",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} text-white min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <CartProvider>
            <div className="relative flex min-h-screen flex-col">
              {/* Gradient background wrapper */}
              <div className="absolute inset-0 -z-10 w-full h-full bg-gradient-to-br from-paradisePink via-paradiseGold to-paradiseWhite" />
              <NavBar />
              <div className="w-full bg-black/85 text-white text-center py-2 font-medium">
                Under Development - Coming Soon
                </div>
              <main className="flex-1">
                <Suspense>{children}</Suspense>
              </main>
              <footer className="border-t border-purple-900/40 bg-gray-950 py-6">
                <div className="container flex flex-col items-center justify-between gap-4 px-4 text-center md:flex-row md:px-6 md:text-left">
                  <div className="flex flex-col items-center gap-4 md:flex-row">
                    <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                      <span className="text-paradiseGold">Paradise</span><span className="text-paradisePink">Baddies</span>
                    </Link>
                    <p className="text-sm text-gray-400">© 2024 Paradise Baddies. All rights reserved.</p>
                  </div>
                  <nav className="flex gap-4 sm:gap-6">
                    <Link className="text-sm hover:underline" href="/terms">
                      Terms
                    </Link>
                    <Link className="text-sm hover:underline" href="/privacy">
                      Privacy
                    </Link>
                    <Link className="text-sm hover:underline" href="/contact">
                      Contact
                    </Link>
                  </nav>
                </div>
              </footer>
            </div>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
