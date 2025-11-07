"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Crown, Star, TrendingUp, ShoppingCart, Check } from "lucide-react"
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
    creator_name: string | null
  }
}

interface Creator {
  id: string
  first_name: string
  last_name: string
  creator_name: string | null
  profile_image: string | null
  bio: string | null
  role: string
  is_verified: boolean
  subscription_tiers?: Array<{
    id: string
    name: string
    price: number
    description: string
    benefits: string[]
    popular?: boolean
    is_active: boolean
  }>
}

export default function Home() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [featuredContent, setFeaturedContent] = useState<Content[]>([])
  const [eliteCreators, setEliteCreators] = useState<Creator[]>([])
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
        .select("id, title, price, type, thumbnail_url, status, content_url, users(first_name, last_name, creator_name)")
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(6)
      setFeaturedContent(data as any[] || [])
    }
    fetchFeaturedContent()
    
    // Fetch elite creators
    const fetchEliteCreators = async () => {
      console.log('Fetching elite creators...');
      const { data, error } = await supabase
        .from("users")
        .select("id, first_name, last_name, creator_name, profile_image, bio, role, is_verified")
        .eq("role", "creator")
        .order("created_at", { ascending: false })
        .limit(6)
      
      console.log('Elite creators data:', data);
      console.log('Elite creators error:', error);
      
      if (data && data.length > 0) {
        // Fetch subscription tiers for each creator
        const creatorsWithTiers = await Promise.all(
          data.map(async (creator) => {
            const { data: tiersData } = await supabase
              .from('subscription_tiers')
              .select('id, name, price, description, benefits, popular, is_active')
              .eq('creator_id', creator.id)
              .eq('is_active', true)
              .order('price', { ascending: true });

            return {
              ...creator,
              subscription_tiers: tiersData || []
            };
          })
        );

        // Filter to only show creators with active tiers
        const creatorsWithActiveTiers = creatorsWithTiers.filter(
          creator => creator.subscription_tiers.length > 0
        );

        setEliteCreators(creatorsWithActiveTiers);
      } else {
        setEliteCreators([]);
      }
    }
    fetchEliteCreators()
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
                    className="border-purple-600 bg-transparent text-purple-200 hover:bg-purple-700 hover:text-white"
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
                        By {item.users.creator_name || `${item.users.first_name} ${item.users.last_name}`}
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
              <Button
                variant="outline"
                size="lg"
                className="border-purple-600 bg-transparent text-purple-200 hover:bg-purple-700 hover:text-white"
              >
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
            {eliteCreators.map((creator) => (
              <Link key={creator.id} href={`/creators/${creator.id}`} className="group">
                <div className="flex flex-col items-center space-y-3">
                  <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-paradiseGold shadow-[0_0_15px_rgba(249,200,70,0.3)] md:h-32 md:w-32">
                    {creator.profile_image ? (
                      <Image
                        src={supabase.storage.from('files').getPublicUrl(creator.profile_image).data.publicUrl}
                        width={128}
                        height={128}
                        alt={creator.creator_name || `${creator.first_name} ${creator.last_name}`}
                        className="h-full w-full object-cover transition-all duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-paradisePink">
                        <div className="text-center">
                          <div className="text-2xl mb-1">👤</div>
                          <div className="text-xs">No Photo</div>
                        </div>
                      </div>
                    )}
                    {creator.is_verified && (
                      <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-paradisePink flex items-center justify-center">
                        <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <h3 className="font-medium text-paradisePink">{creator.creator_name || `${creator.first_name} ${creator.last_name}`}</h3>
                    <div className="mt-1 flex items-center justify-center">
                      <span className="ml-1 text-sm text-paradiseGold">Creator</span>
                    </div>
                    <p className="mt-1 text-xs text-paradisePink">{creator.bio || 'Digital content creator'}</p>
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

      {/* Creator Subscriptions */}
      <section className="py-12 md:py-16 lg:py-20 relative">
        <div className="absolute inset-0 bg-grid-white/[0.02] -z-10"></div>
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-8 text-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter text-paradisePink sm:text-4xl md:text-5xl">
                Support Your Favorite Creators
              </h2>
              <p className="max-w-[900px] text-paradiseWhite md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Subscribe to individual creators for exclusive content, behind-the-scenes access, and more. Each creator offers their own unique subscription tiers.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/creators">
                <Button className="bg-paradisePink hover:bg-paradiseGold text-white font-semibold px-8 py-3 text-lg">
                  Browse Creators
                </Button>
              </Link>
              <Link href="/subscriptions">
                <Button variant="outline" className="border-paradiseGold text-paradiseGold hover:bg-paradiseGold/10 px-8 py-3 text-lg">
                  View All Subscriptions
                </Button>
              </Link>
            </div>
          </div>

          {/* Featured Creator Subscriptions */}
          {eliteCreators.length > 0 && (
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-paradiseGold mb-8 text-center">
                Featured Creator Subscriptions
              </h3>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                {eliteCreators.slice(0, 3).map((creator) => (
                  <div key={creator.id} className="bg-[#141414] rounded-xl border-2 border-paradisePink/30 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    {/* Creator Info at top */}
                    <div className="text-center mb-6">
                      <div className="relative mx-auto mb-4">
                        <div className="w-16 h-16 mx-auto rounded-full overflow-hidden border-2 border-paradiseGold">
                          {creator.profile_image ? (
                            <Image
                              src={supabase.storage.from('files').getPublicUrl(creator.profile_image).data.publicUrl || ''}
                              alt={creator.creator_name || `${creator.first_name} ${creator.last_name}`}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-paradiseGold/20 flex items-center justify-center">
                              <span className="text-lg text-paradiseGold font-bold">
                                {creator.creator_name 
                                  ? creator.creator_name[0].toUpperCase()
                                  : `${creator.first_name[0]}${creator.last_name[0]}`}
                              </span>
                            </div>
                          )}
                        </div>
                        {creator.is_verified && (
                          <div className="absolute -top-1 -right-1 bg-paradisePink rounded-full p-1">
                            <Check className="h-2 w-2 text-white" />
                          </div>
                        )}
                      </div>
                      
                      <h3 className="text-lg font-bold text-paradisePink mb-1">
                        {creator.creator_name || `${creator.first_name} ${creator.last_name}`}
                      </h3>
                      {creator.bio && (
                        <p className="text-sm text-paradiseGold mb-2 line-clamp-2">
                          {creator.bio}
                        </p>
                      )}
                    </div>

                    {/* Subscription Tier Preview */}
                    <div className="p-4 rounded-lg border-2 bg-[#141414] border-paradiseGold/50 mb-4">
                      <div className="text-center mb-3">
                        <h4 className="font-semibold text-white mb-1">
                          {creator.subscription_tiers?.[0]?.name || 'Basic Tier'}
                        </h4>
                        {creator.subscription_tiers?.[0]?.description && (
                          <p className="text-xs text-paradiseGold mb-2">
                            {creator.subscription_tiers[0].description}
                          </p>
                        )}
                        <div className="text-2xl font-bold text-paradisePink">
                          ${creator.subscription_tiers?.[0]?.price || '0.00'}
                          <span className="text-sm text-paradiseGold">/month</span>
                        </div>
                      </div>
                      
                      {creator.subscription_tiers?.[0]?.benefits && creator.subscription_tiers[0].benefits.length > 0 && (
                        <ul className="space-y-2 mb-4">
                          {creator.subscription_tiers[0].benefits.slice(0, 2).map((benefit, index) => (
                            <li key={index} className="flex items-start text-xs text-paradiseGold">
                              <Check className="h-3 w-3 text-paradisePink mr-2 mt-0.5 flex-shrink-0" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <Link href={`/subscriptions?creator=${creator.id}`}>
                      <Button className="w-full bg-paradisePink hover:bg-paradiseGold text-white font-semibold transition-all duration-200">
                        View All Tiers
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* How It Works Card */}
      <div className="mt-12 flex justify-center">
        <a href="/howto" className="block w-full max-w-xl rounded-xl bg-purple-900/40 border border-purple-800 p-4 text-center transition">
          <h2 className="text-xl font-semibold mb-1 text-purple-200">How Paradise Baddies Works</h2>
          <p className="mb-2 text-purple-300">New here? Learn how to get started, stay safe, and make the most of our platform.</p>
          <span className="inline-block mt-1 px-4 py-1 rounded bg-purple-800 text-purple-100 text-sm font-medium">Learn More</span>
        </a>
      </div>
    </div>
  )
}
