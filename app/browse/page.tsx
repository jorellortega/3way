'use client';

import Link from "next/link"
import Image from "next/image"
import { Filter, LayoutGrid, List, Search, SlidersHorizontal, ShoppingCart } from "lucide-react"
import React, { useState } from 'react';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function BrowsePage() {
  const [addedIndex, setAddedIndex] = useState<number | null>(null);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-paradisePink via-paradiseGold to-paradiseWhite">
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-paradisePink">Browse Content</h1>
            <p className="text-paradiseWhite">Discover and purchase premium digital content</p>
          </div>
          <div className="flex w-full items-center gap-2 md:w-auto">
            <div className="relative flex-1 md:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-paradiseGold" />
              <Input
                type="search"
                placeholder="Search content..."
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

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
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
                <SelectItem value="photos">Photos</SelectItem>
                <SelectItem value="videos">Videos</SelectItem>
                <SelectItem value="illustrations">Illustrations</SelectItem>
                <SelectItem value="3d">3D Models</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="trending">
              <SelectTrigger className="h-8 w-[150px] border-paradiseGold bg-paradiseWhite text-paradiseBlack focus:ring-paradisePink">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-paradiseWhite border-paradiseGold text-paradiseBlack">
                <SelectItem value="trending">Trending</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end md:justify-start w-full md:w-auto">
            <p className="text-sm text-paradiseWhite">Showing 1-24 of 256 results</p>
            <Tabs defaultValue="grid" className="w-full">
              <TabsList className="grid h-8 w-[120px] grid-cols-2 bg-paradiseWhite border-paradiseGold">
                <TabsTrigger
                  value="grid"
                  className="h-8 w-8 p-0 data-[state=active]:bg-paradisePink data-[state=active]:text-paradiseWhite"
                >
                  <LayoutGrid className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger
                  value="list"
                  className="h-8 w-8 p-0 data-[state=active]:bg-paradisePink data-[state=active]:text-paradiseWhite"
                >
                  <List className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>
              <TabsContent value="grid" className="mt-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <Link key={i} href={`/content/${i + 1}`} className="group">
                      <div className="overflow-hidden rounded-lg border border-paradiseGold/30 shadow-[0_0_15px_rgba(249,200,70,0.15)]" style={{ backgroundColor: '#141414' }}>
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
                            <div className="absolute inset-0 flex items-center justify-center bg-paradiseBlack/50 backdrop-blur-md">
                              <div className="rounded-full bg-paradisePink px-4 py-2 text-sm font-medium text-paradiseWhite">
                                Subscribe to View
                              </div>
                            </div>
                          )}
                          {i % 4 === 0 && (
                            <div className="absolute right-2 top-2 rounded-full bg-paradisePink px-2 py-1 text-xs font-medium text-paradiseWhite">
                              Premium
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium text-paradisePink">Digital Content Title {i + 1}</h3>
                          <div className="mt-1 flex items-center justify-between">
                            <p className="text-sm text-paradiseGold">By Creator Name</p>
                            <p className="font-medium text-paradisePink">$9.99</p>
                          </div>
                          <div className="flex gap-2 mt-2">
                            <Button
                              className="flex-1 bg-paradisePink hover:bg-paradiseGold text-paradiseWhite font-semibold"
                              onClick={e => {
                                e.preventDefault();
                                if (typeof window !== 'undefined') {
                                  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
                                  cart.push({
                                    id: i + 1,
                                    name: `Digital Content Title ${i + 1}`,
                                    price: 9.99,
                                  });
                                  localStorage.setItem('cart', JSON.stringify(cart));
                                  setAddedIndex(i);
                                  setTimeout(() => setAddedIndex(null), 1200);
                                }
                              }}
                            >
                              <ShoppingCart className="h-4 w-4 mr-1" />
                              {addedIndex === i ? 'Added!' : 'Add to Cart'}
                            </Button>
                            <Button
                              className="flex-1 bg-paradiseGold hover:bg-paradisePink text-paradiseBlack font-semibold"
                              onClick={e => {
                                e.preventDefault();
                                if (typeof window !== 'undefined') {
                                  localStorage.setItem('cart', JSON.stringify([
                                    {
                                      id: i + 1,
                                      name: `Digital Content Title ${i + 1}`,
                                      price: 9.99,
                                    },
                                  ]));
                                  window.location.href = '/checkout';
                                }
                              }}
                            >
                              <ShoppingCart className="h-4 w-4 mr-1" /> Buy Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="list" className="mt-6">
                <div className="space-y-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Link key={i} href={`/content/${i + 1}`} className="group">
                      <div className="flex overflow-hidden rounded-lg border border-paradiseGold/30 shadow-[0_0_15px_rgba(249,200,70,0.15)]" style={{ backgroundColor: '#141414' }}>
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
                            <div className="absolute inset-0 flex items-center justify-center bg-paradiseBlack/50 backdrop-blur-md">
                              <div className="rounded-full bg-paradisePink px-4 py-2 text-sm font-medium text-paradiseWhite">
                                Subscribe to View
                              </div>
                            </div>
                          )}
                          {i % 4 === 0 && (
                            <div className="absolute right-2 top-2 rounded-full bg-paradisePink px-2 py-1 text-xs font-medium text-paradiseWhite">
                              Premium
                            </div>
                          )}
                        </div>
                        <div className="flex flex-1 flex-col justify-between p-4">
                          <div>
                            <h3 className="font-medium text-paradisePink">Digital Content Title {i + 1}</h3>
                            <p className="mt-1 text-sm text-paradiseGold">By Creator Name</p>
                            <p className="mt-2 line-clamp-2 text-sm text-paradiseGold">
                              This premium digital content features high-quality visuals perfect for your creative projects.
                            </p>
                          </div>
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-paradiseGold">4.8 ★</span>
                              <span className="text-xs text-paradiseGold">1.2k downloads</span>
                            </div>
                            <p className="font-medium text-paradisePink">$9.99</p>
                          </div>
                          <div className="flex gap-2 mt-2">
                            <Button
                              className="flex-1 bg-paradisePink hover:bg-paradiseGold text-paradiseWhite font-semibold"
                              onClick={e => {
                                e.preventDefault();
                                if (typeof window !== 'undefined') {
                                  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
                                  cart.push({
                                    id: i + 1,
                                    name: `Digital Content Title ${i + 1}`,
                                    price: 9.99,
                                  });
                                  localStorage.setItem('cart', JSON.stringify(cart));
                                  setAddedIndex(i);
                                  setTimeout(() => setAddedIndex(null), 1200);
                                }
                              }}
                            >
                              <ShoppingCart className="h-4 w-4 mr-1" />
                              {addedIndex === i ? 'Added!' : 'Add to Cart'}
                            </Button>
                            <Button
                              className="flex-1 bg-paradiseGold hover:bg-paradisePink text-paradiseBlack font-semibold"
                              onClick={e => {
                                e.preventDefault();
                                if (typeof window !== 'undefined') {
                                  localStorage.setItem('cart', JSON.stringify([
                                    {
                                      id: i + 1,
                                      name: `Digital Content Title ${i + 1}`,
                                      price: 9.99,
                                    },
                                  ]));
                                  window.location.href = '/checkout';
                                }
                              }}
                            >
                              <ShoppingCart className="h-4 w-4 mr-1" /> Buy Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
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
              size="sm"
              className="h-8 w-8 p-0 border-paradiseGold bg-paradiseWhite text-paradisePink hover:bg-paradiseGold/20 hover:text-paradiseBlack"
            >
              5
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
