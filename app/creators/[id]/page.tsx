import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, MessageCircle, Star, UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CreatorProfilePage({ params }: { params: { id: string } }) {
  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="mb-4 flex items-center gap-2">
        <Link
          href="/creators"
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-teal-600 dark:text-gray-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Creators
        </Link>
      </div>

      <div className="mb-8 flex flex-col items-center gap-6 md:flex-row md:items-start">
        <div className="relative h-32 w-32 overflow-hidden rounded-full md:h-40 md:w-40">
          <Image
            src="/placeholder.svg?height=160&width=160"
            width={160}
            height={160}
            alt="Creator profile"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-1 flex-col items-center text-center md:items-start md:text-left">
          <h1 className="text-3xl font-bold">Creator Name</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Digital Artist & Photographer</p>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex items-center">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="ml-1 font-medium">4.8</span>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">(256 reviews)</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">2.5k subscribers</span>
          </div>
          <p className="mt-4 max-w-2xl text-gray-500 dark:text-gray-400">
            Professional digital artist specializing in abstract art, photography, and digital illustrations. Creating
            premium content for creative professionals and enthusiasts.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button className="gap-2 bg-teal-600 hover:bg-teal-700">
              <UserPlus className="h-4 w-4" />
              Subscribe
            </Button>
            <Button variant="outline" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              Message
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="content" className="mt-8">
        <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="packages">Packages</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>
        <TabsContent value="content" className="mt-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Link key={i} href={`/content/${i + 20}`} className="group">
                <div className="overflow-hidden rounded-lg border bg-white dark:border-gray-800 dark:bg-gray-950">
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src={`/placeholder.svg?height=300&width=400`}
                      width={400}
                      height={300}
                      alt={`Content ${i + 1}`}
                      className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
                    />
                    {/* Blurred overlay for premium content */}
                    {i % 3 !== 0 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md">
                        <div className="rounded-full bg-teal-600 px-4 py-2 text-sm font-medium text-white">
                          Subscribe to View
                        </div>
                      </div>
                    )}
                    {i % 4 === 0 && (
                      <div className="absolute right-2 top-2 rounded-full bg-teal-600 px-2 py-1 text-xs font-medium text-white">
                        Premium
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium">Digital Content Title {i + 1}</h3>
                    <div className="mt-1 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">4.8</span>
                      </div>
                      <p className="font-medium text-teal-600">$9.99</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="packages" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                <h3 className="text-xl font-bold">{["Basic", "Premium", "Ultimate"][i]} Package</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {i === 0 && "A collection of 5 essential items for beginners."}
                  {i === 1 && "A curated set of 15 premium items for professionals."}
                  {i === 2 && "The complete collection of 30+ items with exclusive content."}
                </p>
                <div className="mt-4">
                  <span className="text-3xl font-bold">${[29.99, 59.99, 99.99][i]}</span>
                </div>
                <ul className="mt-4 space-y-2 text-sm">
                  <li className="flex items-center">
                    <svg
                      className="mr-2 h-4 w-4 text-teal-600 dark:text-teal-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    {[5, 15, 30][i]}+ premium items
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="mr-2 h-4 w-4 text-teal-600 dark:text-teal-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    {["Standard", "High", "Maximum"][i]} resolution
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="mr-2 h-4 w-4 text-teal-600 dark:text-teal-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    {i > 0 ? "Commercial usage" : "Personal usage only"}
                  </li>
                  {i > 1 && (
                    <li className="flex items-center">
                      <svg
                        className="mr-2 h-4 w-4 text-teal-600 dark:text-teal-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Exclusive content
                    </li>
                  )}
                </ul>
                <div className="mt-6">
                  <Button className="w-full bg-teal-600 hover:bg-teal-700">Buy Package</Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="about" className="mt-6 max-w-3xl space-y-4">
          <h2 className="text-xl font-bold">About Creator Name</h2>
          <p>
            I'm a professional digital artist with over 10 years of experience in creating premium digital content. My
            work spans across various styles including abstract art, photography, and digital illustrations.
          </p>
          <p>
            My passion is creating visually stunning content that inspires creativity and enhances projects across
            various industries. I believe in delivering the highest quality work that meets the needs of creative
            professionals, marketers, and design enthusiasts.
          </p>
          <p>
            Each piece in my collection is meticulously crafted with attention to detail, ensuring that subscribers and
            customers receive content that exceeds expectations. I regularly update my portfolio with fresh, innovative
            designs to keep my collection current and relevant.
          </p>

          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-medium">Specialties</h3>
            <ul className="list-inside list-disc space-y-1 text-gray-600 dark:text-gray-400">
              <li>Digital Photography</li>
              <li>Abstract Digital Art</li>
              <li>Illustrations & Vector Graphics</li>
              <li>Textures & Patterns</li>
              <li>3D Modeling & Rendering</li>
            </ul>
          </div>

          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-medium">Contact Information</h3>
            <p className="text-gray-600 dark:text-gray-400">
              For custom work or collaborations, please reach out via the message button or contact me at:
              <br />
              Email: creator@example.com
              <br />
              Website: www.creatorname.com
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
