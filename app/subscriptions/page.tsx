import Link from "next/link"
import { Check } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function SubscriptionsPage() {
  return (
    <div className="container px-4 py-12 md:px-6 md:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Choose Your Subscription Plan</h1>
        <p className="mt-4 text-gray-500 dark:text-gray-400">
          Get unlimited access to premium digital content with our flexible subscription plans.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl gap-8 md:grid-cols-3">
        {/* Basic Plan */}
        <div className="flex flex-col rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <div className="mb-4">
            <h3 className="text-xl font-bold">Basic</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">For casual browsers</p>
          </div>
          <div className="mb-4">
            <span className="text-4xl font-bold">$9.99</span>
            <span className="text-gray-500 dark:text-gray-400">/month</span>
          </div>
          <ul className="mb-6 space-y-2 text-sm">
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-teal-600 dark:text-teal-400" />
              Access to standard content
            </li>
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-teal-600 dark:text-teal-400" />
              10 downloads per month
            </li>
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-teal-600 dark:text-teal-400" />
              Standard resolution
            </li>
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-teal-600 dark:text-teal-400" />
              Personal use only
            </li>
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-teal-600 dark:text-teal-400" />
              Basic support
            </li>
          </ul>
          <div className="mt-auto space-y-3">
            <Button className="w-full bg-teal-600 hover:bg-teal-700">Subscribe Monthly</Button>
            <Button variant="outline" className="w-full">
              $99.99/year (Save 17%)
            </Button>
          </div>
        </div>

        {/* Premium Plan */}
        <div className="relative flex flex-col rounded-lg border border-teal-600 bg-white p-6 shadow-md dark:bg-gray-950">
          <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-teal-600 px-3 py-1 text-xs font-semibold text-white">
            Most Popular
          </div>
          <div className="mb-4">
            <h3 className="text-xl font-bold">Premium</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">For enthusiasts</p>
          </div>
          <div className="mb-4">
            <span className="text-4xl font-bold">$19.99</span>
            <span className="text-gray-500 dark:text-gray-400">/month</span>
          </div>
          <ul className="mb-6 space-y-2 text-sm">
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-teal-600 dark:text-teal-400" />
              Access to premium content
            </li>
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-teal-600 dark:text-teal-400" />
              50 downloads per month
            </li>
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-teal-600 dark:text-teal-400" />
              High resolution
            </li>
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-teal-600 dark:text-teal-400" />
              Personal and small commercial use
            </li>
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-teal-600 dark:text-teal-400" />
              Priority support
            </li>
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-teal-600 dark:text-teal-400" />
              Early access to new content
            </li>
          </ul>
          <div className="mt-auto space-y-3">
            <Button className="w-full bg-teal-600 hover:bg-teal-700">Subscribe Monthly</Button>
            <Button variant="outline" className="w-full">
              $199.99/year (Save 17%)
            </Button>
          </div>
        </div>

        {/* Pro Plan */}
        <div className="flex flex-col rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <div className="mb-4">
            <h3 className="text-xl font-bold">Pro</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">For professionals</p>
          </div>
          <div className="mb-4">
            <span className="text-4xl font-bold">$39.99</span>
            <span className="text-gray-500 dark:text-gray-400">/month</span>
          </div>
          <ul className="mb-6 space-y-2 text-sm">
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-teal-600 dark:text-teal-400" />
              Access to all content
            </li>
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-teal-600 dark:text-teal-400" />
              Unlimited downloads
            </li>
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-teal-600 dark:text-teal-400" />
              Maximum resolution
            </li>
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-teal-600 dark:text-teal-400" />
              Full commercial usage rights
            </li>
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-teal-600 dark:text-teal-400" />
              24/7 priority support
            </li>
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-teal-600 dark:text-teal-400" />
              Exclusive content access
            </li>
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-teal-600 dark:text-teal-400" />
              Custom content requests
            </li>
          </ul>
          <div className="mt-auto space-y-3">
            <Button className="w-full bg-teal-600 hover:bg-teal-700">Subscribe Monthly</Button>
            <Button variant="outline" className="w-full">
              $399.99/year (Save 17%)
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-3xl rounded-lg border bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-xl font-bold">Frequently Asked Questions</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="font-medium">Can I cancel my subscription anytime?</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing
              period.
            </p>
          </div>
          <div>
            <h3 className="font-medium">How do downloads work?</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Downloads are counted when you save content to your device. Unused downloads don't roll over to the next
              month.
            </p>
          </div>
          <div>
            <h3 className="font-medium">What payment methods do you accept?</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              We accept all major credit cards, PayPal, and Apple Pay. All transactions are secure and encrypted.
            </p>
          </div>
          <div>
            <h3 className="font-medium">Can I upgrade my plan later?</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Yes, you can upgrade your plan at any time. The new rate will be prorated for the remainder of your
              billing cycle.
            </p>
          </div>
        </div>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Have more questions?{" "}
            <Link href="/contact" className="text-teal-600 hover:underline">
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
