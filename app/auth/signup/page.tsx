"use client"

import Link from "next/link"
import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SignUpPage() {
  const { signUp } = useAuth()
  const router = useRouter()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"user" | "creator">("user")
  const [agree, setAgree] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)
    if (!agree) {
      setError("You must agree to the terms and privacy policy.")
      return
    }
    setLoading(true)
    const { data, error } = await signUp(email, password, {
      first_name: firstName,
      last_name: lastName,
      role: role,
      phone: phone,
    })
    setLoading(false)
    if (error) {
      setError(error instanceof Error ? error.message : "Signup failed.")
    } else if (data && "requiresConfirmation" in data && data.requiresConfirmation) {
      setSuccess(true)
      setError("Please check your email to confirm your account before signing in.")
    } else {
      setSuccess(true)
      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 500)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-950 via-purple-950/80 to-gray-950">
      <div className="container flex flex-1 items-center justify-center px-4 py-12 md:px-6">
        <div className="mx-auto grid w-full max-w-sm gap-6">
          <div className="flex flex-col items-center space-y-2 text-center">
            <div className="flex items-center gap-2 text-2xl font-bold">
              <span className="text-paradiseGold">Paradise</span><span className="text-paradisePink">Baddies</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Create an account</h1>
            <p className="text-sm text-purple-200">Enter your details to create your account</p>
          </div>
          <div className="w-full">
            <Tabs value={role} onValueChange={(value) => setRole(value as "user" | "creator")} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-900/50 border border-purple-700">
                <TabsTrigger 
                  value="user" 
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-purple-200"
                >
                  User
                </TabsTrigger>
                <TabsTrigger 
                  value="creator" 
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-purple-200"
                >
                  Creator
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-purple-100" htmlFor="first-name">
                  First name
                </label>
                <Input
                  className="border-purple-700 bg-gray-900 text-white placeholder:text-purple-300 focus-visible:ring-purple-500"
                  id="first-name"
                  placeholder="John"
                  autoCapitalize="words"
                  autoComplete="given-name"
                  autoCorrect="off"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-purple-100" htmlFor="last-name">
                  Last name
                </label>
                <Input
                  className="border-purple-700 bg-gray-900 text-white placeholder:text-purple-300 focus-visible:ring-purple-500"
                  id="last-name"
                  placeholder="Doe"
                  autoCapitalize="words"
                  autoComplete="family-name"
                  autoCorrect="off"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-purple-100" htmlFor="email">
                Email
              </label>
              <Input
                className="border-purple-700 bg-gray-900 text-white placeholder:text-purple-300 focus-visible:ring-purple-500"
                id="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-purple-100" htmlFor="phone">
                Phone Number
              </label>
              <Input
                className="border-purple-700 bg-gray-900 text-white placeholder:text-purple-300 focus-visible:ring-purple-500"
                id="phone"
                placeholder="+1 (555) 123-4567"
                type="tel"
                autoCapitalize="none"
                autoComplete="tel"
                autoCorrect="off"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-purple-100" htmlFor="password">
                Password
              </label>
              <Input
                className="border-purple-700 bg-gray-900 text-white placeholder:text-purple-300 focus-visible:ring-purple-500"
                id="password"
                type="password"
                placeholder="••••••••"
                autoCapitalize="none"
                autoComplete="new-password"
                autoCorrect="off"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" className="border-purple-700 data-[state=checked]:bg-purple-600" checked={agree} onCheckedChange={v => setAgree(!!v)} />
              <label
                htmlFor="terms"
                className="text-xs font-medium leading-none text-purple-200 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the{" "}
                <Link href="/terms" className="text-purple-400 hover:text-purple-300 hover:underline">
                  terms of service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-purple-400 hover:text-purple-300 hover:underline">
                  privacy policy
                </Link>
              </label>
            </div>
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white" type="submit" disabled={loading}>{loading ? "Signing up..." : "Sign Up"}</Button>
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            {success && <div className="text-green-500 text-sm text-center">Account created successfully! Redirecting...</div>}
            <div className="relative flex items-center justify-center">
              <Separator className="bg-purple-700/50" />
              <span className="absolute bg-gray-950 px-2 text-xs text-purple-300">OR CONTINUE WITH</span>
            </div>
          </form>
          <div className="mt-4 text-center text-sm text-purple-200">
            Already have an account?{" "}
            <Link href="/auth/signin" className="font-medium text-purple-400 hover:text-purple-300">
              Sign in
            </Link>
          </div>
          <div className="mt-6 text-xs text-center text-purple-400 bg-purple-900/40 border border-purple-800 rounded p-3 transition-colors duration-200 hover:bg-purple-900 hover:text-white hover:border-paradiseGold">
            <strong>Important:</strong> Before you can publish or sell content, we are required to verify your identity and confirm you are of legal age (18+). This helps us comply with international laws and protect our community. You will be contacted for verification after signup if you wish to become a creator.
          </div>
          {/* How It Works Card */}
          <div className="mt-8">
            <a
              href="/howto"
              className="block w-full rounded-xl bg-purple-900/40 border border-purple-800 p-3 text-center transition-opacity duration-300"
              style={{ opacity: 0.15 }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '0.15')}
            >
              <h2 className="text-lg font-semibold mb-1 text-purple-200">How Paradise Baddies Works</h2>
              <p className="mb-1 text-purple-300">New here? Learn how to get started, stay safe, and make the most of our platform.</p>
              <span className="inline-block mt-1 px-3 py-1 rounded bg-purple-800 text-purple-100 text-xs font-medium">Learn More</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
