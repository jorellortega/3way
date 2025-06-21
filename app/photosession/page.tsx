"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar as CalendarIcon, CheckCircle, Video, Image as ImageIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

const mediaPackages = [
  {
    name: "Starter Media Pack",
    price: 250,
    features: ["30-min photo session", "5 retouched photos", "1 short-form video (30s)"],
    description: "Perfect for social media profiles and quick content.",
  },
  {
    name: "Pro Content Package",
    price: 550,
    features: ["90-min photo & video session", "15 retouched photos", "3 short-form videos (up to 60s)"],
    description: "Ideal for creators building a comprehensive portfolio.",
    popular: true,
  },
  {
    name: "Brand Builder Session",
    price: 950,
    features: ["3-hour full session", "30+ retouched photos", "1 long-form video (2-3 min)", "5 short-form videos"],
    description: "A complete media solution to define your brand.",
  },
]

export default function PhotoSessionPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedPackage, setSelectedPackage] = useState(mediaPackages[1].name)
  const [bookingStatus, setBookingStatus] = useState<"idle" | "submitting" | "success">("idle")

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setBookingStatus("submitting")
    // In a real app, you'd handle form submission (e.g., API call, etc.)
    console.log("Booking submitted with:", {
      name: (e.currentTarget.elements.namedItem('name') as HTMLInputElement).value,
      email: (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value,
      package: selectedPackage,
      date: date ? format(date, "PPP") : "No date selected",
      message: (e.currentTarget.elements.namedItem('message') as HTMLTextAreaElement).value,
    });
    setTimeout(() => {
      setBookingStatus("success")
    }, 1500)
  }

  return (
    <div className="bg-gradient-to-br from-gray-950 via-purple-950/80 to-gray-950 text-purple-100 min-h-screen">
      <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-paradisePink tracking-tight sm:text-5xl">Book a Photo & Video Session</h1>
          <p className="mt-4 text-lg text-purple-200 max-w-2xl mx-auto">
            Create high-quality photos and videos to sell on our platform. We offer several packages to suit your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {mediaPackages.map((pkg) => (
            <Card
              key={pkg.name}
              className={cn(
                "bg-gray-900/50 border border-purple-800/50 flex flex-col",
                pkg.popular ? "border-paradisePink shadow-[0_0_20px_rgba(236,72,153,0.3)]" : ""
              )}
            >
              <CardHeader>
                {pkg.popular && (
                  <div className="text-right">
                    <span className="text-xs font-semibold bg-paradisePink text-white px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardTitle className="text-2xl text-white mt-2">{pkg.name}</CardTitle>
                <CardDescription className="text-purple-300">{pkg.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="text-4xl font-bold text-white mb-6">${pkg.price}</div>
                <ul className="space-y-3 text-purple-200">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-paradisePink" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <div className="p-6 pt-0">
                <Button
                  className={cn(
                    "w-full font-semibold",
                    pkg.name === selectedPackage
                      ? "bg-paradisePink text-white"
                      : "bg-transparent border border-purple-600 text-purple-200 hover:bg-purple-700 hover:text-white"
                  )}
                  onClick={() => setSelectedPackage(pkg.name)}
                >
                  {pkg.name === selectedPackage ? "Selected" : "Select Package"}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="bg-gray-900/50 border border-purple-800/50">
            <CardHeader>
              <CardTitle className="text-2xl text-paradisePink">Your Booking Details</CardTitle>
              <CardDescription className="text-purple-300">
                Fill out the form below to schedule your session.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {bookingStatus === "success" ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white">Booking Request Sent!</h3>
                  <p className="text-purple-200 mt-2">
                    Thank you! We've received your request and will contact you shortly to confirm the details.
                  </p>
                  <Button onClick={() => setBookingStatus("idle")} className="mt-6">
                    Book Another Session
                  </Button>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-purple-200">Full Name</Label>
                      <Input id="name" name="name" placeholder="Your Name" required className="bg-gray-800 border-purple-700" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-purple-200">Email Address</Label>
                      <Input id="email" name="email" type="email" placeholder="your@email.com" required className="bg-gray-800 border-purple-700" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-purple-200">Selected Package</Label>
                      <Select value={selectedPackage} onValueChange={setSelectedPackage}>
                        <SelectTrigger className="w-full bg-gray-800 border-purple-700">
                          <SelectValue placeholder="Select a package" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-purple-700 text-white">
                          {mediaPackages.map(p => <SelectItem key={p.name} value={p.name}>{p.name} - ${p.price}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-purple-200">Preferred Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal bg-gray-800 border-purple-700 hover:text-white",
                              !date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-gray-900 border-purple-700" align="start">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                            className="text-white"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-purple-200">Additional Information</Label>
                    <Textarea id="message" name="message" placeholder="Any special requests or details..." className="bg-gray-800 border-purple-700 min-h-[100px]" />
                  </div>
                  <Button type="submit" size="lg" className="w-full font-semibold" disabled={bookingStatus === "submitting"}>
                    {bookingStatus === "submitting" ? "Submitting..." : "Request Booking"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 