'use client';
import Link from "next/link"
import Image from "next/image"
import { Check, Download, ShoppingCart } from "lucide-react"
import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../cart-context";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/supabase";
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Package {
  id: string;
  title: string;
  description: string;
  price: number;
  type: string;
  thumbnail_url: string | null;
  status: string;
  creator_id: string;
  created_at: string;
}

export default function PackagesPage() {
  const { addToCart } = useContext(CartContext);
  const [addedIndex, setAddedIndex] = useState<number | null>(null);
  const [supabase] = useState(() => createClientComponentClient<Database>());
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackages();
  }, [supabase]);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('type', 'package')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching packages:', error);
        setPackages([]);
      } else {
        setPackages(data || []);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container px-4 py-12 md:px-6 md:py-24 bg-gradient-to-br from-paradisePink via-paradiseGold to-paradiseWhite">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-paradisePink">Content Packages</h1>
        <p className="mt-4 text-paradiseWhite">
          Save money with our curated content packages. Perfect for specific projects or building your digital library.
        </p>
      </div>

      <Tabs defaultValue="all" className="mt-12">
        <div className="flex justify-center">
          <TabsList className="mb-8 bg-paradiseWhite border-paradiseGold">
            <TabsTrigger value="all" className="text-paradisePink data-[state=active]:bg-paradisePink data-[state=active]:text-paradiseWhite">All Packages</TabsTrigger>
            <TabsTrigger value="photos" className="text-paradisePink data-[state=active]:bg-paradisePink data-[state=active]:text-paradiseWhite">Photo Packages</TabsTrigger>
            <TabsTrigger value="videos" className="text-paradisePink data-[state=active]:bg-paradisePink data-[state=active]:text-paradiseWhite">Video Packages</TabsTrigger>
            <TabsTrigger value="mixed" className="text-paradisePink data-[state=active]:bg-paradisePink data-[state=active]:text-paradiseWhite">Mixed Media</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="mt-0">
          {loading ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-lg border border-paradiseGold/30 shadow-[0_0_15px_rgba(249,200,70,0.15)] animate-pulse" style={{ backgroundColor: '#141414' }}>
                  <div className="aspect-[16/9] w-full bg-gray-800"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-800 rounded mb-2"></div>
                    <div className="h-3 bg-gray-800 rounded mb-2"></div>
                    <div className="h-3 bg-gray-800 rounded mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-800 rounded"></div>
                      <div className="h-3 bg-gray-800 rounded"></div>
                      <div className="h-3 bg-gray-800 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : packages.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {packages.map((pkg, index) => (
                <div key={pkg.id} className="overflow-hidden rounded-lg border border-paradiseGold/30 shadow-[0_0_15px_rgba(249,200,70,0.15)]" style={{ backgroundColor: '#141414' }}>
                  <div className="relative">
                    <div className="aspect-[16/9] w-full overflow-hidden">
                      {pkg.thumbnail_url ? (
                        <Image
                          src={supabase.storage.from('files').getPublicUrl(pkg.thumbnail_url).data.publicUrl}
                          width={500}
                          height={300}
                          alt={pkg.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-paradiseGold">
                          <div className="text-center">
                            <div className="text-2xl mb-1">📦</div>
                            <div className="text-xs">No Preview</div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-paradiseBlack/60 to-transparent p-6 flex flex-col justify-end">
                      <h2 className="text-xl font-bold text-paradiseWhite">{pkg.title}</h2>
                      <p className="text-sm text-paradiseGold">Package</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-paradisePink">${pkg.price.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-paradiseGold">
                        <Download className="h-4 w-4" />
                        Package
                      </div>
                    </div>
                    <p className="mb-4 text-sm text-paradiseGold">
                      {pkg.description}
                    </p>
                    <ul className="mb-6 space-y-2 text-sm text-paradiseGold">
                      <li className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-paradisePink" />
                        Premium content package
                      </li>
                      <li className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-paradisePink" />
                        High resolution
                      </li>
                      <li className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-paradisePink" />
                        Commercial license
                      </li>
                    </ul>
                    <div className="flex gap-3">
                      <Button
                        className="flex-1 gap-2 bg-paradisePink hover:bg-paradiseGold text-paradiseWhite"
                        onClick={() => {
                          addToCart({
                            id: pkg.id,
                            name: pkg.title,
                            price: pkg.price,
                          });
                          setAddedIndex(index);
                          setTimeout(() => setAddedIndex(null), 1200);
                        }}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        {addedIndex === index ? "Added!" : "Add to Cart"}
                      </Button>
                      <Button
                        className="flex-1 gap-2 bg-paradiseGold hover:bg-paradisePink text-paradiseBlack font-semibold"
                        onClick={() => {
                          if (typeof window !== 'undefined') {
                            localStorage.setItem('cart', JSON.stringify([{
                              id: pkg.id,
                              name: pkg.title,
                              price: pkg.price,
                            }]));
                            window.location.href = '/checkout';
                          }
                        }}
                      >
                        Buy Now
                      </Button>
                      <Link href={`/packages/${pkg.id}`} className="flex-1 border-paradiseGold text-paradisePink hover:bg-paradiseGold/10">
                        <Button variant="outline" className="w-full">
                          Preview
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-medium text-paradisePink mb-2">No Packages Available</h3>
              <p className="text-paradiseGold">Check back soon for amazing content packages!</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="photos" className="mt-0">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📸</div>
            <h3 className="text-xl font-medium text-paradisePink mb-2">Photo Packages</h3>
            <p className="text-paradiseGold">Photo packages coming soon!</p>
          </div>
        </TabsContent>

        <TabsContent value="videos" className="mt-0">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎥</div>
            <h3 className="text-xl font-medium text-paradisePink mb-2">Video Packages</h3>
            <p className="text-paradiseGold">Video packages coming soon!</p>
          </div>
        </TabsContent>

        <TabsContent value="mixed" className="mt-0">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-xl font-medium text-paradisePink mb-2">Mixed Media Packages</h3>
            <p className="text-paradiseGold">Mixed media packages coming soon!</p>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mx-auto mt-16 max-w-3xl rounded-lg border bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-xl font-bold">Custom Package Requests</h2>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Need a specific collection of content for your project? We can create custom packages tailored to your needs.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="font-medium">Business Packages</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Curated content collections for corporate websites, marketing campaigns, and business presentations.
            </p>
          </div>
          <div>
            <h3 className="font-medium">Industry-Specific Collections</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Specialized content for healthcare, education, technology, and other industries with relevant imagery.
            </p>
          </div>
          <div>
            <h3 className="font-medium">Seasonal Packages</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Holiday, seasonal, and event-based content collections to keep your projects current throughout the year.
            </p>
          </div>
          <div>
            <h3 className="font-medium">Style-Matched Sets</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Content collections with consistent visual styles, color schemes, and themes for cohesive projects.
            </p>
          </div>
        </div>
        <div className="mt-6 text-center">
          <Link href="/contact">
            <Button className="bg-teal-600 hover:bg-teal-700">Request Custom Package</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
