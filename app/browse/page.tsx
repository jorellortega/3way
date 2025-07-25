'use client';

import Link from "next/link"
import Image from "next/image"
import { Filter, LayoutGrid, List, Search, SlidersHorizontal, ShoppingCart } from "lucide-react"
import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/supabase";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function BrowsePage() {
  const [supabase] = useState(() => createClientComponentClient<Database>())
  const [addedIndex, setAddedIndex] = useState<number | null>(null);
  const [content, setContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("content")
        .select("id, title, description, price, type, thumbnail_url, status, users(first_name, last_name)")
        .eq("status", "published")
        .order("created_at", { ascending: false });
      setContent(data || []);
      setLoading(false);
    };
    fetchContent();
  }, []);

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
            <p className="text-sm text-paradiseWhite">Showing 1-{content.length} of {content.length} results</p>
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
                {loading ? (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="overflow-hidden rounded-lg border border-purple-500/30 bg-gray-900 shadow-[0_0_15px_rgba(168,85,247,0.15)] animate-pulse">
                        <div className="relative aspect-[4/3] w-full bg-gray-800"></div>
                        <div className="p-4">
                          <div className="h-4 bg-gray-800 rounded mb-2"></div>
                          <div className="h-3 bg-gray-800 rounded mb-2"></div>
                          <div className="flex justify-between">
                            <div className="h-3 bg-gray-800 rounded w-16"></div>
                            <div className="h-3 bg-gray-800 rounded w-12"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {content.map((item) => (
                    <Link key={item.id} href={`/content/${item.id}`} className="group">
                      <div className="overflow-hidden rounded-lg border border-purple-500/30 bg-gray-900 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                        <div className="relative aspect-[4/3] w-full overflow-hidden">
                          {item.thumbnail_url ? (
                          <Image
                              src={supabase.storage.from('files').getPublicUrl(item.thumbnail_url).data.publicUrl || ''}
                            width={400}
                            height={300}
                              alt={item.title}
                            className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
                          />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-purple-200">No Thumbnail</div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium text-white">{item.title}</h3>
                          {item.users && (
                            <p className="text-sm text-purple-300 mt-1 truncate">
                              By {`${item.users.first_name} ${item.users.last_name}`}
                            </p>
                          )}
                          <div className="mt-2 flex items-center justify-between">
                            <p className="text-sm text-purple-200">{item.type}</p>
                            <p className="font-medium text-purple-400">${item.price?.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                )}
              </TabsContent>
              <TabsContent value="list" className="mt-6">
                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="flex overflow-hidden rounded-lg border border-paradiseGold/30 shadow-[0_0_15px_rgba(249,200,70,0.15)] animate-pulse" style={{ backgroundColor: '#141414' }}>
                        <div className="relative h-32 w-48 overflow-hidden sm:h-40 sm:w-64 bg-gray-800"></div>
                        <div className="flex flex-1 flex-col justify-between p-4">
                          <div>
                            <div className="h-4 bg-gray-800 rounded mb-2"></div>
                            <div className="h-3 bg-gray-800 rounded mb-2"></div>
                            <div className="h-3 bg-gray-800 rounded mb-2"></div>
                          </div>
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-3 bg-gray-800 rounded w-8"></div>
                              <div className="h-3 bg-gray-800 rounded w-16"></div>
                            </div>
                            <div className="h-3 bg-gray-800 rounded w-12"></div>
                          </div>
                          <div className="flex gap-2 mt-2">
                            <div className="flex-1 h-8 bg-gray-800 rounded"></div>
                            <div className="flex-1 h-8 bg-gray-800 rounded"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {content.map((item, i) => (
                    <Link key={item.id} href={`/content/${item.id}`} className="group">
                      <div className="flex overflow-hidden rounded-lg border border-paradiseGold/30 shadow-[0_0_15px_rgba(249,200,70,0.15)]" style={{ backgroundColor: '#141414' }}>
                        <div className="relative h-32 w-48 overflow-hidden sm:h-40 sm:w-64">
                          {item.thumbnail_url ? (
                            <Image
                              src={supabase.storage.from('files').getPublicUrl(item.thumbnail_url).data.publicUrl || ''}
                              width={256}
                              height={160}
                              alt={item.title}
                              className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-paradiseGold">
                              <div className="text-center">
                                <div className="text-2xl mb-1">📁</div>
                                <div className="text-xs">No Thumbnail</div>
                              </div>
                            </div>
                          )}
                          {item.type === 'premium' && (
                            <div className="absolute right-2 top-2 rounded-full bg-paradisePink px-2 py-1 text-xs font-medium text-paradiseWhite">
                              Premium
                            </div>
                          )}
                        </div>
                        <div className="flex flex-1 flex-col justify-between p-4">
                          <div>
                            <h3 className="font-medium text-paradisePink">{item.title}</h3>
                            {item.users && (
                              <p className="mt-1 text-sm text-paradiseGold">
                                By {`${item.users.first_name} ${item.users.last_name}`}
                              </p>
                            )}
                            <p className="mt-2 line-clamp-2 text-sm text-paradiseGold">
                              {item.description || 'Premium digital content for your creative projects.'}
                            </p>
                          </div>
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-paradiseGold">4.8 ★</span>
                              <span className="text-xs text-paradiseGold">1.2k downloads</span>
                            </div>
                            <p className="font-medium text-paradisePink">${item.price?.toFixed(2) || '0.00'}</p>
                          </div>
                          <div className="flex gap-2 mt-2">
                            <Button
                              className="flex-1 bg-paradisePink hover:bg-paradiseGold text-paradiseWhite font-semibold"
                              onClick={e => {
                                e.preventDefault();
                                if (typeof window !== 'undefined') {
                                  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
                                  cart.push({
                                    id: item.id,
                                    name: item.title,
                                    price: item.price,
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
                                      id: item.id,
                                      name: item.title,
                                      price: item.price,
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
                )}
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
