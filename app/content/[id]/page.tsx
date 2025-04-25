import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Heart, Share2, ShoppingCart, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ContentDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="bg-gradient-to-br from-gray-950 via-purple-950/80 to-gray-950 min-h-screen">
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="mb-4 flex items-center gap-2">
          <Link href="/browse" className="flex items-center gap-1 text-sm text-purple-300 hover:text-purple-400">
            <ArrowLeft className="h-4 w-4" />
            Back to Browse
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-4">
            <div className="overflow-hidden rounded-lg border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={`/placeholder.svg?height=600&width=800`}
                  width={800}
                  height={600}
                  alt="Content preview"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="relative aspect-square overflow-hidden rounded-md border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                >
                  {i === 0 ? (
                    <Image
                      src={`/placeholder.svg?height=120&width=120`}
                      width={120}
                      height={120}
                      alt={`Thumbnail ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <>
                      <Image
                        src={`/placeholder.svg?height=120&width=120`}
                        width={120}
                        height={120}
                        alt={`Thumbnail ${i + 1}`}
                        className="h-full w-full object-cover opacity-40"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                        <div className="text-center text-xs font-medium text-white">Premium</div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Premium Digital Content Title</h1>
              <div className="mt-2 flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <Star className="h-5 w-5 fill-gray-700 stroke-gray-600" />
                  <span className="ml-2 text-sm font-medium text-white">4.2</span>
                  <span className="text-sm text-purple-300">(128 reviews)</span>
                </div>
                <div className="text-sm text-purple-300">2.5k downloads</div>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Link
                  href="/creators/1"
                  className="flex items-center gap-2 text-sm font-medium text-purple-300 hover:text-purple-400"
                >
                  <div className="relative h-6 w-6 overflow-hidden rounded-full border border-purple-500/50">
                    <Image
                      src="/placeholder.svg?height=24&width=24"
                      width={24}
                      height={24}
                      alt="Creator"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  By Creator Name
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-3xl font-bold text-white">$19.99</div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button className="gap-2 bg-purple-600 hover:bg-purple-700 text-white">
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  className="gap-2 border-purple-500 text-purple-200 hover:bg-purple-900/50 hover:text-white"
                >
                  <Heart className="h-4 w-4" />
                  Add to Wishlist
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-purple-500 text-purple-200 hover:bg-purple-900/50 hover:text-white"
                >
                  <Share2 className="h-4 w-4" />
                  <span className="sr-only">Share</span>
                </Button>
              </div>
              <div className="rounded-lg border border-purple-500/30 bg-gray-900/60 p-4 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                <h3 className="font-medium text-white">Subscribe to access all content</h3>
                <p className="mt-1 text-sm text-purple-200">
                  Get unlimited access to all premium content with a subscription plan.
                </p>
                <div className="mt-3">
                  <Link href="/subscriptions">
                    <Button
                      variant="outline"
                      className="w-full border-purple-500 text-purple-200 hover:bg-purple-900/50 hover:text-white"
                    >
                      View Subscription Plans
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <Tabs defaultValue="description">
              <TabsList className="grid w-full grid-cols-3 bg-gray-900 border-purple-700">
                <TabsTrigger
                  value="description"
                  className="data-[state=active]:bg-purple-800 data-[state=active]:text-white"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger
                  value="details"
                  className="data-[state=active]:bg-purple-800 data-[state=active]:text-white"
                >
                  Details
                </TabsTrigger>
                <TabsTrigger
                  value="license"
                  className="data-[state=active]:bg-purple-800 data-[state=active]:text-white"
                >
                  License
                </TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-4 space-y-4 text-purple-200">
                <p>
                  This premium digital content features high-quality visuals perfect for your creative projects. Created
                  by a professional artist with attention to detail and artistic excellence.
                </p>
                <p>
                  The content is delivered in multiple formats to ensure compatibility with various software and
                  platforms. Whether you're working on a personal project or commercial work, this content will elevate
                  your designs.
                </p>
              </TabsContent>
              <TabsContent value="details" className="mt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-white">Format</div>
                    <div className="text-purple-200">JPEG, PNG, PSD</div>
                  </div>
                  <div>
                    <div className="font-medium text-white">Resolution</div>
                    <div className="text-purple-200">4K (3840x2160)</div>
                  </div>
                  <div>
                    <div className="font-medium text-white">File Size</div>
                    <div className="text-purple-200">250 MB</div>
                  </div>
                  <div>
                    <div className="font-medium text-white">Created</div>
                    <div className="text-purple-200">April 15, 2025</div>
                  </div>
                  <div>
                    <div className="font-medium text-white">Software</div>
                    <div className="text-purple-200">Adobe Photoshop, Illustrator</div>
                  </div>
                  <div>
                    <div className="font-medium text-white">Tags</div>
                    <div className="text-purple-200">Abstract, Modern, Digital Art</div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="license" className="mt-4 space-y-4">
                <div>
                  <h3 className="font-medium text-white">Standard License</h3>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-purple-200">
                    <li>Personal and commercial use</li>
                    <li>Use in a single end product</li>
                    <li>Lifetime access</li>
                    <li>Cannot be redistributed or resold</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-white">Extended License</h3>
                  <p className="mt-1 text-sm text-purple-200">
                    For extended usage rights, please contact the creator directly.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="mt-12 space-y-6">
          <h2 className="text-2xl font-bold text-white">Related Content</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Link key={i} href={`/content/${i + 10}`} className="group">
                <div className="overflow-hidden rounded-lg border border-purple-500/30 bg-gray-900 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src={`/placeholder.svg?height=300&width=400`}
                      width={400}
                      height={300}
                      alt={`Related content ${i + 1}`}
                      className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
                    />
                    {i % 2 === 0 && (
                      <div className="absolute right-2 top-2 rounded-full bg-purple-600 px-2 py-1 text-xs font-medium text-white">
                        Premium
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-white">Digital Content Title {i + 10}</h3>
                    <div className="mt-1 flex items-center justify-between">
                      <p className="text-sm text-purple-200">By Creator Name</p>
                      <p className="font-medium text-purple-400">$9.99</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
