"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Crown, Star, TrendingUp, ShoppingCart, Video } from "lucide-react"
import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Content {
  id: string
  title: string
  price: number
  type: string
  thumbnail_url: string | null
  status: string
  content_url: string | null
  users?: {
    first_name: string
    last_name: string
  }
}

export default function Home() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [featuredContent, setFeaturedContent] = useState<Content[]>([])
  const [supabase] = useState(() => createClientComponentClient<Database>())

  useEffect(() => {
    // Try to fetch the logo from the branding bucket
    const fetchLogo = async () => {
      const { data, error } = await supabase.storage.from('files').download('logo.png')
      if (data) {
        const url = URL.createObjectURL(data)
        setLogoUrl(url)
      }
    }
    fetchLogo()
    // Fetch featured/recent content
    const fetchFeaturedContent = async () => {
      const { data } = await supabase
        .from("content")
        .select("id, title, price, type, thumbnail_url, status, content_url, users(first_name, last_name)")
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(6)
      setFeaturedContent(data as any[] || [])
    }
    fetchFeaturedContent()
  }, [supabase])

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-paradisePink via-paradiseGold to-paradiseWhite">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] -z-10"></div>
        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col items-start space-y-4 pt-4">
              <div className="flex items-start mb-2">
                <div className="w-56 h-56 rounded-full bg-white/30 flex items-center justify-center overflow-hidden mr-6">
                  {logoUrl ? (
                    <Image src={logoUrl} alt="Logo" width={224} height={224} />
                  ) : (
                    <span className="text-7xl text-paradisePink font-bold">Logo</span>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter text-paradiseBlack sm:text-5xl xl:text-6xl/none">
                  PARADISE BADDIES
                </h1>
                <p className="max-w-[600px] text-paradiseWhite md:text-xl">
                  Discover Premium Digital Content
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/browse">
                  <Button size="lg" className="bg-paradisePink hover:bg-paradiseGold text-paradiseWhite">
                    Browse Content
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/subscriptions">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-paradiseGold text-paradiseGold hover:bg-paradiseGold/10 hover:text-paradisePink"
                  >
                    View Subscription Plans
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="overflow-hidden rounded-lg border border-paradiseGold/30 shadow-[0_0_15px_rgba(249,200,70,0.15)]">
                    <Image
                      src="/placeholder.svg?height=400&width=300"
                      width={300}
                      height={400}
                      alt="Premium content preview"
                      className="aspect-[3/4] object-cover"
                    />
                  </div>
                  <div className="overflow-hidden rounded-lg border border-paradiseGold/30 shadow-[0_0_15px_rgba(249,200,70,0.15)]">
                    <Image
                      src="/placeholder.svg?height=300&width=300"
                      width={300}
                      height={300}
                      alt="Premium content preview"
                      className="aspect-square object-cover"
                    />
                  </div>
                </div>
                <div className="mt-8 space-y-4">
                  <div className="overflow-hidden rounded-lg border border-paradiseGold/30 shadow-[0_0_15px_rgba(249,200,70,0.15)]">
                    <Image
                      src="/placeholder.svg?height=300&width=300"
                      width={300}
                      height={300}
                      alt="Premium content preview"
                      className="aspect-square object-cover"
                    />
                  </div>
                  <div className="overflow-hidden rounded-lg border border-paradiseGold/30 shadow-[0_0_15px_rgba(249,200,70,0.15)]">
                    <Image
                      src="/placeholder.svg?height=400&width=300"
                      width={300}
                      height={400}
                      alt="Premium content preview"
                      className="aspect-[3/4] object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Content */}
      <section className="py-12 md:py-16 lg:py-20 relative">
        <div className="absolute inset-0 bg-grid-white/[0.02] -z-10"></div>
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter text-paradisePink sm:text-4xl md:text-5xl">
                Featured Content
              </h2>
              <p className="max-w-[900px] text-paradiseWhite md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Explore our handpicked selection of premium digital content from top creators.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 sm:grid-cols-2 md:grid-cols-3 lg:gap-8">
            {featuredContent.map((item) => (
              <div key={item.id} className="relative overflow-hidden rounded-lg border border-paradiseGold shadow-[0_0_15px_rgba(249,200,70,0.15)]" style={{ backgroundColor: '#141414' }}>
              <Link
                  href={`/content/${item.id}`}
                  className="group block flex-1"
              >
                <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-paradiseWhite">
                    {item.thumbnail_url ? (
                  <Image
                        src={supabase.storage.from('files').getPublicUrl(item.thumbnail_url).data.publicUrl || ''}
                    width={400}
                    height={300}
                        alt={item.title}
                    className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
                  />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-paradisePink">No Thumbnail</div>
                    )}
                </div>
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-paradiseBlack/80 to-transparent p-4 text-paradiseWhite opacity-0 transition-opacity group-hover:opacity-100">
                    <h3 className="font-medium">{item.title}</h3>
                    {item.users && (
                      <p className="text-sm text-purple-300 truncate">
                        By {`${item.users.first_name} ${item.users.last_name}`}
                      </p>
                    )}
                    <p className="text-sm text-paradiseGold">${item.price?.toFixed(2)}</p>
                </div>
                  {item.type === "Premium" && (
                  <div className="absolute right-2 top-2 rounded-full bg-paradisePink px-2 py-1 text-xs font-medium text-paradiseWhite">
                      {item.type}
                  </div>
                )}
              </Link>
                <div className="flex gap-2 p-4 pt-2">
                  <Button size="sm" className="flex-1 min-w-0 gap-1 bg-paradisePink hover:bg-paradisePink/90 text-white font-bold text-sm px-2 py-1 truncate">
                    <ShoppingCart className="h-4 w-4" />
                    <span className="truncate">Add to Cart</span>
                  </Button>
                  <Button size="sm" className="flex-1 min-w-0 gap-1 bg-paradiseGold hover:bg-paradiseGold/90 text-paradiseBlack font-bold text-sm px-2 py-1 truncate">
                    <ShoppingCart className="h-4 w-4" />
                    <span className="truncate">Buy Now</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <Link href="/browse">
              <Button variant="outline" size="lg" className="border-paradiseGold text-paradiseGold hover:bg-paradiseGold/10 hover:text-paradisePink">
                View All Content
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Top Creators */}
      <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-paradisePink/10 via-paradiseGold/10 to-paradiseWhite/10 relative">
        <div className="absolute inset-0 bg-grid-white/[0.02] -z-10"></div>
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-paradiseGold/50 px-3 py-1 text-sm text-paradisePink border border-paradiseGold/50">
                <TrendingUp className="mr-1 inline-block h-4 w-4" />
                Top Creators
              </div>
              <h2 className="text-3xl font-bold tracking-tighter text-paradisePink sm:text-4xl md:text-5xl">
                Meet Our Elite Creators
              </h2>
              <p className="max-w-[900px] text-paradiseWhite md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Follow and subscribe to these trending creators for exclusive content.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 py-12 md:grid-cols-3 lg:grid-cols-4 lg:gap-8">
            {featuredContent.map((item) => (
              <Link key={item.id} href={`/content/${item.id}`} className="group">
                <div className="flex flex-col items-center space-y-3">
                  <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-paradiseGold shadow-[0_0_15px_rgba(249,200,70,0.3)] md:h-32 md:w-32">
                    {item.thumbnail_url ? (
                    <Image
                        src={supabase.storage.from('files').getPublicUrl(item.thumbnail_url).data.publicUrl}
                      width={128}
                      height={128}
                        alt={item.title}
                      className="h-full w-full object-cover transition-all duration-300 group-hover:scale-110"
                    />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-paradisePink">No Thumbnail</div>
                    )}
                  </div>
                  <div className="text-center">
                    <h3 className="font-medium text-paradisePink">{item.title}</h3>
                    <div className="mt-1 flex items-center justify-center">
                      <span className="ml-1 text-sm text-paradiseGold">{item.type}</span>
                    </div>
                    <p className="mt-1 text-xs text-paradisePink">${item.price?.toFixed(2)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="flex justify-center">
            <Link href="/creators">
              <Button variant="outline" size="lg" className="border-paradiseGold text-paradiseGold hover:bg-paradiseGold/10 hover:text-paradisePink">
                View All Creators
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Subscription Plans */}
      <section className="py-12 md:py-16 lg:py-20 relative">
        <div className="absolute inset-0 bg-grid-white/[0.02] -z-10"></div>
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter text-paradisePink sm:text-4xl md:text-5xl">
                Choose Your Plan
              </h2>
              <p className="max-w-[900px] text-paradiseWhite md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Subscribe for unlimited access or purchase individual content.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3 lg:gap-8">
            {/* Basic Plan */}
            <div className="flex flex-col rounded-lg border border-paradiseGold/30 bg-paradiseWhite/60 p-6 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-paradisePink">Basic</h3>
                <p className="text-sm text-paradiseGold">For casual browsers</p>
              </div>
              <div className="mb-4">
                <span className="text-4xl font-bold text-paradisePink">$9.99</span>
                <span className="text-paradiseGold">/month</span>
              </div>
              <ul className="mb-6 space-y-2 text-sm text-paradiseGold">
                <li className="flex items-center">
                  <svg
                    className="mr-2 h-4 w-4 text-paradisePink"
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
                  Access to standard content
                </li>
                <li className="flex items-center">
                  <svg
                    className="mr-2 h-4 w-4 text-paradisePink"
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
                  10 downloads per month
                </li>
                <li className="flex items-center">
                  <svg
                    className="mr-2 h-4 w-4 text-paradisePink"
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
                  Standard resolution
                </li>
              </ul>
              <Link href="/subscriptions/basic" className="mt-auto">
                <Button className="w-full bg-paradisePink hover:bg-paradiseGold text-paradiseWhite">Subscribe Now</Button>
              </Link>
            </div>
            {/* Premium Plan */}
            <div className="relative flex flex-col rounded-lg border border-paradiseGold bg-paradiseWhite/60 p-6 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-paradisePink px-3 py-1 text-xs font-semibold text-paradiseWhite">
                Most Popular
              </div>
              <div className="mb-4">
                <h3 className="text-xl font-bold text-paradisePink">Premium</h3>
                <p className="text-sm text-paradiseGold">For enthusiasts</p>
              </div>
              <div className="mb-4">
                <span className="text-4xl font-bold text-paradisePink">$19.99</span>
                <span className="text-paradiseGold">/month</span>
              </div>
              <ul className="mb-6 space-y-2 text-sm text-paradiseGold">
                <li className="flex items-center">
                  <svg
                    className="mr-2 h-4 w-4 text-paradisePink"
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
                  Access to premium content
                </li>
                <li className="flex items-center">
                  <svg
                    className="mr-2 h-4 w-4 text-paradisePink"
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
                  50 downloads per month
                </li>
                <li className="flex items-center">
                  <svg
                    className="mr-2 h-4 w-4 text-paradisePink"
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
                  High resolution
                </li>
                <li className="flex items-center">
                  <svg
                    className="mr-2 h-4 w-4 text-paradisePink"
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
                  Early access to new content
                </li>
              </ul>
              <Link href="/subscriptions/premium" className="mt-auto">
                <Button className="w-full bg-paradisePink hover:bg-paradiseGold text-paradiseWhite">Subscribe Now</Button>
              </Link>
            </div>
            {/* Pro Plan */}
            <div className="flex flex-col rounded-lg border border-paradiseGold/30 bg-paradiseWhite/60 p-6 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-paradisePink">Pro</h3>
                <p className="text-sm text-paradiseGold">For professionals</p>
              </div>
              <div className="mb-4">
                <span className="text-4xl font-bold text-paradisePink">$39.99</span>
                <span className="text-paradiseGold">/month</span>
              </div>
              <ul className="mb-6 space-y-2 text-sm text-paradiseGold">
                <li className="flex items-center">
                  <svg
                    className="mr-2 h-4 w-4 text-paradisePink"
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
                  Access to all content
                </li>
                <li className="flex items-center">
                  <svg
                    className="mr-2 h-4 w-4 text-paradisePink"
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
                  Unlimited downloads
                </li>
                <li className="flex items-center">
                  <svg
                    className="mr-2 h-4 w-4 text-paradisePink"
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
                  Maximum resolution
                </li>
                <li className="flex items-center">
                  <svg
                    className="mr-2 h-4 w-4 text-paradisePink"
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
                  Commercial usage rights
                </li>
                <li className="flex items-center">
                  <svg
                    className="mr-2 h-4 w-4 text-paradisePink"
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
                  Priority support
                </li>
              </ul>
              <Link href="/subscriptions/pro" className="mt-auto">
                <Button className="w-full bg-paradisePink hover:bg-paradiseGold text-paradiseWhite">Subscribe Now</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Book a Photoshoot Section */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container px-4 md:px-6">
          <Link href="/photosession" className="group block">
            <Card className="bg-gray-900/50 border-purple-800/50 overflow-hidden transition-all duration-300 hover:border-paradisePink hover:shadow-[0_0_20px_rgba(236,72,153,0.3)]">
              <div className="grid md:grid-cols-2">
                <div className="p-8 md:p-12">
                  <div className="inline-block rounded-lg bg-paradisePink/20 px-3 py-1 text-sm text-paradisePink border border-paradisePink/50 mb-4">
                    New Service
                  </div>
                  <h3 className="text-3xl font-bold text-white">Photo & Video Sessions</h3>
                  <p className="mt-2 text-purple-200">
                    Need stunning photos or videos to sell? Book a professional session and get content ready for your store.
                  </p>
                  <div className="mt-6">
                    <div className="inline-flex items-center gap-2 text-lg font-semibold text-paradisePink">
                      Book Your Session
                      <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
                <div className="relative h-64 md:h-auto bg-gradient-to-tr from-purple-900 via-purple-800/80 to-paradisePink/60 flex items-center justify-center">
                  <Video className="h-32 w-32 text-white/20" strokeWidth={1.5} />
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </section>
    </div>
  )
}
