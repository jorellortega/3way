import Link from "next/link"
import Image from "next/image"
import { Check, Download, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PackagesPage() {
  return (
    <div className="container px-4 py-12 md:px-6 md:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Content Packages</h1>
        <p className="mt-4 text-gray-500 dark:text-gray-400">
          Save money with our curated content packages. Perfect for specific projects or building your digital library.
        </p>
      </div>

      <Tabs defaultValue="all" className="mt-12">
        <div className="flex justify-center">
          <TabsList className="mb-8">
            <TabsTrigger value="all">All Packages</TabsTrigger>
            <TabsTrigger value="photos">Photo Packages</TabsTrigger>
            <TabsTrigger value="videos">Video Packages</TabsTrigger>
            <TabsTrigger value="mixed">Mixed Media</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="mt-0">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-lg border bg-white dark:border-gray-800 dark:bg-gray-950">
                <div className="relative">
                  <div className="aspect-[16/9] w-full overflow-hidden">
                    <Image
                      src={`/placeholder.svg?height=300&width=500`}
                      width={500}
                      height={300}
                      alt={`Package ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-6 flex flex-col justify-end">
                    <h2 className="text-xl font-bold text-white">
                      {
                        [
                          "Nature Collection",
                          "Urban Landscapes",
                          "Abstract Art",
                          "Minimalist Design",
                          "Vintage Style",
                          "Modern Tech",
                        ][i]
                      }
                    </h2>
                    <p className="text-sm text-gray-200">
                      {i % 2 === 0 ? "Photo Package" : i % 3 === 0 ? "Video Package" : "Mixed Media Package"}
                    </p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">${[49.99, 69.99, 39.99, 89.99, 59.99, 79.99][i]}</span>
                      {i % 2 === 0 && (
                        <span className="rounded-full bg-teal-100 px-2 py-1 text-xs font-medium text-teal-800 dark:bg-teal-900 dark:text-teal-100">
                          20% OFF
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                      <Download className="h-4 w-4" />
                      {[15, 25, 10, 30, 20, 25][i]} items
                    </div>
                  </div>
                  <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                    {
                      [
                        "A stunning collection of nature photography perfect for environmental projects.",
                        "Urban scenes and cityscapes captured in various lighting conditions.",
                        "Creative abstract designs for unique visual impact.",
                        "Clean, minimalist designs for modern projects.",
                        "Retro and vintage-inspired visual content.",
                        "Technology-focused imagery for digital projects.",
                      ][i]
                    }
                  </p>
                  <ul className="mb-6 space-y-2 text-sm">
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-teal-600 dark:text-teal-400" />
                      {[15, 25, 10, 30, 20, 25][i]} premium items
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-teal-600 dark:text-teal-400" />
                      {i % 2 === 0 ? "High" : "Maximum"} resolution
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-teal-600 dark:text-teal-400" />
                      {i < 3 ? "Personal and small commercial use" : "Full commercial license"}
                    </li>
                  </ul>
                  <div className="flex gap-3">
                    <Button className="flex-1 gap-2 bg-teal-600 hover:bg-teal-700">
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </Button>
                    <Link href={`/packages/${i + 1}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        Preview
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="photos" className="mt-0">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 4].map((i) => (
              <div key={i} className="overflow-hidden rounded-lg border bg-white dark:border-gray-800 dark:bg-gray-950">
                <div className="relative">
                  <div className="aspect-[16/9] w-full overflow-hidden">
                    <Image
                      src={`/placeholder.svg?height=300&width=500`}
                      width={500}
                      height={300}
                      alt={`Package ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-6 flex flex-col justify-end">
                    <h2 className="text-xl font-bold text-white">
                      {
                        [
                          "Nature Collection",
                          "Urban Landscapes",
                          "Abstract Art",
                          "Minimalist Design",
                          "Vintage Style",
                          "Modern Tech",
                        ][i]
                      }
                    </h2>
                    <p className="text-sm text-gray-200">Photo Package</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">${[49.99, 69.99, 39.99, 89.99, 59.99, 79.99][i]}</span>
                      {i % 2 === 0 && (
                        <span className="rounded-full bg-teal-100 px-2 py-1 text-xs font-medium text-teal-800 dark:bg-teal-900 dark:text-teal-100">
                          20% OFF
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                      <Download className="h-4 w-4" />
                      {[15, 25, 10, 30, 20, 25][i]} items
                    </div>
                  </div>
                  <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                    {
                      [
                        "A stunning collection of nature photography perfect for environmental projects.",
                        "Urban scenes and cityscapes captured in various lighting conditions.",
                        "Creative abstract designs for unique visual impact.",
                        "Clean, minimalist designs for modern projects.",
                        "Retro and vintage-inspired visual content.",
                        "Technology-focused imagery for digital projects.",
                      ][i]
                    }
                  </p>
                  <ul className="mb-6 space-y-2 text-sm">
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-teal-600 dark:text-teal-400" />
                      {[15, 25, 10, 30, 20, 25][i]} premium photos
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-teal-600 dark:text-teal-400" />
                      {i % 2 === 0 ? "High" : "Maximum"} resolution
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-teal-600 dark:text-teal-400" />
                      {i < 3 ? "Personal and small commercial use" : "Full commercial license"}
                    </li>
                  </ul>
                  <div className="flex gap-3">
                    <Button className="flex-1 gap-2 bg-teal-600 hover:bg-teal-700">
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </Button>
                    <Link href={`/packages/${i + 1}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        Preview
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="videos" className="mt-0">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[2, 5].map((i) => (
              <div key={i} className="overflow-hidden rounded-lg border bg-white dark:border-gray-800 dark:bg-gray-950">
                <div className="relative">
                  <div className="aspect-[16/9] w-full overflow-hidden">
                    <Image
                      src={`/placeholder.svg?height=300&width=500`}
                      width={500}
                      height={300}
                      alt={`Package ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-6 flex flex-col justify-end">
                    <h2 className="text-xl font-bold text-white">
                      {
                        [
                          "Nature Collection",
                          "Urban Landscapes",
                          "Abstract Art",
                          "Minimalist Design",
                          "Vintage Style",
                          "Modern Tech",
                        ][i]
                      }
                    </h2>
                    <p className="text-sm text-gray-200">Video Package</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">${[49.99, 69.99, 39.99, 89.99, 59.99, 79.99][i]}</span>
                      {i % 2 === 0 && (
                        <span className="rounded-full bg-teal-100 px-2 py-1 text-xs font-medium text-teal-800 dark:bg-teal-900 dark:text-teal-100">
                          20% OFF
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                      <Download className="h-4 w-4" />
                      {[15, 25, 10, 30, 20, 25][i]} items
                    </div>
                  </div>
                  <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                    {
                      [
                        "A stunning collection of nature photography perfect for environmental projects.",
                        "Urban scenes and cityscapes captured in various lighting conditions.",
                        "Creative abstract designs for unique visual impact.",
                        "Clean, minimalist designs for modern projects.",
                        "Retro and vintage-inspired visual content.",
                        "Technology-focused imagery for digital projects.",
                      ][i]
                    }
                  </p>
                  <ul className="mb-6 space-y-2 text-sm">
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-teal-600 dark:text-teal-400" />
                      {[15, 25, 10, 30, 20, 25][i]} premium videos
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-teal-600 dark:text-teal-400" />
                      {i % 2 === 0 ? "HD 1080p" : "4K UHD"} resolution
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-teal-600 dark:text-teal-400" />
                      {i < 3 ? "Personal and small commercial use" : "Full commercial license"}
                    </li>
                  </ul>
                  <div className="flex gap-3">
                    <Button className="flex-1 gap-2 bg-teal-600 hover:bg-teal-700">
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </Button>
                    <Link href={`/packages/${i + 1}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        Preview
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="mixed" className="mt-0">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[3].map((i) => (
              <div key={i} className="overflow-hidden rounded-lg border bg-white dark:border-gray-800 dark:bg-gray-950">
                <div className="relative">
                  <div className="aspect-[16/9] w-full overflow-hidden">
                    <Image
                      src={`/placeholder.svg?height=300&width=500`}
                      width={500}
                      height={300}
                      alt={`Package ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-6 flex flex-col justify-end">
                    <h2 className="text-xl font-bold text-white">
                      {
                        [
                          "Nature Collection",
                          "Urban Landscapes",
                          "Abstract Art",
                          "Minimalist Design",
                          "Vintage Style",
                          "Modern Tech",
                        ][i]
                      }
                    </h2>
                    <p className="text-sm text-gray-200">Mixed Media Package</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">${[49.99, 69.99, 39.99, 89.99, 59.99, 79.99][i]}</span>
                      {i % 2 === 0 && (
                        <span className="rounded-full bg-teal-100 px-2 py-1 text-xs font-medium text-teal-800 dark:bg-teal-900 dark:text-teal-100">
                          20% OFF
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                      <Download className="h-4 w-4" />
                      {[15, 25, 10, 30, 20, 25][i]} items
                    </div>
                  </div>
                  <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                    {
                      [
                        "A stunning collection of nature photography perfect for environmental projects.",
                        "Urban scenes and cityscapes captured in various lighting conditions.",
                        "Creative abstract designs for unique visual impact.",
                        "Clean, minimalist designs for modern projects.",
                        "Retro and vintage-inspired visual content.",
                        "Technology-focused imagery for digital projects.",
                      ][i]
                    }
                  </p>
                  <ul className="mb-6 space-y-2 text-sm">
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-teal-600 dark:text-teal-400" />
                      {[15, 25, 10, 30, 20, 25][i]} mixed items (photos & videos)
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-teal-600 dark:text-teal-400" />
                      {i % 2 === 0 ? "High" : "Maximum"} resolution
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-teal-600 dark:text-teal-400" />
                      {i < 3 ? "Personal and small commercial use" : "Full commercial license"}
                    </li>
                  </ul>
                  <div className="flex gap-3">
                    <Button className="flex-1 gap-2 bg-teal-600 hover:bg-teal-700">
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </Button>
                    <Link href={`/packages/${i + 1}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        Preview
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
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
