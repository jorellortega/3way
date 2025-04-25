import Link from "next/link"
import Image from "next/image"
import { Clock, CreditCard, Download, Heart, History, Package, Settings, ShoppingCart, Star, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/80 to-gray-950">
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="flex flex-col gap-8 md:flex-row">
          {/* Sidebar */}
          <aside className="md:w-64">
            <Card className="border-purple-500/30 bg-gray-900/60 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full">
                    <Image
                      src="/placeholder.svg?height=40&width=40"
                      width={40}
                      height={40}
                      alt="User avatar"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-white">John Doe</CardTitle>
                    <CardDescription className="text-purple-300">Premium Subscriber</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="grid gap-1 px-2 text-sm">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 rounded-md bg-purple-900/50 px-3 py-2 text-purple-100 transition-colors hover:text-purple-50"
                  >
                    <User className="h-4 w-4" />
                    Account Overview
                  </Link>
                  <Link
                    href="/dashboard/purchases"
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-purple-200 transition-colors hover:bg-purple-900/30 hover:text-purple-50"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Purchases
                  </Link>
                  <Link
                    href="/dashboard/downloads"
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-purple-200 transition-colors hover:bg-purple-900/30 hover:text-purple-50"
                  >
                    <Download className="h-4 w-4" />
                    Downloads
                  </Link>
                  <Link
                    href="/dashboard/favorites"
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-purple-200 transition-colors hover:bg-purple-900/30 hover:text-purple-50"
                  >
                    <Heart className="h-4 w-4" />
                    Favorites
                  </Link>
                  <Link
                    href="/dashboard/subscription"
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-purple-200 transition-colors hover:bg-purple-900/30 hover:text-purple-50"
                  >
                    <CreditCard className="h-4 w-4" />
                    Subscription
                  </Link>
                  <Link
                    href="/dashboard/history"
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-purple-200 transition-colors hover:bg-purple-900/30 hover:text-purple-50"
                  >
                    <History className="h-4 w-4" />
                    History
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-purple-200 transition-colors hover:bg-purple-900/30 hover:text-purple-50"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                </nav>
              </CardContent>
              <CardFooter className="flex flex-col border-t border-purple-800/30 px-6 py-4">
                <div className="mb-2 text-sm text-purple-200">Current Plan</div>
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-white">Premium</div>
                  <Link href="/dashboard/subscription">
                    <Button variant="link" className="h-auto p-0 text-purple-400 hover:text-purple-300">
                      Manage
                    </Button>
                  </Link>
                </div>
                <div className="mt-1 text-xs text-purple-300">Renews on Nov 15, 2025</div>
              </CardFooter>
            </Card>
          </aside>

          {/* Main content */}
          <main className="flex-1">
            <h1 className="mb-6 text-2xl font-bold text-white md:text-3xl">Account Overview</h1>

            {/* Stats */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="border-purple-500/30 bg-gray-900/60 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                <CardHeader className="pb-2">
                  <CardDescription className="text-purple-200">Downloads</CardDescription>
                  <CardTitle className="text-2xl text-white">128</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-purple-300">
                    <span className="font-medium text-purple-400">+12</span> this month
                  </div>
                </CardContent>
              </Card>
              <Card className="border-purple-500/30 bg-gray-900/60 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                <CardHeader className="pb-2">
                  <CardDescription className="text-purple-200">Purchases</CardDescription>
                  <CardTitle className="text-2xl text-white">24</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-purple-300">
                    <span className="font-medium text-purple-400">+3</span> this month
                  </div>
                </CardContent>
              </Card>
              <Card className="border-purple-500/30 bg-gray-900/60 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                <CardHeader className="pb-2">
                  <CardDescription className="text-purple-200">Favorites</CardDescription>
                  <CardTitle className="text-2xl text-white">56</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-purple-300">
                    <span className="font-medium text-purple-400">+8</span> this month
                  </div>
                </CardContent>
              </Card>
              <Card className="border-purple-500/30 bg-gray-900/60 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                <CardHeader className="pb-2">
                  <CardDescription className="text-purple-200">Following</CardDescription>
                  <CardTitle className="text-2xl text-white">12</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-purple-300">
                    <span className="font-medium text-purple-400">+2</span> this month
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity & Downloads */}
            <Tabs defaultValue="recent" className="space-y-4">
              <TabsList className="bg-gray-900 border-purple-700">
                <TabsTrigger
                  value="recent"
                  className="data-[state=active]:bg-purple-800 data-[state=active]:text-white"
                >
                  Recent Activity
                </TabsTrigger>
                <TabsTrigger
                  value="downloads"
                  className="data-[state=active]:bg-purple-800 data-[state=active]:text-white"
                >
                  Recent Downloads
                </TabsTrigger>
              </TabsList>

              {/* Recent Activity Tab */}
              <TabsContent value="recent" className="space-y-4">
                <Card className="border-purple-500/30 bg-gray-900/60 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                  <CardHeader>
                    <CardTitle className="text-white">Recent Activity</CardTitle>
                    <CardDescription className="text-purple-200">
                      Your latest interactions on the platform
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-4 border-b border-purple-800/30 pb-4 last:border-0"
                        >
                          <div className="rounded-md bg-purple-900/30 p-2">
                            {
                              [
                                <Heart key="heart" className="h-4 w-4 text-purple-400" />,
                                <Download key="download" className="h-4 w-4 text-purple-400" />,
                                <ShoppingCart key="cart" className="h-4 w-4 text-purple-400" />,
                                <Star key="star" className="h-4 w-4 text-purple-400" />,
                                <Package key="package" className="h-4 w-4 text-purple-400" />,
                              ][i]
                            }
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-white">
                              {
                                [
                                  "Added item to favorites",
                                  "Downloaded premium content",
                                  "Purchased new item",
                                  "Rated a creator",
                                  "Subscribed to Premium plan",
                                ][i]
                              }
                            </h4>
                            <p className="text-sm text-purple-200">
                              {
                                [
                                  "Abstract Digital Art Pack",
                                  "City Nightscape Photo Collection",
                                  "3D Model Asset Bundle",
                                  "Creator: DigitalDesigner",
                                  "Premium Monthly Subscription",
                                ][i]
                              }
                            </p>
                            <div className="mt-1 flex items-center text-xs text-purple-300">
                              <Clock className="mr-1 h-3 w-3" />
                              {["2 hours ago", "Yesterday", "2 days ago", "3 days ago", "1 week ago"][i]}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-purple-400 hover:bg-purple-900/30 hover:text-purple-300"
                          >
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full border-purple-700 text-purple-200 hover:bg-purple-900/50 hover:text-white"
                    >
                      View All Activity
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Recent Downloads Tab */}
              <TabsContent value="downloads" className="space-y-4">
                <Card className="border-purple-500/30 bg-gray-900/60 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                  <CardHeader>
                    <CardTitle className="text-white">Recent Downloads</CardTitle>
                    <CardDescription className="text-purple-200">Content you've downloaded recently</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex gap-4 border-b border-purple-800/30 pb-4 last:border-0">
                          <div className="relative h-16 w-16 overflow-hidden rounded-md">
                            <Image
                              src={`/placeholder.svg?height=64&width=64`}
                              width={64}
                              height={64}
                              alt={`Download ${i + 1}`}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex flex-1 flex-col justify-center">
                            <h4 className="font-medium text-white">
                              {
                                [
                                  "Abstract Pattern Set",
                                  "Urban Photography Pack",
                                  "Landscape Textures",
                                  "Digital Art Assets",
                                ][i]
                              }
                            </h4>
                            <p className="text-sm text-purple-200">
                              {["15 files", "8 files", "12 files", "20 files"][i]} •{" "}
                              {["PNG", "JPG", "PNG/SVG", "PSD/AI"][i]}
                            </p>
                            <div className="mt-1 text-xs text-purple-300">
                              Downloaded {["1 day ago", "3 days ago", "1 week ago", "2 weeks ago"][i]}
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="self-center border-purple-700 text-purple-200 hover:bg-purple-900/50 hover:text-white"
                          >
                            <Download className="mr-1 h-3 w-3" />
                            Redownload
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full border-purple-700 text-purple-200 hover:bg-purple-900/50 hover:text-white"
                    >
                      View All Downloads
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  )
}
