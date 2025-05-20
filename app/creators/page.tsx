import Link from "next/link"
import Image from "next/image"
import { Filter, Search, SlidersHorizontal, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CreatorsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-paradisePink via-paradiseGold to-paradiseWhite">
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-paradisePink">Featured Creators</h1>
            <p className="text-paradiseWhite">Discover and follow talented content creators</p>
          </div>
          <div className="flex w-full items-center gap-2 md:w-auto">
            <div className="relative flex-1 md:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-paradiseGold" />
              <Input
                type="search"
                placeholder="Search creators..."
                className="w-full rounded-full bg-paradiseWhite border-paradiseGold pl-8 text-paradiseBlack focus-visible:ring-paradisePink"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              className="border-paradiseGold bg-paradiseWhite text-paradisePink hover:bg-paradiseGold/20 hover:text-paradiseBlack"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="sr-only">Filter</span>
            </Button>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1 border-paradiseGold bg-paradiseWhite text-paradisePink hover:bg-paradiseGold/20 hover:text-paradiseBlack"
            >
              <Filter className="h-3.5 w-3.5" />
              Filters
            </Button>
            <Select defaultValue="all">
              <SelectTrigger className="h-8 w-[150px] border-paradiseGold bg-paradiseWhite text-paradiseBlack focus:ring-paradisePink">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-paradiseWhite border-paradiseGold text-paradiseBlack">
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="photography">Photography</SelectItem>
                <SelectItem value="videography">Videography</SelectItem>
                <SelectItem value="illustration">Illustration</SelectItem>
                <SelectItem value="3d">3D Art</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="popular">
              <SelectTrigger className="h-8 w-[150px] border-paradiseGold bg-paradiseWhite text-paradiseBlack focus:ring-paradisePink">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-paradiseWhite border-paradiseGold text-paradiseBlack">
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="content">Most Content</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-sm text-paradiseWhite">Showing 1-12 of 48 creators</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Link key={i} href={`/creators/${i + 1}`} className="group">
              <div className="overflow-hidden rounded-lg border border-paradiseGold/30 shadow-[0_0_15px_rgba(249,200,70,0.15)]" style={{ backgroundColor: '#141414' }}>
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={`/placeholder-user.jpg`}
                    width={400}
                    height={300}
                    alt={`Creator ${i + 1}`}
                    className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
                  />
                  {i % 3 === 0 && (
                    <div className="absolute right-2 top-2 rounded-full bg-paradisePink px-2 py-1 text-xs font-medium text-paradiseWhite">
                      Featured
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-paradisePink">Creator Name {i + 1}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-paradiseGold" />
                      <span className="text-sm text-paradiseGold">4.8</span>
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-paradiseGold">Photography & Videography</p>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <p className="text-paradiseGold">128 items</p>
                    <p className="text-paradisePink">2.4k followers</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <nav className="flex items-center gap-1">
            <Button variant="outline" size="icon" disabled className="border-paradiseGold bg-paradiseWhite text-paradisePink">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
              <span className="sr-only">Previous</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 border-paradiseGold bg-paradiseWhite text-paradisePink hover:bg-paradiseGold/20 hover:text-paradiseBlack"
            >
              1
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 border-paradiseGold bg-paradiseWhite text-paradisePink hover:bg-paradiseGold/20 hover:text-paradiseBlack"
            >
              2
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 border-paradiseGold bg-paradiseWhite text-paradisePink hover:bg-paradiseGold/20 hover:text-paradiseBlack"
            >
              3
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 border-paradiseGold bg-paradiseWhite text-paradisePink hover:bg-paradiseGold/20 hover:text-paradiseBlack"
            >
              4
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="border-paradiseGold bg-paradiseWhite text-paradisePink hover:bg-paradiseGold/20 hover:text-paradiseBlack"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
              <span className="sr-only">Next</span>
            </Button>
          </nav>
        </div>
      </div>
    </div>
  )
} 