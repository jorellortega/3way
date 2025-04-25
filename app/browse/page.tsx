import Link from "next/link"
import Image from "next/image"
import { Filter, LayoutGrid, List, Search, SlidersHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function BrowsePage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-950 via-purple-950/80 to-gray-950">
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Browse Content</h1>
            <p className="text-purple-200">Discover and purchase premium digital content</p>
          </div>
          <div className="flex w-full items-center gap-2 md:w-auto">
            <div className="relative flex-1 md:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-purple-300" />
              <Input
                type="search"
                placeholder="Search content..."
                className="w-full rounded-full bg-gray-900 border-purple-700 pl-8 text-purple-200 focus-visible:ring-purple-500"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              className="border-purple-700 bg-gray-900 text-purple-200 hover:bg-purple-900/50 hover:text-white"
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
              className="h-8 gap-1 border-purple-700 bg-gray-900 text-purple-200 hover:bg-purple-900/50 hover:text-white"
            >
              <Filter className="h-3.5 w-3.5" />
              Filters
            </Button>
            <Select defaultValue="all">
              <SelectTrigger className="h-8 w-[150px] border-purple-700 bg-gray-900 text-purple-200 focus:ring-purple-500">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-purple-700 text-purple-200">
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="photos">Photos</SelectItem>
                <SelectItem value="videos">Videos</SelectItem>
                <SelectItem value="illustrations">Illustrations</SelectItem>
                <SelectItem value="3d">3D Models</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="trending">
              <SelectTrigger className="h-8 w-[150px] border-purple-700 bg-gray-900 text-purple-200 focus:ring-purple-500">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-purple-700 text-purple-200">
                <SelectItem value="trending">Trending</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-sm text-purple-200">Showing 1-24 of 256 results</p>
            <Tabs defaultValue="grid" className="w-[120px]">
              <TabsList className="grid h-8 w-full grid-cols-2 bg-gray-900 border-purple-700">
                <TabsTrigger
                  value="grid"
                  className="h-8 w-8 p-0 data-[state=active]:bg-purple-800 data-[state=active]:text-white"
                >
                  <LayoutGrid className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger
                  value="list"
                  className="h-8 w-8 p-0 data-[state=active]:bg-purple-800 data-[state=active]:text-white"
                >
                  <List className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <TabsContent value="grid" className="mt-0">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <Link key={i} href={`/content/${i + 1}`} className="group">
                <div className="overflow-hidden rounded-lg border border-purple-500/30 bg-gray-900 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src={`/placeholder.svg?height=300&width=400`}
                      width={400}
                      height={300}
                      alt={`Content ${i + 1}`}
                      className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
                    />
                    {/* Blurred overlay for other images */}
                    {i % 3 !== 0 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md">
                        <div className="rounded-full bg-purple-600 px-4 py-2 text-sm font-medium text-white">
                          Subscribe to View
                        </div>
                      </div>
                    )}
                    {i % 4 === 0 && (
                      <div className="absolute right-2 top-2 rounded-full bg-purple-600 px-2 py-1 text-xs font-medium text-white">
                        Premium
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-white">Digital Content Title {i + 1}</h3>
                    <div className="mt-1 flex items-center justify-between">
                      <p className="text-sm text-purple-200">By Creator Name</p>
                      <p className="font-medium text-purple-400">$9.99</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list" className="mt-0">
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Link key={i} href={`/content/${i + 1}`} className="group">
                <div className="flex overflow-hidden rounded-lg border border-purple-500/30 bg-gray-900 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                  <div className="relative h-32 w-48 overflow-hidden sm:h-40 sm:w-64">
                    <Image
                      src={`/placeholder.svg?height=160&width=256`}
                      width={256}
                      height={160}
                      alt={`Content ${i + 1}`}
                      className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
                    />
                    {/* Blurred overlay for other images */}
                    {i % 3 !== 0 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md">
                        <div className="rounded-full bg-purple-600 px-4 py-2 text-sm font-medium text-white">
                          Subscribe to View
                        </div>
                      </div>
                    )}
                    {i % 4 === 0 && (
                      <div className="absolute right-2 top-2 rounded-full bg-purple-600 px-2 py-1 text-xs font-medium text-white">
                        Premium
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-4">
                    <div>
                      <h3 className="font-medium text-white">Digital Content Title {i + 1}</h3>
                      <p className="mt-1 text-sm text-purple-200">By Creator Name</p>
                      <p className="mt-2 line-clamp-2 text-sm text-purple-200">
                        This premium digital content features high-quality visuals perfect for your creative projects.
                      </p>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-purple-300">4.8 ★</span>
                        <span className="text-xs text-purple-300">1.2k downloads</span>
                      </div>
                      <p className="font-medium text-purple-400">$9.99</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </TabsContent>

        <div className="mt-8 flex justify-center">
          <nav className="flex items-center gap-1">
            <Button variant="outline" size="icon" disabled className="border-purple-700 bg-gray-900 text-purple-200">
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
              className="h-8 w-8 p-0 border-purple-700 bg-gray-900 text-purple-200 hover:bg-purple-900/50 hover:text-white"
            >
              1
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 border-purple-700 bg-gray-900 text-purple-200 hover:bg-purple-900/50 hover:text-white"
            >
              2
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 border-purple-700 bg-gray-900 text-purple-200 hover:bg-purple-900/50 hover:text-white"
            >
              3
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 border-purple-700 bg-gray-900 text-purple-200 hover:bg-purple-900/50 hover:text-white"
            >
              4
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 border-purple-700 bg-gray-900 text-purple-200 hover:bg-purple-900/50 hover:text-white"
            >
              5
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="border-purple-700 bg-gray-900 text-purple-200 hover:bg-purple-900/50 hover:text-white"
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
