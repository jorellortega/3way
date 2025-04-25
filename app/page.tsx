import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Crown, Star, TrendingUp } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-950 via-blue-950/80 to-gray-950">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] -z-10"></div>
        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter text-white sm:text-5xl xl:text-6xl/none">
                  Discover Premium Digital Content
                </h1>
                <p className="max-w-[600px] text-blue-200 md:text-xl">
                  Access thousands of high-quality images and videos from top creators. Subscribe or purchase
                  individually.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/browse">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                    Browse Content
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/subscriptions">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-blue-500 text-blue-200 hover:bg-blue-900/50"
                  >
                    View Subscription Plans
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="overflow-hidden rounded-lg border border-blue-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                    <Image
                      src="/placeholder.svg?height=400&width=300"
                      width={300}
                      height={400}
                      alt="Premium content preview"
                      className="aspect-[3/4] object-cover"
                    />
                  </div>
                  <div className="overflow-hidden rounded-lg border border-blue-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
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
                  <div className="overflow-hidden rounded-lg border border-blue-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                    <Image
                      src="/placeholder.svg?height=300&width=300"
                      width={300}
                      height={300}
                      alt="Premium content preview"
                      className="aspect-square object-cover"
                    />
                  </div>
                  <div className="overflow-hidden rounded-lg border border-blue-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
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
              <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl">
                Featured Content
              </h2>
              <p className="max-w-[900px] text-blue-200 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Explore our handpicked selection of premium digital content from top creators.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 sm:grid-cols-2 md:grid-cols-3 lg:gap-8">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Link
                key={item}
                href={`/content/${item}`}
                className="group relative overflow-hidden rounded-lg border border-blue-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
              >
                <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-gray-900">
                  <Image
                    src={`/placeholder.svg?height=300&width=400`}
                    width={400}
                    height={300}
                    alt={`Featured content ${item}`}
                    className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent p-4 text-white opacity-0 transition-opacity group-hover:opacity-100">
                  <h3 className="font-medium">Premium Content Title</h3>
                  <p className="text-sm text-blue-200">By Creator Name</p>
                </div>
                {item % 2 === 0 && (
                  <div className="absolute right-2 top-2 rounded-full bg-blue-600 px-2 py-1 text-xs font-medium text-white">
                    Premium
                  </div>
                )}
              </Link>
            ))}
          </div>
          <div className="flex justify-center">
            <Link href="/browse">
              <Button variant="outline" size="lg" className="border-blue-500 text-blue-200 hover:bg-blue-900/50">
                View All Content
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Top Creators */}
      <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-blue-950/50 via-gray-950 to-blue-950/50 relative">
        <div className="absolute inset-0 bg-grid-white/[0.02] -z-10"></div>
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-blue-900/50 px-3 py-1 text-sm text-blue-200 border border-blue-700/50">
                <TrendingUp className="mr-1 inline-block h-4 w-4" />
                Top Creators
              </div>
              <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl">
                Meet Our Elite Creators
              </h2>
              <p className="max-w-[900px] text-blue-200 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Follow and subscribe to these trending creators for exclusive content.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 py-12 md:grid-cols-3 lg:grid-cols-4 lg:gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((creator) => (
              <Link key={creator} href={`/creators/${creator}`} className="group">
                <div className="flex flex-col items-center space-y-3">
                  <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-blue-500 shadow-[0_0_15px_rgba(168,85,247,0.3)] md:h-32 md:w-32">
                    <Image
                      src={`/placeholder.svg?height=128&width=128`}
                      width={128}
                      height={128}
                      alt={`Creator ${creator}`}
                      className="h-full w-full object-cover transition-all duration-300 group-hover:scale-110"
                    />
                    {creator <= 3 && (
                      <div className="absolute -right-1 -top-1 rounded-full bg-blue-600 p-1">
                        <Crown className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <h3 className="font-medium text-white">Creator Name</h3>
                    <div className="mt-1 flex items-center justify-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 text-sm text-blue-200">4.9</span>
                    </div>
                    <p className="mt-1 text-xs text-blue-300">1.2k subscribers</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="flex justify-center">
            <Link href="/creators">
              <Button variant="outline" size="lg" className="border-blue-500 text-blue-200 hover:bg-blue-900/50">
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
              <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl">
                Choose Your Plan
              </h2>
              <p className="max-w-[900px] text-blue-200 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Subscribe for unlimited access or purchase individual content.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3 lg:gap-8">
            {/* Basic Plan */}
            <div className="flex flex-col rounded-lg border border-blue-500/30 bg-gray-900/60 p-6 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-white">Basic</h3>
                <p className="text-sm text-blue-200">For casual browsers</p>
              </div>
              <div className="mb-4">
                <span className="text-4xl font-bold text-white">$9.99</span>
                <span className="text-blue-200">/month</span>
              </div>
              <ul className="mb-6 space-y-2 text-sm text-blue-200">
                <li className="flex items-center">
                  <svg
                    className="mr-2 h-4 w-4 text-blue-400"
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
                    className="mr-2 h-4 w-4 text-blue-400"
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
                    className="mr-2 h-4 w-4 text-blue-400"
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
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Subscribe Now</Button>
              </Link>
            </div>
            {/* Premium Plan */}
            <div className="relative flex flex-col rounded-lg border border-blue-500 bg-gray-900/60 p-6 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                Most Popular
              </div>
              <div className="mb-4">
                <h3 className="text-xl font-bold text-white">Premium</h3>
                <p className="text-sm text-blue-200">For enthusiasts</p>
              </div>
              <div className="mb-4">
                <span className="text-4xl font-bold text-white">$19.99</span>
                <span className="text-blue-200">/month</span>
              </div>
              <ul className="mb-6 space-y-2 text-sm text-blue-200">
                <li className="flex items-center">
                  <svg
                    className="mr-2 h-4 w-4 text-blue-400"
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
                    className="mr-2 h-4 w-4 text-blue-400"
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
                    className="mr-2 h-4 w-4 text-blue-400"
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
                    className="mr-2 h-4 w-4 text-blue-400"
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
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Subscribe Now</Button>
              </Link>
            </div>
            {/* Pro Plan */}
            <div className="flex flex-col rounded-lg border border-blue-500/30 bg-gray-900/60 p-6 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-white">Pro</h3>
                <p className="text-sm text-blue-200">For professionals</p>
              </div>
              <div className="mb-4">
                <span className="text-4xl font-bold text-white">$39.99</span>
                <span className="text-blue-200">/month</span>
              </div>
              <ul className="mb-6 space-y-2 text-sm text-blue-200">
                <li className="flex items-center">
                  <svg
                    className="mr-2 h-4 w-4 text-blue-400"
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
                    className="mr-2 h-4 w-4 text-blue-400"
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
                    className="mr-2 h-4 w-4 text-blue-400"
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
                    className="mr-2 h-4 w-4 text-blue-400"
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
                    className="mr-2 h-4 w-4 text-blue-400"
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
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Subscribe Now</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
