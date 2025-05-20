"use client"

import { BarChart2, DollarSign, Percent, TrendingUp, ShoppingBag, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const CREATOR_PERCENT = 80
const PLATFORM_PERCENT = 20

const mockStats = {
  totalSales: 42,
  totalRevenue: 1240.50,
  downloads: 320,
  views: 2100,
  topSelling: "Summer Collection 2024"
}

const mockSales = [
  { id: 1, item: "Summer Collection 2024", date: "2024-06-01", price: 49.99, earnings: 39.99 },
  { id: 2, item: "Beach Photoshoot", date: "2024-05-28", price: 29.99, earnings: 23.99 },
  { id: 3, item: "Digital Art Bundle", date: "2024-05-25", price: 19.99, earnings: 15.99 },
  { id: 4, item: "Tutorial Series", date: "2024-05-20", price: 59.99, earnings: 47.99 },
  { id: 5, item: "Music Collection", date: "2024-05-18", price: 9.99, earnings: 7.99 },
]

export default function CreatorDash() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <h1 className="text-3xl font-bold text-white mb-8">Creator Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gray-900 border-purple-900/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg text-white">Total Sales</CardTitle>
            <ShoppingBag className="h-6 w-6 text-paradisePink" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-paradiseGold">{mockStats.totalSales}</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-purple-900/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg text-white">Total Revenue</CardTitle>
            <DollarSign className="h-6 w-6 text-paradisePink" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-paradiseGold">${mockStats.totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-purple-900/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg text-white">Your Percentage</CardTitle>
            <Percent className="h-6 w-6 text-paradisePink" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-paradiseGold">{CREATOR_PERCENT}% <span className="text-purple-200 text-base font-normal">(Platform: {PLATFORM_PERCENT}%)</span></div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gray-900 border-purple-900/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg text-white">Downloads</CardTitle>
            <TrendingUp className="h-6 w-6 text-paradisePink" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-paradiseGold">{mockStats.downloads}</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-purple-900/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg text-white">Views</CardTitle>
            <BarChart2 className="h-6 w-6 text-paradisePink" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-paradiseGold">{mockStats.views}</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-purple-900/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg text-white">Top Selling</CardTitle>
            <Users className="h-6 w-6 text-paradisePink" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold text-white">{mockStats.topSelling}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-900 border-purple-900/40 mb-8">
        <CardHeader>
          <CardTitle className="text-xl text-white">Recent Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-purple-200">
              <thead>
                <tr className="bg-gray-800">
                  <th className="px-4 py-2 text-left">Item</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Price</th>
                  <th className="px-4 py-2 text-left">Your Earnings</th>
                  <th className="px-4 py-2 text-left">Platform Fee</th>
                </tr>
              </thead>
              <tbody>
                {mockSales.map(sale => (
                  <tr key={sale.id} className="border-b border-purple-900/40 hover:bg-gray-800">
                    <td className="px-4 py-2 font-semibold text-white">{sale.item}</td>
                    <td className="px-4 py-2">{sale.date}</td>
                    <td className="px-4 py-2">${sale.price.toFixed(2)}</td>
                    <td className="px-4 py-2 text-green-400 font-semibold">${sale.earnings.toFixed(2)}</td>
                    <td className="px-4 py-2 text-red-400 font-semibold">${(sale.price - sale.earnings).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <a href="/withdraw">
          <Button className="bg-paradisePink hover:bg-paradiseGold text-white font-semibold px-8 py-2">Withdraw Earnings</Button>
        </a>
      </div>
    </div>
  )
} 