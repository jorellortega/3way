import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, CreditCard, Lock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/80 to-gray-950">
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="mb-4 flex items-center gap-2">
          <Link href="/cart" className="flex items-center gap-1 text-sm text-purple-300 hover:text-purple-400">
            <ArrowLeft className="h-4 w-4" />
            Back to Cart
          </Link>
        </div>

        <h1 className="mb-6 text-2xl font-bold text-white md:text-3xl">Checkout</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Order Summary */}
          <div className="lg:col-span-1 lg:order-last">
            <div className="rounded-lg border border-purple-500/30 bg-gray-900/60 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
              <div className="p-6">
                <h2 className="mb-4 text-lg font-medium text-white">Order Summary</h2>
                <div className="space-y-4">
                  {/* Cart items */}
                  <div className="space-y-3">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="relative h-16 w-16 overflow-hidden rounded-md">
                          <Image
                            src={`/placeholder.svg?height=64&width=64`}
                            width={64}
                            height={64}
                            alt={`Item ${i + 1}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex flex-1 flex-col justify-center">
                          <h4 className="font-medium text-white">
                            {["Abstract Digital Art Pack", "Night City Photo Set"][i]}
                          </h4>
                          <p className="text-sm text-purple-200">{i === 0 ? "Individual Asset" : "Package"}</p>
                        </div>
                        <div className="flex flex-col items-end justify-center">
                          <p className="font-medium text-purple-400">${[19.99, 49.99][i]}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="bg-purple-700/30" />

                  {/* Order costs */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-200">Subtotal</span>
                      <span className="text-white">$69.98</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-200">Discount</span>
                      <span className="text-purple-400">-$5.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-200">Tax</span>
                      <span className="text-white">$6.50</span>
                    </div>
                  </div>

                  <Separator className="bg-purple-700/30" />

                  {/* Total */}
                  <div className="flex justify-between">
                    <span className="text-base font-medium text-white">Total</span>
                    <span className="text-base font-medium text-white">$71.48</span>
                  </div>

                  {/* Promo code */}
                  <div className="mt-6">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Promo code"
                        className="border-purple-700 bg-gray-900 text-white placeholder:text-purple-300 focus-visible:ring-purple-500"
                      />
                      <Button className="bg-purple-600 hover:bg-purple-700 text-white">Apply</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-purple-500/30 bg-gray-900/60 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
              <div className="p-6">
                <h2 className="mb-4 text-lg font-medium text-white">Payment Information</h2>
                <div className="space-y-6">
                  {/* Payment methods */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-purple-100">Payment Method</Label>
                    <RadioGroup defaultValue="credit-card" className="grid gap-2">
                      <div className="flex items-center">
                        <RadioGroupItem
                          value="credit-card"
                          id="credit-card"
                          className="border-purple-700 text-purple-600"
                        />
                        <Label
                          htmlFor="credit-card"
                          className="flex flex-1 items-center gap-2 rounded-md border border-purple-700 bg-gray-900 p-3 text-purple-200 hover:border-purple-600 hover:bg-gray-900/90 peer-data-[state=checked]:border-purple-500 [&:has([data-state=checked])]:border-purple-500"
                        >
                          <CreditCard className="h-4 w-4" />
                          Credit / Debit Card
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="paypal" id="paypal" className="border-purple-700 text-purple-600" />
                        <Label
                          htmlFor="paypal"
                          className="flex flex-1 items-center gap-2 rounded-md border border-purple-700 bg-gray-900 p-3 text-purple-200 hover:border-purple-600 hover:bg-gray-900/90 peer-data-[state=checked]:border-purple-500 [&:has([data-state=checked])]:border-purple-500"
                        >
                          <Image
                            src="/placeholder.svg?height=16&width=16"
                            width={16}
                            height={16}
                            alt="PayPal"
                            className="h-4 w-4"
                          />
                          PayPal
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Card details */}
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="card-number" className="text-sm font-medium text-purple-100">
                        Card Number
                      </Label>
                      <Input
                        id="card-number"
                        placeholder="0000 0000 0000 0000"
                        className="border-purple-700 bg-gray-900 text-white placeholder:text-purple-300 focus-visible:ring-purple-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="expiry" className="text-sm font-medium text-purple-100">
                          Expiry Date
                        </Label>
                        <Input
                          id="expiry"
                          placeholder="MM/YY"
                          className="border-purple-700 bg-gray-900 text-white placeholder:text-purple-300 focus-visible:ring-purple-500"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="cvc" className="text-sm font-medium text-purple-100">
                          CVC
                        </Label>
                        <Input
                          id="cvc"
                          placeholder="000"
                          className="border-purple-700 bg-gray-900 text-white placeholder:text-purple-300 focus-visible:ring-purple-500"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-purple-700/30" />

                  {/* Billing address */}
                  <div className="space-y-4">
                    <h3 className="text-base font-medium text-white">Billing Address</h3>

                    <div className="grid gap-2">
                      <Label htmlFor="full-name" className="text-sm font-medium text-purple-100">
                        Full Name
                      </Label>
                      <Input
                        id="full-name"
                        placeholder="John Doe"
                        className="border-purple-700 bg-gray-900 text-white placeholder:text-purple-300 focus-visible:ring-purple-500"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="address" className="text-sm font-medium text-purple-100">
                        Address
                      </Label>
                      <Input
                        id="address"
                        placeholder="123 Main St"
                        className="border-purple-700 bg-gray-900 text-white placeholder:text-purple-300 focus-visible:ring-purple-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="city" className="text-sm font-medium text-purple-100">
                          City
                        </Label>
                        <Input
                          id="city"
                          placeholder="New York"
                          className="border-purple-700 bg-gray-900 text-white placeholder:text-purple-300 focus-visible:ring-purple-500"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="zip" className="text-sm font-medium text-purple-100">
                          ZIP Code
                        </Label>
                        <Input
                          id="zip"
                          placeholder="10001"
                          className="border-purple-700 bg-gray-900 text-white placeholder:text-purple-300 focus-visible:ring-purple-500"
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="country" className="text-sm font-medium text-purple-100">
                        Country
                      </Label>
                      <Select>
                        <SelectTrigger className="border-purple-700 bg-gray-900 text-white focus:ring-purple-500">
                          <SelectValue placeholder="Select a country" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-purple-700 text-purple-200">
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="ca">Canada</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="au">Australia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-purple-700/30 p-6">
                <Button size="lg" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  <Lock className="mr-2 h-4 w-4" />
                  Complete Payment
                </Button>
                <p className="mt-4 text-center text-xs text-purple-300">
                  Your payment information is secured with 256-bit encryption.
                  <br />
                  By completing this purchase, you agree to our{" "}
                  <Link href="/terms" className="text-purple-400 hover:text-purple-300 hover:underline">
                    Terms of Service
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
