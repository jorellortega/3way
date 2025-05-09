import type React from "react"
import { Inter } from "next/font/google"
import Link from "next/link"
import { Bell, Menu, Search, ShoppingCart, User } from "lucide-react"

import { ThemeProvider } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import "./globals.css"
import { Suspense } from "react"

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
      <body className={`${inter.className} bg-gray-950 text-white`}>
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
          <div className="relative flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 w-full border-b border-purple-900/40 bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-gray-950/60">
              <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-2 md:gap-4">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="md:hidden border-purple-700 bg-gray-900 text-purple-200 hover:bg-purple-900/50 hover:text-white"
                      >
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] sm:w-[400px] border-purple-700 bg-gray-950">
                      <nav className="grid gap-6 text-lg font-medium">
                        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                          <span className="text-paradiseGold">Paradise</span><span className="text-paradisePink">Baddies</span>
                        </Link>
                        <Link href="/" className="text-purple-200 hover:text-purple-400">
                          Home
                        </Link>
                        <Link href="/browse" className="text-purple-200 hover:text-purple-400">
                          Browse
                        </Link>
                        <Link href="/creators" className="text-purple-200 hover:text-purple-400">
                          Creators
                        </Link>
                        <Link href="/subscriptions" className="text-purple-200 hover:text-purple-400">
                          Subscriptions
                        </Link>
                        <Link href="/packages" className="text-purple-200 hover:text-purple-400">
                          Packages
                        </Link>
                      </nav>
                    </SheetContent>
                  </Sheet>
                  <Link href="/" className="flex items-center gap-2 text-lg font-semibold md:text-2xl">
                    <span className="text-paradiseGold">Paradise</span><span className="text-paradisePink">Baddies</span>
                  </Link>
                  <nav className="hidden gap-6 md:flex">
                    <Link href="/" className="text-sm font-medium text-purple-200 hover:text-purple-400">
                      Home
                    </Link>
                    <Link href="/browse" className="text-sm font-medium text-purple-200 hover:text-purple-400">
                      Browse
                    </Link>
                    <Link href="/creators" className="text-sm font-medium text-purple-200 hover:text-purple-400">
                      Creators
                    </Link>
                    <Link href="/subscriptions" className="text-sm font-medium text-purple-200 hover:text-purple-400">
                      Subscriptions
                    </Link>
                    <Link href="/packages" className="text-sm font-medium text-purple-200 hover:text-purple-400">
                      Packages
                    </Link>
                  </nav>
                </div>
                <div className="hidden flex-1 items-center justify-end md:flex">
                  <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-blue-300" />
                    <Input
                      type="search"
                      placeholder="Search content..."
                      className="w-full rounded-full bg-gray-900 border-blue-700 pl-8 text-blue-200 md:w-[300px] lg:w-[400px] focus-visible:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hidden md:flex text-purple-200 hover:bg-purple-900/50 hover:text-white"
                  >
                    <Search className="h-5 w-5" />
                    <span className="sr-only">Search</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-purple-200 hover:bg-purple-900/50 hover:text-white"
                  >
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Notifications</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-purple-200 hover:bg-purple-900/50 hover:text-white"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span className="sr-only">Cart</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-purple-200 hover:bg-purple-900/50 hover:text-white"
                  >
                    <User className="h-5 w-5" />
                    <span className="sr-only">Profile</span>
                  </Button>
                  <Link href="/signin">
                    <Button size="sm" className="ml-2 bg-purple-600 hover:bg-purple-700 text-white">
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            </header>
            <main className="flex-1">
              <Suspense>{children}</Suspense>
            </main>
            <footer className="border-t border-purple-900/40 bg-gray-950 py-6">
              <div className="container flex flex-col items-center justify-between gap-4 px-4 text-center md:flex-row md:px-6 md:text-left">
                <div className="flex flex-col items-center gap-4 md:flex-row">
                  <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                    <span className="text-paradiseGold">Paradise</span><span className="text-paradisePink">Baddies</span>
                  </Link>
                  <p className="text-sm text-purple-200">© 2025 Paradise Baddies. All rights reserved.</p>
                </div>
                <div className="flex gap-4">
                  <Link href="#" className="text-sm text-purple-200 hover:text-purple-400">
                    Terms
                  </Link>
                  <Link href="#" className="text-sm text-purple-200 hover:text-purple-400">
                    Privacy
                  </Link>
                  <Link href="#" className="text-sm text-purple-200 hover:text-purple-400">
                    Contact
                  </Link>
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
