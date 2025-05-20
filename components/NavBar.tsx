"use client";
import Link from "next/link";
import ClientNavLinks from "@/components/ClientNavLinks";
import { Button } from "@/components/ui/button";
import { Bell, Menu, Search, ShoppingCart, User } from "lucide-react";

// MOCK: Replace with your real authentication logic
const isSignedIn = false; // Set to true to simulate signed in

export default function NavBar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-purple-900/40 bg-transparent backdrop-blur supports-[backdrop-filter]:bg-transparent">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold md:text-2xl">
            <span className="text-paradiseGold">Paradise</span>
            <span className="text-paradisePink">Baddies</span>
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
            <ClientNavLinks isSignedIn={isSignedIn} />
          </nav>
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
          <Link href="/cart">
            <Button
              variant="ghost"
              size="icon"
              className="text-purple-200 hover:bg-purple-900/50 hover:text-white"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Cart</span>
            </Button>
          </Link>
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
  );
} 