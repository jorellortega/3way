import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Shield, TrendingUp, Users, DollarSign, Lock, Star, Zap, Heart, Crown } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Paradise Baddies - Premium Adult Content Platform | OnlyFans Alternative",
  description: "Paradise Baddies is a premium adult content platform and OnlyFans alternative. Discover exclusive content from verified creators, support your favorite artists, and enjoy a secure, user-friendly experience. Compare features with OnlyFans, Patreon, and other adult content platforms.",
  keywords: [
    "Paradise Baddies",
    "OnlyFans alternative",
    "adult content platform",
    "premium content",
    "creator platform",
    "subscription platform",
    "adult entertainment",
    "verified creators",
    "content marketplace",
    "OnlyFans competitor",
    "adult content subscription",
    "creator monetization",
    "adult content marketplace"
  ],
  openGraph: {
    title: "Paradise Baddies - Premium Adult Content Platform | OnlyFans Alternative",
    description: "The modern alternative to OnlyFans and other adult content platforms. Discover exclusive content from verified creators.",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  }
}

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-paradisePink via-paradiseGold to-paradiseWhite">
      {/* Hero Section */}
      <section className="py-20 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-paradiseBlack mb-6">
            Paradise Baddies: The Premium Adult Content Platform
          </h1>
          <p className="text-xl md:text-2xl text-paradiseBlack/90 mb-8">
            The modern alternative to OnlyFans and other adult content platforms
          </p>
          <p className="text-lg text-paradiseBlack/80 max-w-2xl mx-auto mb-10">
            Paradise Baddies is a cutting-edge platform designed for creators and consumers of premium adult content. 
            We offer a secure, transparent, and user-friendly experience that rivals and exceeds the features of 
            platforms like OnlyFans, Patreon, and other adult content subscription services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/browse">
              <Button size="lg" className="bg-paradisePink hover:bg-paradiseGold text-white font-semibold px-8 py-3 text-lg">
                Explore Content
              </Button>
            </Link>
            <Link href="/creators">
              <Button size="lg" className="bg-paradiseGold hover:bg-paradiseGold/90 text-paradiseBlack font-semibold border-2 border-paradiseGold px-8 py-3 text-lg">
                Become a Creator
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Paradise Baddies */}
      <section className="py-16 px-4 md:px-6 bg-white/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-paradisePink mb-4">
              Why Choose Paradise Baddies Over OnlyFans?
            </h2>
            <p className="text-lg text-paradiseBlack/80 max-w-2xl mx-auto">
              We've built a platform that addresses the limitations of traditional adult content sites
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-[#141414] border-paradiseGold/30">
              <CardHeader>
                <Shield className="h-10 w-10 text-paradisePink mb-4" />
                <CardTitle className="text-paradisePink">Enhanced Security & Privacy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Advanced security measures protect both creators and consumers. Your data and transactions 
                  are secured with industry-leading encryption, making Paradise Baddies a safer alternative 
                  to OnlyFans and other platforms.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#141414] border-paradiseGold/30">
              <CardHeader>
                <DollarSign className="h-10 w-10 text-paradiseGold mb-4" />
                <CardTitle className="text-paradisePink">Better Revenue for Creators</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Creators earn more with our competitive revenue share model. Unlike OnlyFans, we offer 
                  transparent pricing, faster payouts, and multiple monetization options including one-time 
                  purchases and subscription tiers.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#141414] border-paradiseGold/30">
              <CardHeader>
                <Zap className="h-10 w-10 text-paradisePink mb-4" />
                <CardTitle className="text-paradisePink">Modern User Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Our intuitive interface makes it easy to discover content, manage subscriptions, and 
                  support creators. Faster loading times and mobile-optimized design provide a superior 
                  experience compared to traditional adult content platforms.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#141414] border-paradiseGold/30">
              <CardHeader>
                <Users className="h-10 w-10 text-paradiseGold mb-4" />
                <CardTitle className="text-paradisePink">Verified Creators Only</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  All creators undergo identity verification to ensure authenticity and build trust. 
                  This verification process helps maintain a high-quality community and protects consumers 
                  from scams and fake profiles.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#141414] border-paradiseGold/30">
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-paradisePink mb-4" />
                <CardTitle className="text-paradisePink">Advanced Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Creators get detailed analytics and insights to help grow their audience and revenue. 
                  Track sales, subscriptions, and engagement metrics all in one place - features that 
                  many OnlyFans alternatives lack.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#141414] border-paradiseGold/30">
              <CardHeader>
                <Lock className="h-10 w-10 text-paradiseGold mb-4" />
                <CardTitle className="text-paradisePink">Content Protection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Advanced content protection measures help prevent piracy and unauthorized sharing. 
                  We're committed to protecting creator content better than platforms like OnlyFans.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Platform Comparison */}
      <section className="py-16 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-paradiseBlack mb-4">
              How Paradise Baddies Compares
            </h2>
            <p className="text-lg text-paradiseBlack/80">
              See how we stack up against OnlyFans and other adult content platforms
            </p>
          </div>

          <div className="bg-[#141414] rounded-2xl border border-paradiseGold/30 p-8 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-paradiseGold/30">
                  <th className="pb-4 text-paradisePink font-bold">Feature</th>
                  <th className="pb-4 text-paradiseGold font-bold text-center">Paradise Baddies</th>
                  <th className="pb-4 text-gray-400 font-bold text-center">OnlyFans</th>
                  <th className="pb-4 text-gray-400 font-bold text-center">Patreon</th>
                  <th className="pb-4 text-gray-400 font-bold text-center">Other Platforms</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-paradiseGold/20">
                  <td className="py-4 font-semibold">Creator Revenue Share</td>
                  <td className="py-4 text-center text-paradiseGold font-bold">Competitive Rates</td>
                  <td className="py-4 text-center">Standard</td>
                  <td className="py-4 text-center">Varies</td>
                  <td className="py-4 text-center">Varies</td>
                </tr>
                <tr className="border-b border-paradiseGold/20">
                  <td className="py-4 font-semibold">Identity Verification</td>
                  <td className="py-4 text-center text-paradiseGold">✓ Required</td>
                  <td className="py-4 text-center">Partial</td>
                  <td className="py-4 text-center">Limited</td>
                  <td className="py-4 text-center">Varies</td>
                </tr>
                <tr className="border-b border-paradiseGold/20">
                  <td className="py-4 font-semibold">Content Protection</td>
                  <td className="py-4 text-center text-paradiseGold">✓ Advanced</td>
                  <td className="py-4 text-center">Basic</td>
                  <td className="py-4 text-center">Limited</td>
                  <td className="py-4 text-center">Varies</td>
                </tr>
                <tr className="border-b border-paradiseGold/20">
                  <td className="py-4 font-semibold">Analytics Dashboard</td>
                  <td className="py-4 text-center text-paradiseGold">✓ Comprehensive</td>
                  <td className="py-4 text-center">Basic</td>
                  <td className="py-4 text-center">Limited</td>
                  <td className="py-4 text-center">Varies</td>
                </tr>
                <tr className="border-b border-paradiseGold/20">
                  <td className="py-4 font-semibold">Multiple Monetization</td>
                  <td className="py-4 text-center text-paradiseGold">✓ Yes</td>
                  <td className="py-4 text-center">Limited</td>
                  <td className="py-4 text-center">Yes</td>
                  <td className="py-4 text-center">Varies</td>
                </tr>
                <tr className="border-b border-paradiseGold/20">
                  <td className="py-4 font-semibold">Payout Speed</td>
                  <td className="py-4 text-center text-paradiseGold">✓ Fast</td>
                  <td className="py-4 text-center">Standard</td>
                  <td className="py-4 text-center">Varies</td>
                  <td className="py-4 text-center">Varies</td>
                </tr>
                <tr>
                  <td className="py-4 font-semibold">User Experience</td>
                  <td className="py-4 text-center text-paradiseGold">✓ Modern</td>
                  <td className="py-4 text-center">Dated</td>
                  <td className="py-4 text-center">Good</td>
                  <td className="py-4 text-center">Varies</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* For Creators */}
      <section className="py-16 px-4 md:px-6 bg-white/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-paradisePink mb-4">
              For Content Creators
            </h2>
            <p className="text-lg text-paradiseBlack/80">
              Everything you need to build and grow your adult content business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-[#141414] border-paradisePink/30">
              <CardHeader>
                <CardTitle className="text-paradisePink flex items-center gap-2">
                  <Crown className="h-6 w-6" />
                  Creator Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-paradiseGold flex-shrink-0 mt-0.5" />
                    <span>Competitive revenue share and transparent pricing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-paradiseGold flex-shrink-0 mt-0.5" />
                    <span>Multiple monetization options: subscriptions, one-time purchases, packages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-paradiseGold flex-shrink-0 mt-0.5" />
                    <span>Comprehensive analytics to track performance and growth</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-paradiseGold flex-shrink-0 mt-0.5" />
                    <span>Fast and reliable payout processing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-paradiseGold flex-shrink-0 mt-0.5" />
                    <span>Content protection and anti-piracy measures</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-paradiseGold flex-shrink-0 mt-0.5" />
                    <span>Easy content management and upload tools</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-paradiseGold flex-shrink-0 mt-0.5" />
                    <span>Marketing tools to promote your content</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-[#141414] border-paradiseGold/30">
              <CardHeader>
                <CardTitle className="text-paradisePink flex items-center gap-2">
                  <Star className="h-6 w-6" />
                  Getting Started
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-gray-300">
                  <div>
                    <h3 className="font-semibold text-paradiseGold mb-2">Step 1: Create Your Account</h3>
                    <p className="text-sm">Sign up and verify your identity to become a creator on Paradise Baddies.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-paradiseGold mb-2">Step 2: Complete Onboarding</h3>
                    <p className="text-sm">Set up your payment methods, accept terms, and verify your identity for security.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-paradiseGold mb-2">Step 3: Upload Content</h3>
                    <p className="text-sm">Start uploading your premium content - videos, images, packages, and more.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-paradiseGold mb-2">Step 4: Set Up Subscriptions</h3>
                    <p className="text-sm">Create subscription tiers and packages to monetize your content effectively.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-paradiseGold mb-2">Step 5: Start Earning</h3>
                    <p className="text-sm">Promote your content and start earning revenue from subscriptions and sales.</p>
                  </div>
                </div>
                <div className="mt-6">
                  <Link href="/baddieupload">
                    <Button className="w-full bg-paradisePink hover:bg-paradiseGold text-white font-semibold">
                      Become a Creator
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* For Consumers */}
      <section className="py-16 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-paradiseBlack mb-4">
              For Content Consumers
            </h2>
            <p className="text-lg text-paradiseBlack/80">
              Discover and support your favorite creators with ease
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-[#141414] border-paradiseGold/30 text-center">
              <CardHeader>
                <Heart className="h-10 w-10 text-paradisePink mx-auto mb-4" />
                <CardTitle className="text-paradisePink">Premium Content</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Access exclusive content from verified creators. Browse thousands of premium videos, 
                  images, and digital content packages.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#141414] border-paradisePink/30 text-center">
              <CardHeader>
                <Star className="h-10 w-10 text-paradiseGold mx-auto mb-4" />
                <CardTitle className="text-paradisePink">Support Creators</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Subscribe to your favorite creators or make one-time purchases. Your support helps 
                  creators continue producing quality content.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#141414] border-paradiseGold/30 text-center">
              <CardHeader>
                <Lock className="h-10 w-10 text-paradisePink mx-auto mb-4" />
                <CardTitle className="text-paradisePink">Secure & Private</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Your privacy and security are our top priorities. All transactions are encrypted and 
                  your data is protected with industry-leading security measures.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-16 px-4 md:px-6 bg-white/50">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-paradiseBlack mb-6">
              Paradise Baddies: The Best OnlyFans Alternative for 2025
            </h2>
            
            <div className="text-paradiseBlack/90 space-y-4 mb-8">
              <p>
                Looking for an OnlyFans alternative? Paradise Baddies is the premier adult content platform 
                that offers everything creators and consumers need. As a direct competitor to OnlyFans, 
                Patreon, and other adult content subscription services, we've built a platform that addresses 
                the common issues users face with traditional adult content sites.
              </p>

              <h3 className="text-2xl font-bold text-paradisePink mt-8 mb-4">
                What Makes Paradise Baddies Different from OnlyFans?
              </h3>
              <p>
                Unlike OnlyFans and other adult content platforms, Paradise Baddies focuses on creator 
                success, user experience, and platform security. Our modern interface makes it easy to 
                discover content, manage subscriptions, and support creators. We offer better revenue 
                sharing, faster payouts, and more monetization options than most OnlyFans alternatives.
              </p>

              <h3 className="text-2xl font-bold text-paradisePink mt-8 mb-4">
                Secure Adult Content Platform
              </h3>
              <p>
                Security and privacy are paramount at Paradise Baddies. All creators undergo identity 
                verification to ensure authenticity and protect consumers. Our advanced content protection 
                measures help prevent piracy, and our encrypted payment processing ensures your financial 
                information is always secure.
              </p>

              <h3 className="text-2xl font-bold text-paradisePink mt-8 mb-4">
                For Adult Content Creators
              </h3>
              <p>
                If you're a content creator looking for an OnlyFans alternative, Paradise Baddies offers 
                competitive revenue sharing, multiple monetization streams, and comprehensive analytics. 
                Upload videos, images, and digital packages. Set up subscription tiers to build recurring 
                revenue. Our platform is designed to help creators maximize their earnings while maintaining 
                full control over their content.
              </p>

              <h3 className="text-2xl font-bold text-paradisePink mt-8 mb-4">
                Premium Adult Content Marketplace
              </h3>
              <p>
                Paradise Baddies is more than just an OnlyFans alternative - it's a complete adult content 
                marketplace. Browse exclusive content from verified creators, subscribe to your favorites, 
                or make one-time purchases. Our platform supports various content types including videos, 
                photos, audio, and digital packages.
              </p>

              <h3 className="text-2xl font-bold text-paradisePink mt-8 mb-4">
                Why Choose Paradise Baddies Over Other Platforms?
              </h3>
              <ul className="list-disc list-inside space-y-2 text-paradiseBlack/90">
                <li>Better revenue sharing for creators compared to OnlyFans</li>
                <li>Faster payout processing and transparent fee structure</li>
                <li>Modern, user-friendly interface that's easy to navigate</li>
                <li>Comprehensive analytics and growth tools for creators</li>
                <li>Advanced content protection and anti-piracy measures</li>
                <li>Identity verification for all creators ensures authenticity</li>
                <li>Multiple monetization options: subscriptions, purchases, packages</li>
                <li>Responsive customer support and platform maintenance</li>
              </ul>

              <h3 className="text-2xl font-bold text-paradisePink mt-8 mb-4">
                Join Paradise Baddies Today
              </h3>
              <p>
                Whether you're a creator looking to monetize your content or a consumer seeking premium 
                adult content, Paradise Baddies offers the best alternative to OnlyFans and other adult 
                content platforms. Our commitment to creator success, user privacy, and platform security 
                makes us the top choice for adult content creators and consumers in 2025.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <Card className="bg-[#141414] border-paradisePink/30">
            <CardHeader>
              <CardTitle className="text-3xl text-paradisePink mb-4">
                Ready to Get Started?
              </CardTitle>
              <CardDescription className="text-lg text-gray-300">
                Join Paradise Baddies today and experience the best OnlyFans alternative
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/browse">
                  <Button size="lg" className="bg-paradisePink hover:bg-paradiseGold text-white px-8 py-3 text-lg">
                    Browse Content
                  </Button>
                </Link>
                <Link href="/baddieupload">
                  <Button size="lg" className="bg-paradiseGold hover:bg-paradiseGold/90 text-paradiseBlack font-semibold border-2 border-paradiseGold px-8 py-3 text-lg">
                    Become a Creator
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-gray-400 mt-6">
                Paradise Baddies - The premium alternative to OnlyFans, Patreon, and other adult content platforms
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

