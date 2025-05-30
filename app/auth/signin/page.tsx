'use client';

import Link from "next/link"
import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export default function SignInPage() {
  const { signIn } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    const { data, error } = await signIn(email, password)
    setLoading(false)
    if (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError(error?.toString() || "Sign in failed.")
      }
    } else {
      window.location.href = "/dashboard"
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
            <h1 className="text-2xl font-bold text-white">Sign in to your account</h1>
            <p className="text-sm text-purple-200">Enter your email and password to access your account</p>
          </div>
          <form className="grid gap-4" onSubmit={handleSubmit}>
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
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-purple-100" htmlFor="password">
                  Password
                </label>
                <Link className="text-sm text-purple-400 hover:text-purple-300" href="/auth/reset-password">
                  Forgot password?
                </Link>
              </div>
              <Input
                className="border-purple-700 bg-gray-900 text-white placeholder:text-purple-300 focus-visible:ring-purple-500"
                id="password"
                type="password"
                placeholder="••••••••"
                autoCapitalize="none"
                autoComplete="current-password"
                autoCorrect="off"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <div className="relative flex items-center justify-center">
              <Separator className="bg-purple-700/50" />
              <span className="absolute bg-gray-950 px-2 text-xs text-purple-300">OR CONTINUE WITH</span>
            </div>
          </form>
          <div className="mt-4 text-center text-sm text-purple-200">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="font-medium text-purple-400 hover:text-purple-300">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
